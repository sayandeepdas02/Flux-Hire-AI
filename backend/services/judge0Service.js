import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.RAPIDAPI_KEY;

// Language IDs for Judge0 API
const LANGUAGE_IDS = {
    cpp: 54,        // C++ (GCC 9.2.0)
    java: 62,       // Java (OpenJDK 13.0.1)
    javascript: 63, // JavaScript (Node.js 12.14.0)
    go: 60,         // Go (1.13.5)
    python: 71,     // Python (3.8.1)
};

/**
 * Execute code using Judge0 API (synchronous mode)
 * @param {string} language - Language key (cpp, java, javascript, go, python)
 * @param {string} code - Source code to execute
 * @param {string} input - Standard input for the program
 * @returns {Promise<Object>} Execution result with stdout, stderr, status, time
 */
export async function executeCode(language, code, input = '') {
    try {
        const languageId = LANGUAGE_IDS[language];

        if (!languageId) {
            throw new Error(`Unsupported language: ${language}`);
        }

        // Prepare submission data
        const submissionData = {
            source_code: Buffer.from(code).toString('base64'),
            language_id: languageId,
            stdin: Buffer.from(input).toString('base64'),
        };

        // Submit to Judge0 with wait=true for synchronous execution
        const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?wait=true`,
            submissionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': JUDGE0_API_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        const result = response.data;

        // Decode base64 outputs
        const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : '';
        const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : '';
        const compileOutput = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : '';

        return {
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            compileOutput: compileOutput.trim(),
            status: result.status.description,
            statusId: result.status.id,
            time: result.time,
            memory: result.memory,
        };
    } catch (error) {
        console.error('Judge0 execution error:', error);

        if (error.response) {
            throw new Error(`Judge0 API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
            throw new Error('Judge0 API is not responding');
        } else {
            throw new Error(`Execution error: ${error.message}`);
        }
    }
}

/**
 * Run code against multiple test cases
 * @param {string} language - Language key
 * @param {string} code - Source code
 * @param {Array} testCases - Array of {input, expectedOutput}
 * @returns {Promise<Object>} Results with passed count and details
 */
export async function runTestCases(language, code, testCases) {
    const results = [];
    let passed = 0;

    for (const testCase of testCases) {
        try {
            const result = await executeCode(language, code, testCase.input);

            const actualOutput = result.stdout.trim();
            const expectedOutput = testCase.expectedOutput.trim();
            const isCorrect = actualOutput === expectedOutput;

            if (isCorrect) {
                passed++;
            }

            results.push({
                input: testCase.input,
                expectedOutput,
                actualOutput,
                passed: isCorrect,
                status: result.status,
                time: result.time,
            });
        } catch (error) {
            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: '',
                passed: false,
                status: 'Error',
                error: error.message,
            });
        }
    }

    return {
        passed,
        total: testCases.length,
        results,
    };
}

export default {
    executeCode,
    runTestCases,
};

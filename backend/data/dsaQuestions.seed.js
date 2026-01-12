// Hardcoded DSA questions for Round 2
// 4 questions with test cases

export const DSA_QUESTIONS = [
    {
        questionNumber: 1,
        title: "Spiral Matrix",
        difficulty: "Medium",
        topic: "Arrays / Simulation",
        description: `Given an m x n matrix, return all elements of the matrix in spiral order.

**Example:**
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

**Explanation:**
Start from top-left, move right → down → left → up in a spiral pattern.`,
        constraints: [
            "m == matrix.length",
            "n == matrix[i].length",
            "1 <= m, n <= 10",
            "-100 <= matrix[i][j] <= 100"
        ],
        examples: [
            {
                input: "[[1,2,3],[4,5,6],[7,8,9]]",
                output: "[1,2,3,6,9,8,7,4,5]",
                explanation: "Spiral order: right → down → left → up"
            },
            {
                input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
                output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
                explanation: "3x4 matrix in spiral order"
            }
        ],
        testCases: [
            { input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1,2,3,6,9,8,7,4,5]" },
            { input: "[[1,2],[3,4]]", expectedOutput: "[1,2,4,3]" },
            { input: "[[1]]", expectedOutput: "[1]" },
        ],
        starterCode: {
            cpp: `#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Your code here
}`,
            java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        // Your code here
    }
}`,
            javascript: `function spiralOrder(matrix) {
    // Your code here
}`,
            go: `func spiralOrder(matrix [][]int) []int {
    // Your code here
}`,
            python: `def spiralOrder(matrix):
    # Your code here
    pass`
        }
    },
    {
        questionNumber: 2,
        title: "Multiply Strings",
        difficulty: "Medium",
        topic: "Strings / Math",
        description: `Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.

**Example:**
Input: num1 = "123", num2 = "456"
Output: "56088"`,
        constraints: [
            "1 <= num1.length, num2.length <= 200",
            "num1 and num2 consist of digits only",
            "Both num1 and num2 do not contain any leading zero, except the number 0 itself"
        ],
        examples: [
            {
                input: 'num1 = "123", num2 = "456"',
                output: '"56088"',
                explanation: "123 × 456 = 56088"
            },
            {
                input: 'num1 = "2", num2 = "3"',
                output: '"6"',
                explanation: "2 × 3 = 6"
            }
        ],
        testCases: [
            { input: '"123" "456"', expectedOutput: '"56088"' },
            { input: '"2" "3"', expectedOutput: '"6"' },
            { input: '"0" "0"', expectedOutput: '"0"' },
        ],
        starterCode: {
            cpp: `#include <string>
using namespace std;

string multiply(string num1, string num2) {
    // Your code here
}`,
            java: `class Solution {
    public String multiply(String num1, String num2) {
        // Your code here
    }
}`,
            javascript: `function multiply(num1, num2) {
    // Your code here
}`,
            go: `func multiply(num1 string, num2 string) string {
    // Your code here
}`,
            python: `def multiply(num1, num2):
    # Your code here
    pass`
        }
    },
    {
        questionNumber: 3,
        title: "Steps to Make Array Non-Decreasing",
        difficulty: "Hard",
        topic: "Monotonic Stack / Greedy",
        description: `You are given a 0-indexed integer array nums. In one step, remove all elements nums[i] where nums[i - 1] > nums[i] for all 0 < i < nums.length.

Return the number of steps performed until nums becomes a non-decreasing array.

**Example:**
Input: nums = [5,3,4,4,7,3,6,11,8,5,11]
Output: 3

**Explanation:**
Step 1: [5,3,4,4,7,3,6,11,8,5,11] → [5,4,4,7,6,11,11]
Step 2: [5,4,4,7,6,11,11] → [5,7,11,11]
Step 3: [5,7,11,11] → [5,7,11,11] (non-decreasing)`,
        constraints: [
            "1 <= nums.length <= 10^5",
            "1 <= nums[i] <= 10^9"
        ],
        examples: [
            {
                input: "[5,3,4,4,7,3,6,11,8,5,11]",
                output: "3",
                explanation: "Takes 3 steps to make array non-decreasing"
            },
            {
                input: "[4,5,7,7,13]",
                output: "0",
                explanation: "Already non-decreasing"
            }
        ],
        testCases: [
            { input: "[5,3,4,4,7,3,6,11,8,5,11]", expectedOutput: "3" },
            { input: "[4,5,7,7,13]", expectedOutput: "0" },
            { input: "[1]", expectedOutput: "0" },
        ],
        starterCode: {
            cpp: `#include <vector>
using namespace std;

int totalSteps(vector<int>& nums) {
    // Your code here
}`,
            java: `class Solution {
    public int totalSteps(int[] nums) {
        // Your code here
    }
}`,
            javascript: `function totalSteps(nums) {
    // Your code here
}`,
            go: `func totalSteps(nums []int) int {
    // Your code here
}`,
            python: `def totalSteps(nums):
    # Your code here
    pass`
        }
    },
    {
        questionNumber: 4,
        title: "Number of Matching Subsequences",
        difficulty: "Medium",
        topic: "Hashing / Binary Search",
        description: `Given a string s and an array of strings words, return the number of words[i] that is a subsequence of s.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

**Example:**
Input: s = "abcde", words = ["a","bb","acd","ace"]
Output: 3

**Explanation:**
- "a" is a subsequence of "abcde"
- "bb" is NOT a subsequence
- "acd" is a subsequence
- "ace" is a subsequence`,
        constraints: [
            "1 <= s.length <= 5 * 10^4",
            "1 <= words.length <= 5000",
            "1 <= words[i].length <= 50",
            "s and words[i] consist of only lowercase English letters"
        ],
        examples: [
            {
                input: 's = "abcde", words = ["a","bb","acd","ace"]',
                output: "3",
                explanation: '["a","acd","ace"] are subsequences'
            },
            {
                input: 's = "dsahjpjauf", words = ["ahjpjau","ja","ahbwzgqnuk","ahbwzgqnuk"]',
                output: "2",
                explanation: '["ahjpjau","ja"] are subsequences'
            }
        ],
        testCases: [
            { input: '"abcde" ["a","bb","acd","ace"]', expectedOutput: "3" },
            { input: '"dsahjpjauf" ["ahjpjau","ja","ahbwzgqnuk"]', expectedOutput: "2" },
        ],
        starterCode: {
            cpp: `#include <string>
#include <vector>
using namespace std;

int numMatchingSubseq(string s, vector<string>& words) {
    // Your code here
}`,
            java: `class Solution {
    public int numMatchingSubseq(String s, String[] words) {
        // Your code here
    }
}`,
            javascript: `function numMatchingSubseq(s, words) {
    // Your code here
}`,
            go: `func numMatchingSubseq(s string, words []string) int {
    // Your code here
}`,
            python: `def numMatchingSubseq(s, words):
    # Your code here
    pass`
        }
    }
];

// Export function to get questions without test cases (for frontend)
export function getQuestionsForRound2() {
    return DSA_QUESTIONS.map(q => ({
        questionNumber: q.questionNumber,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        description: q.description,
        constraints: q.constraints,
        examples: q.examples,
        starterCode: q.starterCode,
    }));
}

// Export function to get test cases (for backend validation)
export function getTestCases(questionNumber) {
    const question = DSA_QUESTIONS.find(q => q.questionNumber === questionNumber);
    return question ? question.testCases : [];
}

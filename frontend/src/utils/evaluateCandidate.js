import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // frontend-only, later move to backend
});

export async function evaluateCandidateWithAI(candidate) {
  try {
    const prompt = `
    You are a recruiter. Evaluate the candidate's resume below.

    Resume:
    ${candidate.resumeText}

    Provide:
    - Score (0–100)
    - 2-3 sentence summary of their profile

    Format your response as:
    Score: [number]
    Summary: [summary text]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const result = response.choices[0].message.content;

    const scoreMatch = result.match(/Score:\s*(\d+)/i);
    const summaryMatch = result.match(/Summary:\s*(.+)/is);

    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : null,
      summary: summaryMatch ? summaryMatch[1].trim() : "Evaluation unavailable",
    };
  } catch (err) {
    console.error("Error evaluating candidate:", err);
    return { score: null, summary: "Error evaluating candidate" };
  }
}

export default async function handler(req, res) {
  try {
    const { medicineName } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a medical information assistant. Always reply ONLY with valid JSON. No markdown, no backticks, no extra text."
            },
            {
              role: "user",
              content: `Medicine Name: ${medicineName}

Provide:
1. Uses of this medicine in English (2-3 lines)
2. Telugu explanation (2-3 lines)

Reply ONLY in this exact JSON format:
{
  "uses": "...",
  "teluguExplanation": "..."
}`
            }
          ],
          max_tokens: 512,
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({
        uses: "Medicine information unavailable",
        teluguExplanation: "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు."
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "{}";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(cleaned));

  } catch (error) {
    return res.status(200).json({
      uses: "Medicine information unavailable",
      teluguExplanation: "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు."
    });
  }
}


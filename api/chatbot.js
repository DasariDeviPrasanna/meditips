export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMessage, medicineName, conversationHistory } = req.body;

    if (!userMessage || !medicineName) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const messages = [];

    messages.push({
      role: "system",
      content: `You are a helpful medical assistant chatbot for the MediTips app.
The user scanned a medicine: "${medicineName}".
Answer questions about this medicine clearly.
Respond in the same language the user writes (English, Telugu, or Hindi).
Keep answers to 3-5 lines. Add disclaimer for medical advice.`
    });

    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory) {
        messages.push({ role: turn.role, content: turn.text });
      }
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen/qwen3.6-27b",
          messages,
          max_tokens: 512,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "Sorry, try again." });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, try again.";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: "Something went wrong. Please try again." });
  }
}

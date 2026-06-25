export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { userMessage, medicineName, conversationHistory } = req.body;

    if (!userMessage || !medicineName) {
      return res.status(400).json({ error: "Missing userMessage or medicineName" });
    }

    // Build messages array (Groq uses OpenAI-compatible format)
    const messages = [];

    // System prompt — sets the chatbot context
    messages.push({
      role: "system",
      content: `You are a helpful medical assistant chatbot for the MediTips app.
The user has just scanned a medicine strip and the detected medicine is: "${medicineName}".
Answer questions about this medicine clearly and helpfully.
Always respond in the same language the user writes in (English, Telugu, or Hindi).
Keep answers concise (3-5 lines max). Add a disclaimer if giving medical advice.`
    });

    // Add conversation history (previous turns) for multi-turn context
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory) {
        messages.push({
          role: turn.role,   // "user" or "assistant"
          content: turn.text
        });
      }
    }

    // Add the latest user message
    messages.push({
      role: "user",
      content: userMessage
    });

    // Call Groq API (OpenAI-compatible endpoint)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",  // Free model on Groq
          messages,
          max_tokens: 512,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]
        ?.message?.content
        ?.trim() || "Sorry, I could not understand that. Please try again.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(200).json({
      reply: "Sorry, something went wrong. Please try again."
    });
  }

}

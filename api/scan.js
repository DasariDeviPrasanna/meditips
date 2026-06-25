export default async function handler(req, res) {

  try {

    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Groq vision — send image as base64 data URL (OpenAI-compatible format)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct", // Free vision model on Groq
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${image}`
                  }
                },
                {
                  type: "text",
                  text: `Look at this medicine strip or packaging image.
Extract the medicine name printed on it.
Reply with ONLY the medicine name — no extra words, no punctuation, no explanation.
Example reply: Dolo 650`
                }
              ]
            }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      }
    );

    const data = await response.json();

    console.log("GROQ SCAN RESPONSE:", JSON.stringify(data, null, 2));

    const medicineName =
      data?.choices?.[0]
        ?.message?.content
        ?.trim() || "";

    return res.status(200).json({
      medicineName,
      raw: data
    });

  } catch (error) {

    console.error("Scan error:", error);

    return res.status(500).json({
      error: "Scan failed",
      medicineName: ""
    });

  }

}

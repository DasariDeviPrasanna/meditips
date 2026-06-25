export default async function handler(req, res) {

  try {

    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",   // ✅ Latest vision model (replaces llama-4-scout)
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

    // Log error if any
    if (data.error) {
      console.error("Groq API Error:", data.error);
      return res.status(200).json({ medicineName: "", error: data.error.message });
    }

    const medicineName =
      data?.choices?.[0]
        ?.message?.content
        ?.trim() || "";

    return res.status(200).json({ medicineName, raw: data });

  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ error: "Scan failed", medicineName: "" });
  }

}

export default async function handler(req, res) {

  try {

    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // ✅ llama-3.2-90b-vision-preview — confirmed working for base64 images
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.2-90b-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  // ✅ image_url FIRST, text SECOND — Groq requires this order
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${image}`
                  }
                },
                {
                  type: "text",
                  text: "This is a medicine strip or packaging image. Read the medicine name printed on it carefully. Reply with ONLY the medicine name — nothing else, no explanation. Example: Dolo 650"
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
    console.log("GROQ SCAN RESPONSE:", JSON.stringify(data));

    if (data.error) {
      console.error("Groq API Error:", data.error.message);
      return res.status(200).json({ medicineName: "", error: data.error.message });
    }

    const medicineName = data?.choices?.[0]?.message?.content?.trim() || "";

    if (!medicineName) {
      return res.status(200).json({ medicineName: "", error: "No medicine name detected" });
    }

    return res.status(200).json({ medicineName });

  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ error: "Scan failed", medicineName: "" });
  }

}

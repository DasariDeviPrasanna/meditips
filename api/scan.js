export default async function handler(req, res) {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: image
                }
              },
              {
                text: "This is a medicine strip or packaging image. Read the medicine name printed on it carefully. Reply with ONLY the medicine name — nothing else, no explanation. Example: Dolo 650"
              }
            ]
          }],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.1
          }
        })
      }
    );

    const data = await response.json();
    console.log("Gemini Scan Response:", JSON.stringify(data));

    if (data.error) {
      return res.status(200).json({ medicineName: "", error: data.error.message });
    }

    const medicineName = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!medicineName) {
      return res.status(200).json({ medicineName: "", error: "No medicine name detected" });
    }

    return res.status(200).json({ medicineName });

  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ error: "Scan failed", medicineName: "" });
  }
}

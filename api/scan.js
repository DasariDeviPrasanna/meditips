// api/scan.js
export default async function handler(req, res) {

  try {

    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const visionModels = [
      "llama-3.2-11b-vision-preview",
      "llama-3.2-90b-vision-preview",
      "openai/gpt-oss-120b"
    ];

    let medicineName = "";
    let lastError = "";

    for (const model of visionModels) {
      try {
        console.log(`Trying model: ${model}`);

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model,
              messages: [{
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: { url: `data:${mimeType};base64,${image}` }
                  },
                  {
                    type: "text",
                    text: `This is a medicine strip image. Read the medicine name printed on it. Reply with ONLY the medicine name, nothing else.\nExample: Dolo 650`
                  }
                ]
              }],
              max_tokens: 50,
              temperature: 0.1
            })
          }
        );

        const data = await response.json();
        console.log(`${model} response:`, JSON.stringify(data));

        if (data.error) {
          lastError = data.error.message;
          continue;
        }

        const name = data?.choices?.[0]?.message?.content?.trim();
        if (name) { medicineName = name; break; }

      } catch (e) {
        lastError = e.message;
        continue;
      }
    }

    if (!medicineName) {
      return res.status(200).json({ medicineName: "", error: lastError });
    }

    return res.status(200).json({ medicineName });

  } catch (error) {
    return res.status(500).json({ error: "Scan failed", medicineName: "" });
  }
}
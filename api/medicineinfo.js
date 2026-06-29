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
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content:
                "You are a professional medical assistant. Always reply ONLY with valid JSON. No markdown, no explanations, no backticks."
            },
            {
              role: "user",
              content: `

Medicine Name: ${medicineName}

Provide accurate medicine information.

Reply ONLY in this JSON format:

{
  "uses":"2-3 lines",
  "teluguExplanation":"2-3 lines in Telugu",
  "sideEffects":"Common side effects",
  "diet":"Diet recommendations while taking this medicine",
  "dosage":"General adult dosage. Mention consult doctor if necessary.",
  "warnings":"Important precautions and warnings"
}

Return ONLY JSON.

`
            }
          ],
          max_tokens: 700,
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    if (data.error) {

      console.error(data.error);

      return res.status(200).json({

        uses: "Medicine information unavailable.",

        teluguExplanation:
          "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు.",

        sideEffects: "Not Available",

        diet: "Not Available",

        dosage: "Consult your doctor.",

        warnings: "Always follow your doctor's advice."

      });

    }

    const text =
      data?.choices?.[0]?.message?.content?.trim() || "{}";

    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {

      const parsed =
        JSON.parse(cleaned);

      return res.status(200).json(parsed);

    }

    catch {

      console.error("Invalid JSON from AI:", cleaned);

      return res.status(200).json({

        uses: "Medicine information unavailable.",

        teluguExplanation:
          "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు.",

        sideEffects: "Not Available",

        diet: "Not Available",

        dosage: "Consult your doctor.",

        warnings: "Always follow your doctor's advice."

      });

    }

  }

  catch (error) {

    console.error(error);

    return res.status(200).json({

      uses: "Medicine information unavailable.",

      teluguExplanation:
        "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు.",

      sideEffects: "Not Available",

      diet: "Not Available",

      dosage: "Consult your doctor.",

      warnings: "Always follow your doctor's advice."

    });

  }

}



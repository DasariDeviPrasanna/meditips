export default async function handler(req, res) {

  try {

    const { medicineName } = req.body;

    const response =
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Medicine Name: ${medicineName}

Provide:

1. Uses of this medicine in English (2-3 lines)
2. Telugu explanation (2-3 lines)

Reply ONLY in this JSON format:

{
  "uses":"...",
  "teluguExplanation":"..."
}
`
                  }
                ]
              }
            ]
          })
        }
      );

    const data =
      await response.json();

    const text =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text || "{}";

    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return res.status(200).json(
      JSON.parse(cleaned)
    );

  }

  catch (error) {

    console.error(error);

    return res.status(200).json({
      uses:
        "Medicine information unavailable",
      teluguExplanation:
        "ఈ మందు గురించి సమాచారం ప్రస్తుతం అందుబాటులో లేదు."
    });

  }

}
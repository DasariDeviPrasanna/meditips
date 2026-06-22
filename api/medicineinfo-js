export default async function handler(req, res) {

  try {

    const { medicineName } =
      req.body;

    const response =
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
`Medicine Name: ${medicineName}

Reply ONLY in JSON format:

{
  "uses":"Short medicine uses in English",
  "teluguExplanation":"Simple Telugu explanation"
}`
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

    return res
      .status(200)
      .json(JSON.parse(cleaned));

  }

  catch (error) {

    return res.status(500).json({
      uses:
        "Information unavailable",
      teluguExplanation:
        "సమాచారం అందుబాటులో లేదు"
    });

  }

}
export default async function handler(req, res) {

  try {

    const { medicineName } =
      req.body;

    console.log(
      "Medicine Name:",
      medicineName
    );

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

Give ONLY valid JSON.

{
  "uses":"Short medicine uses in English",
  "teluguExplanation":"Simple Telugu explanation in Telugu"
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

    console.log(
      "Gemini Response:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    const text =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!text) {

      return res.status(500).json({
        error:
          "No response from Gemini"
      });

    }

    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log(
      "Cleaned:",
      cleaned
    );

    return res
      .status(200)
      .json(
        JSON.parse(cleaned)
      );

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        error.message
    });

  }

}
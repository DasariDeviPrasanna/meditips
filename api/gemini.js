export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    console.log(
      "KEY EXISTS:",
      !!process.env.GEMINI_API_KEY
    );

    const {
      image,
      mimeType
    } = req.body;

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
                    text: `
Look at this medicine strip image.

Identify ONLY the medicine brand name printed on the strip.

Rules:
- Return ONLY the medicine name.
- No explanation.
- No extra text.
- Examples:
  Dolo 650
  Crocin Advance
  Azee 500
  Pantocid 40
  RABEKIND-DSR
`
                  },
                  {
                    inline_data: {
                      mime_type:
                        mimeType,
                      data:
                        image
                    }
                  }
                ]
              }
            ]
          })
        }
      );
    console.log("Response Status:", response.status);
    const data =
      await response.json();

    console.log(
      "GEMINI RESPONSE:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    const rawText =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text || "";

    console.log(
      "RAW TEXT:",
      rawText
    );

    const medicineName =
      rawText
        .split("\n")[0]
        .trim();

    return res.status(200).json(data);

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        error.message
    });

  }

}
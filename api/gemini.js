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

    const { image, mimeType } =
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
                        "Look at this medicine strip image. Extract the medicine brand name exactly as written on the strip. Return only the medicine name, nothing else."
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

    const data =
      await response.json();

    console.log(
      "GEMINI RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    return res.status(200).json(data);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        error.message
    });

  }
}
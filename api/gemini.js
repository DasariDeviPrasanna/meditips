export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { image, mimeType } =
      req.body;

    const response =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            "Authorization":
              `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text:
                      "Identify ONLY the medicine brand name from this medicine strip image. Return only the medicine name."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url:
                        `data:${mimeType};base64,${image}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 50
          })
        }
      );

    const data =
      await response.json();

    console.log(
      JSON.stringify(data, null, 2)
    );

    const medicineName =
      data?.choices?.[0]
        ?.message?.content
        ?.trim() || "";

    return res.status(200).json({
      medicineName
    });

  }

  catch (error) {

    return res.status(500).json({
      error:
        error.message
    });

  }

}
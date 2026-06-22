export default async function handler(req, res) {

  try {

    const { medicineName } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
Medicine: ${medicineName}

What is this medicine used for?
Give:
1. Uses in English
2. Telugu explanation
`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const text =
      data?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text || "No information found";

    return res.status(200).json({
      uses: text,
      teluguExplanation: text
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
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
    console.log(
  JSON.stringify(data, null, 2)
);

return res.status(200).json(data);

    console.log(data);


  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
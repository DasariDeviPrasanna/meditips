export default async function handler(req, res) {

  const response = await fetch(
    "https://api.x.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          {
            role: "user",
            content: "Say Hello"
          }
        ]
      })
    }
  );

  const data = await response.json();

  return res.status(200).json(data);

}
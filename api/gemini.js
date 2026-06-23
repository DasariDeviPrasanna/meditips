const data = await response.json();

console.log(
  "OPENAI RESPONSE:",
  JSON.stringify(data, null, 2)
);

const medicineName =
  data?.choices?.[0]
    ?.message?.content
    ?.trim() || "";

return res.status(200).json({
  medicineName,
  raw: data
});

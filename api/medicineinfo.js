export default async function handler(req, res) {

  return res.status(200).json({
    uses: "TEST USES",
    teluguExplanation: "TEST TELUGU"
  });

}
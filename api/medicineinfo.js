export default async function handler(req, res) {

  const { medicineName } = req.body;

  return res.status(200).json({
    medicineName
  });

}
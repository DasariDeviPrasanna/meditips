const imageInput = document.getElementById("medicineImage");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", (event) => {

  const file = event.target.files[0];
  if (!file) return;

  previewImage.src = URL.createObjectURL(file);
  previewImage.style.display = "block";

});

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

document.getElementById("scanBtn").addEventListener("click", async () => {

  const file = imageInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  try {

    const base64 = await fileToBase64(file);

    // ✅ Changed from /api/gemini → /api/scan (Groq powered)
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64,
        mimeType: file.type
      })
    });

    const data = await response.json();

    console.log("Groq Scan Response:", data);

    if (!data || !data.medicineName) {
      alert("Medicine name not detected. Please try a clearer image.");
      return;
    }

    localStorage.setItem("medicineName", data.medicineName);

    const detected = data.medicineName.toLowerCase();

    // Match known medicines to Firestore IDs
    let medicineId = "";

    if (detected.includes("dolo"))        medicineId = "dolo650";
    else if (detected.includes("crocin")) medicineId = "crocin";
    else if (detected.includes("azee"))   medicineId = "azee500";
    else if (detected.includes("pantocid")) medicineId = "pantocid40";
    else if (detected.includes("augmentin")) medicineId = "augmentin625";
    else if (detected.includes("telma"))  medicineId = "telma40";

    localStorage.setItem("medicineId", medicineId || "unknown");

    window.location.href = "result.html";

  } catch (error) {
    console.error("Scan Error:", error);
    alert("Scan Failed. Please try again.");
  }

});

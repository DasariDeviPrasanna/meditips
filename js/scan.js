const imageInput =
document.getElementById("medicineImage");

const previewImage =
document.getElementById("previewImage");

imageInput.addEventListener(
  "change",
  (event) => {

    const file =
      event.target.files[0];

    if (!file) return;

    previewImage.src =
      URL.createObjectURL(file);

    previewImage.style.display =
      "block";

  }
);

function fileToBase64(file) {

  return new Promise((resolve) => {

    const reader =
      new FileReader();

    reader.onload = () => {

      resolve(
        reader.result.split(",")[1]
      );

    };

    reader.readAsDataURL(file);

  });

}

document
.getElementById("scanBtn")
.addEventListener(
  "click",
  async () => {

    const file =
      imageInput.files[0];

    if (!file) {
      alert(
        "Please select image"
      );
      return;
    }

    const base64 =
      await fileToBase64(file);

    const response =
      await fetch(
        "/api/gemini",
        {
          method: "POST",
          headers: {
            "Content-Type":
            "application/json"
          },
          body: JSON.stringify({
            image: base64,
            mimeType:
              file.type
          })
        }
      );

    const data =
      await response.json();

    console.log(
      "Detected:",
      data.medicineName
    );

    alert(
      data.medicineName
    );

  }
);
const response = await fetch(
  "/api/gemini",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: base64,
      mimeType: file.type
    })
  }
);

console.log("STATUS:", response.status);

const data = await response.json();

console.log("FULL RESPONSE:", data);

alert(JSON.stringify(data));
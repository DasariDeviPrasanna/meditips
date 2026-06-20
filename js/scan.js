const imageInput =
document.getElementById(
  "medicineImage"
);

const previewImage =
document.getElementById(
  "previewImage"
);

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
document
.getElementById("scanBtn")
.addEventListener(
  "click",
  () => {

  const medicineId = prompt(
  "Enter medicine id:\n\ndolo650\ncrocin\nazee500\npantocid40\ntelma40\naugmentin625"
);

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
      await fileToBase64(
        file
      );

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

window.location.href =
  "result.html";

    window.location.href =
      "result.html";

  }
);
function fileToBase64(file) {

  return new Promise(
    (resolve) => {

      const reader =
        new FileReader();

      reader.onload =
        () => {

          resolve(
            reader.result
              .split(",")[1]
          );

        };

      reader.readAsDataURL(
        file
      );

    }
  );
}
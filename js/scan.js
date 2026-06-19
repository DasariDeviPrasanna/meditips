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

localStorage.setItem(
  "medicineId",
  medicineId
);

window.location.href =
  "result.html";

    window.location.href =
      "result.html";

  }
);
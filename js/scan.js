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

    localStorage.setItem(
  "medicineId",
  "dolo650"
);

    window.location.href =
      "result.html";

  }
);
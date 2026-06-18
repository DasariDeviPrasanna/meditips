const medicineName =
localStorage.getItem(
  "medicineName"
);

document.getElementById(
  "medicineName"
).innerText = medicineName;

if (medicineName === "Dolo 650") {

  document.getElementById(
    "uses"
  ).innerText =
  "Fever, Body Pain, Headache";

  document.getElementById(
    "telugu"
  ).innerText =
  "ఈ మందు జ్వరం మరియు శరీర నొప్పి తగ్గించడానికి ఉపయోగిస్తారు.";

}
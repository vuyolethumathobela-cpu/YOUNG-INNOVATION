let model;
let webcam;
const URL = "model/";

async function startCamera() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam").srcObject =
    webcam.webcam.srcObject;

  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let bestPrediction = prediction.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  document.getElementById("result").innerText =
    "Detected: " + bestPrediction.className;

  speak(bestPrediction.className);
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speechSynthesis.cancel(); // stop previous speech
  speechSynthesis.speak(speech);
}

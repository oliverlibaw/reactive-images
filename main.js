(async () => {
  const MODEL_URL =
    "https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1";

  const output = document.getElementById("output");
  const eyesDetectedImage = document.getElementById("eyes-detected");
  const eyesNotDetectedImage = document.getElementById("eyes-not-detected");

  const video = document.createElement("video");
  video.style.display = "none";
  document.body.appendChild(video);

  const model = await tf.loadGraphModel(MODEL_URL, { fromTFHub: true });

  async function detectEyes() {
    const inputTensor = tf.browser
      .fromPixels(video)
      .resizeNearestNeighbor([128, 128])
      .toFloat()
      .expandDims(0);
    const predictions = await model.executeAsync(inputTensor);

    if (predictions[0].shape[1] > 0) {
      eyesDetectedImage.hidden = false;
      eyesNotDetectedImage.hidden = true;
    } else {
      eyesDetectedImage.hidden = true;
      eyesNotDetectedImage.hidden = false;
    }

    requestAnimationFrame(detectEyes);
  }

  async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(video);
      };
    });
  }

  await setupCamera();
  detectEyes();
})();

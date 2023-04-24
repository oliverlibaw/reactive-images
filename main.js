(async () => {
  const output = document.getElementById("output");
  const eyesDetectedImage = document.getElementById("eyes-detected");
  const eyesNotDetectedImage = document.getElementById("eyes-not-detected");

  const video = document.createElement("video");
  video.style.display = "none";
  document.body.appendChild(video);

  const MODEL_URL = "https://unpkg.com/face-api.js/models";

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);

  async function detectEyes() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);

    let eyesDetected = false;

    for (const detection of detections) {
      const landmarks = detection.landmarks.getLeftEye();
      if (landmarks.length > 0) {
        eyesDetected = true;
        break;
      }
    }

    if (eyesDetected) {
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

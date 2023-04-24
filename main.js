(async () => {
  const output = document.getElementById("output");
  const eyesDetectedImage = document.getElementById("eyes-detected");
  const eyesNotDetectedImage = document.getElementById("eyes-not-detected");

  const video = document.createElement("video");
  video.style.display = "none";
  video.setAttribute("playsinline", ""); // Add this line
  document.body.appendChild(video);

  await faceapi.nets.tinyFaceDetector.loadFromUri("/reactive-images/models");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/reactive-images/models");

  async function detectEyes() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.90 })).withFaceLandmarks(true);
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
    try {
      const constraints = {
        video: {
          facingMode: "user"
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      console.error("Error setting up camera:", error);
      alert(
        "Camera access is required for this app to work. Please enable camera access and reload the page."
      );
    }

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(video);
      };
    });
  }

  video.onplay = () => {
    detectEyes();
  };

  await setupCamera();
})();

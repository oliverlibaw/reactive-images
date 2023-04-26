(async () => {
  const winkDetectedImage = document.getElementById("wink-detected");
  const winkNotDetectedImage = document.getElementById("wink-not-detected");

  const video = document.createElement("video");
  video.style.display = "none";
  video.setAttribute("playsinline", "");
  document.body.appendChild(video);

  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    { modelUrl: "/reactive-images/models/face_landmarks_3D_model.tflite" } // Add this line
  );

  async function detectWink() {
    const predictions = await model.estimateFaces({ input: video });

    let winkDetected = false;

    for (const prediction of predictions) {
      const rightEyeOpen = prediction.annotations.rightEyeUpper0.concat(prediction.annotations.rightEyeLower0).every(point => point[2] < -0.03);
      const leftEyeOpen = prediction.annotations.leftEyeUpper0.concat(prediction.annotations.leftEyeLower0).every(point => point[2] < -0.03);

      if ((rightEyeOpen && !leftEyeOpen) || (leftEyeOpen && !rightEyeOpen)) {
        winkDetected = true;
        break;
      }
    }

    if (winkDetected) {
      winkDetectedImage.hidden = false;
      winkNotDetectedImage.hidden = true;
    } else {
      winkDetectedImage.hidden = true;
      winkNotDetectedImage.hidden = false;
    }

    requestAnimationFrame(detectWink);
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

  await setupCamera();
  detectWink();
})();

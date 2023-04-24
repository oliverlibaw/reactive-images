(async () => {
  const output = document.getElementById("output");
  const eyesDetectedImage = document.getElementById("eyes-detected");
  const eyesNotDetectedImage = document.getElementById("eyes-not-detected");

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  canvas.style.display = "none";
  document.body.appendChild(canvas);

  const detectEyes = () => {
    if (JEELIZFACEFILTER.is_detected()) {
      eyesDetectedImage.hidden = false;
      eyesNotDetectedImage.hidden = true;
    } else {
      eyesDetectedImage.hidden = true;
      eyesNotDetectedImage.hidden = false;
    }

    requestAnimationFrame(detectEyes);
  };

  JEELIZFACEFILTER.init({
    canvas: canvas,
    NNCpath: "https://unpkg.com/jeelizfacefilter/dist/",
    callbackReady: (error) => {
      if (error) {
        console.log("An error occurred:", error);
      } else {
        console.log("JeelizFaceFilter is ready");
        detectEyes();
      }
    },
    callbackTrack: () => {},
  });
})();

(async function() {
  if (window.MediaPipeLoadStatus) {
    await window.MediaPipeLoadStatus;
  }
})();

const output = document.getElementById('output');
const eyesDetectedImage = document.getElementById('eyes-detected');
const eyesNotDetectedImage = document.getElementById('eyes-not-detected');

async function main() {
  const video = await setupCamera();

  const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }});

  faceMesh.setOptions({
    maxNumFaces: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);

  async function onResults(results) {
    if (results.multiFaceLandmarks) {
      eyesDetectedImage.hidden = false;
      eyesNotDetectedImage.hidden = true;
    } else {
      eyesDetectedImage.hidden = true;
      eyesNotDetectedImage.hidden = false;
    }

    await faceMesh.send({image: video});
  }

  await faceMesh.send({image: video});
}

async function setupCamera() {
  const video = document.createElement('video');
  video.width = 640;
  video.height = 480;

  const stream = await navigator.mediaDevices.getUserMedia({video: true});
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play();
      resolve(video);
    };
  });
}

main();

const video = document.getElementById('webcam');

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false // optional: set true if you want mic too
    });

    video.srcObject = stream;

  } catch (err) {
    console.error("Error accessing webcam:", err);
  }
}

startWebcam();

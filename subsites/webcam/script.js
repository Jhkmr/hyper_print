const video = document.getElementById('webcam');

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 }
      }
    });

    video.srcObject = stream;

    const track = stream.getVideoTracks()[0];
    const cap = track.getCapabilities();

    if ('zoom' in cap) {
      await track.applyConstraints({
        advanced: [{ zoom: 1 }]
      });
    }

  } catch (err) {
    console.error("Error accessing webcam:", err);
  }
}

startWebcam();

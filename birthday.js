let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let microphone;
let isBlown = false;

function initializeMicrophone() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      microphone = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      microphone.connect(analyser);
      checkBlow(analyser);
    })
    .catch((error) => {
      console.error('Error accessing microphone:', error);
    });
}

function checkBlow(analyser) {
  const dataArray = new Uint8Array(analyser.fftSize);
  analyser.getByteFrequencyData(dataArray);

  const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

  if (average > 150 && !isBlown) {
    blowCandle();
  }

  requestAnimationFrame(() => checkBlow(analyser));
}

function blowCandle() {
  document.querySelector('.flame').style.display = 'none';
  document.querySelector('.candle').style.display = 'none';
  isBlown = true;
}

// Initialize microphone on page load
initializeMicrophone();
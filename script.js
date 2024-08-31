document
  .getElementById("upload-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("audio-file");
    const file = fileInput.files[0];

    if (file && file.type === "audio/mpeg") {
      await convertMp3ToWav(file);
    } else {
      displayMessage("Please select a valid MP3 file.");
    }
  });

function displayMessage(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
}

async function convertMp3ToWav(file) {
  displayMessage("Converting...");

  // Initialize FFmpeg
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  // Load the MP3 file
  const fileData = await fetchFile(file);

  // Write the MP3 file to FFmpeg FS
  ffmpeg.FS("writeFile", "input.mp3", new Uint8Array(fileData));

  // Run the conversion command
  await ffmpeg.run("-i", "input.mp3", "output.wav");

  // Read the output WAV file from FFmpeg FS
  const data = ffmpeg.FS("readFile", "output.wav");

  // Create a blob and a download link for the WAV file
  const blob = new Blob([data.buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "converted.wav";
  link.click();

  displayMessage("File converted successfully.");
}

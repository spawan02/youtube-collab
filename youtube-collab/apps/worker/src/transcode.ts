import { spawn } from 'child_process';
import path from 'path';
import fs from "fs";

const inputVideoPath = path.join(__dirname, '../test1.mp4');

const outputDir = path.join(__dirname, `../12123`);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

//@ts-ignore
const transcodeVideoInParallel = (inputVideoPath, resolution, outputDir) => {
  const outputVideoPath = path.join(outputDir, `${resolution}.mp4`);

  const ffmpegProcess = spawn('ffmpeg', [
    '-i', inputVideoPath,          
    '-vf', `scale=${resolution}`,   
    '-vcodec', 'libx264',           
    '-b:v', '1000k',                
    '-preset', 'ultrafast',         
    outputVideoPath                 
  ]);

  
  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`Transcoding to ${resolution} completed: ${outputVideoPath}`);
    } else {
      console.error(`Error during transcoding process with code: ${code}`);
    }
  });

  ffmpegProcess.on('error', (err) => {
    console.error(`Error spawning ffmpeg process: ${err.message}`);
  });
};

const resolutions = ['640x360', '854x480', '1280x720']; // Different resolutions
resolutions.forEach((resolution) => {
  transcodeVideoInParallel(inputVideoPath, resolution, outputDir);
});

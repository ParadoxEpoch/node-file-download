import axios from 'axios';
import fs from 'fs';
import tmp from 'tmp';
import progress from 'progress-stream';
import ProgressBar from 'cli-progress';

export default async function downloadBinary(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'stream',
            maxRedirects: 5,
        });

        const fileExtension = path.extname(new URL(url).pathname);
        const tmpFile = tmp.tmpNameSync({ postfix: fileExtension });

        const writer = fs.createWriteStream(tmpFile);

        var str;
        if (response.headers['content-length'] !== undefined) {
            // If the content-length header is present, use a progress bar

            const progressBar = new ProgressBar.SingleBar({}, ProgressBar.Presets.shades_classic);
            progressBar.start(parseInt(response.headers['content-length']), 0);

            str = progress({
                length: response.headers['content-length'],
                time: 100,
            });

            str.on('progress', function (progress) {
                progressBar.update(progress.transferred);
            });

            response.data.pipe(str).pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    progressBar.stop();
                    resolve(tmpFile);
                });
                writer.on('error', reject);
            });
        } else {
            // If the content-length header is not present, use a spinner

            console.log(msg.bold("Downloading, please wait..."));
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(tmpFile));
                writer.on('error', reject);
            });
        }
        return tmpFile;
    } catch (err) {
        console.log(msg.error('Error downloading file'));
        console.error(err);
    }
};
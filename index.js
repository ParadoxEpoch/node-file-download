import axios from 'axios';
import fs from 'fs';
import tmp from 'tmp';
import progress from 'progress-stream';
import ProgressBar from 'cli-progress';
import path from 'path';
import ora from 'ora';

const defaultOptions = {
    startMsg: 'Starting download...',
    downloadMsg: 'Downloading, please wait...',
    successMsg: 'Download completed',
    errorMsg: 'Download failed',
    appendMissingExtension: true,
    httpMethod: 'get',
    showProgressBar: true
}

export default async function downloadFile(url, filePath = null, options = {}) {
    // Merge the default options with the user options
    options = { ...defaultOptions, ...options };

    const preSpinner = ora(`\x1b[34m${options.startMsg}\x1b[0m`);
    if (options.startMsg) preSpinner.start();
    
    try {
        // Send a GET request to the url
        const response = await axios({
            url: url,
            method: options.httpMethod,
            responseType: 'stream',
            maxRedirects: 5,
        });

        // Get the file extension from the url
        const fileExtension = path.extname(new URL(url).pathname);

        // If filePath is specified and appendMissingExtension is true, append the file extension to the filePath if it is missing
        if (filePath && options.appendMissingExtension && !path.extname(filePath)) filePath += fileExtension;

        // If filePath is falsy, create a temporary file
        if (!filePath) filePath = tmp.tmpNameSync({ postfix: fileExtension });

        const writer = fs.createWriteStream(filePath);

        var str;
        if (response.headers['content-length'] !== undefined && options.showProgressBar) {
            // If the content-length header is present, use a progress bar

            preSpinner.stop();
            console.log(`\x1b[34m${options.downloadMsg}\x1b[0m`);
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
                    if (options.successMsg) console.log(`\x1b[32m✓ ${options.successMsg}\x1b[0m`);
                    resolve(filePath);
                });
                writer.on('error', (err) => {
                    progressBar.stop();
                    reject(err);
                });
            });
        } else {
            // If the content-length header is not present, use a spinner

            preSpinner.stop();
            const spinner = ora(`\x1b[34m${options.downloadMsg}\x1b[0m`).start();
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    options.successMsg
                        ? spinner.succeed(`\x1b[32m${options.successMsg}\x1b[0m`)
                        : spinner.stop();
                    resolve(filePath);
                });
                writer.on('error', (err) => {
                    spinner.stop();
                    reject(err);
                });
            });
        }
        return filePath;
    } catch (err) {
        preSpinner.stop();
        if (options.errorMsg) console.log(`\x1b[31m✗ ${options.errorMsg}\x1b[0m`);
        throw err;
        //throw new Error(err);
    }
};
# node-file-download

Simple file downloader module for Node.js

## Installation

```bash
npm install @paradoxepoch/node-file-download
```

## Usage

```javascript
import fileDownload from '@paradoxepoch/node-file-download';
await fileDownload(url, filePath, options);
```

| Parameter | Type               | Required | Description                                                     |
| --------- | ------------------ | -------- | --------------------------------------------------------------- |
| url       | `string`           | yes      | The url of the file to download |
| filePath  | `string` or `null` | no       | The local path to download the file to. Defaults to null. If falsy, downloads to a random filename in the system's temp directory |
| options   | `string`           | no       | The [options](#options) object. Used to specify custom options to use for the download |

## Examples

### Simple download to local temp directory

The easiest way to use this module. Simply specify the [url](#usage) parameter and the file will be downloaded with a random name to your local temp directory on the system.

```javascript
// Download to temp directory with random file name
const outputPath = await fileDownload('https://example.com/dummy.pdf');

// Log the path that the file was saved to
// eg: /tmp/tmp-21596-AnUG7d8LM75X-.pdf
// eg: C:\Users\User\AppData\Local\Temp
console.log(outputPath);
```

### Simple download to specified path

Another easy way to use the module. Just specify the [url](#usage) and [filePath](#usage) parameters to download the file to a local path on the system.

```javascript
// Download to specified path
const outputPath = await fileDownload('https://example.com/dummy.pdf', '/path/to/file.pdf');

// Log the path that the file was saved to
// /path/to/file.pdf
console.log(outputPath);
```

If the file extension is omitted from the [filePath](#usage), the extension will automatically be appended to the output file based on the download URL if present. This behaviour can be disabled by setting the [appendMissingExtension](#options) option to false.

```javascript
// Download to specified path (note the missing file extension in the filePath param)
const outputPath = await fileDownload('https://example.com/dummy.pdf', '/path/to/file');

// Log the path that the file was saved to
// /path/to/file.pdf
console.log(outputPath);
```

### Download to local temp directory with custom options

Passing [filePath](#usage) as `null` *(or any falsy value)* will allow you to specify the [options](#options) object while still downloading the file to the local temp directory with a random filename.

```javascript
// Download to a specified directory with custom options
const filePath = await fileDownload('https://example.com/dummy.pdf', null, {
  successMsg: 'All good!',
  errorMsg: 'Something went wrong',
  httpMethod: 'post',
  showProgressBar: false
});
```

## Options

| Property               | Type                    | Default                        | Description                                                     |
| ---------------------- | ----------------------- | ------------------------------ | --------------------------------------------------------------- |
| startMsg               | `string`                | "Starting download..."         | The message shown in the console when the download is starting. If falsy, no message is shown.  |
| downloadMsg            | `string`                | "Downloading, please wait..."  | The message shown in the console when the file is downloading. If falsy, no message is shown.   |
| successMsg             | `string`                | "Download completed"           | The message shown in the console when the download completes. If falsy, no message is shown.    |
| errorMsg               | `string`                | "Download failed"              | The message shown in the console if the download fails. If falsy, no message is shown.          |
| appendMissingExtension | `boolean`               | true                           | If true, appends file extension based on the URL if the save path does not include one. This option is ignored when filePath is falsy. |
| httpMethod             | `string`                | "get"                          | The HTTP method to use for the download. Defaults to "get".      |
| showProgressBar        | `boolean`               | true                           | If true, displays a progress bar when the server includes a "Content-Length" header. |

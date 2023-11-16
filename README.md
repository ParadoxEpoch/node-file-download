# node-file-download

Simple file downloader module for Node.js

## Installation

```bash
npm install @paradoxepoch/node-file-download
```

## Usage

```javascript
import fileDownload from '@paradoxepoch/node-file-download';

// Download to temp directory with random file name
const filePathTemp = await fileDownload('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
```

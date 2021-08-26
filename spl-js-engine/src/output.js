import {writeFile} from './file-utils';
import JSZip from 'jszip';
import path from 'path';

class Output {
  constructor() {}

  // eslint-disable-next-line no-unused-vars
  add(fPath, fContent, bin) {}
  get() {}
}

export class ZipOutput extends Output {
  constructor() {
    super();
    this.zip = JSZip();
  }

  add(fPath, fContent) {
    this.zip.file(fPath, fContent);
  }

  get() {
    return this.zip;
  }
}

export class LocalOutput extends Output {
  constructor(outputPath) {
    super();
    this.outputPath = outputPath;
  }

  add(fPath, fContent, bin = false) {
    writeFile(this.outputPath + path.sep + fPath, fContent, bin);
  }

  get() {
    return this.outputPath;
  }
}

import {isText} from 'istextorbinary';
import {readFile, walkDir, isNode} from './file-utils';
import {getExtension} from './file-utils';
import path from 'path';

class Input {
  constructor() {
    this.handledExtensions = [];
  }

  addHandledExtension(extension) {
    this.handledExtensions.push(extension);
  }

  fileIsText(fPath) {
    return this.handledExtensions.indexOf(getExtension(fPath)) != -1 || isText(fPath);
  }

  // eslint-disable-next-line no-unused-vars
  exists(path) {}
  // eslint-disable-next-line no-unused-vars
  get(path) {}
  // eslint-disable-next-line no-unused-vars
  setIgnorePattern(ignoreArray){}
  // eslint-disable-next-line no-unused-vars
  forEachCodeFile(cb) {}
}

export class ZipInput extends Input {
  constructor(zipFile, codePath) {
    super();
    this.zip = zipFile;
    this.codePath = codePath;
    this.ignore = [];
    this.zipType = isNode ? 'nodebuffer' : 'blob';
  }

  exists(path) {
    return this.zip.files[path] != null;
  }

  get(path) {
    return this.zip.files[path].async('string');
  }

  setIgnorePattern(ignoreArray) {
    this.ignore = ignoreArray;
  }

  forEachCodeFile(cb) {
    const filePaths = Object.keys(this.zip.files)
      .filter(fPath => fPath.startsWith(this.codePath))
      .filter(fPath => !this.zip.files[fPath].dir)
      .filter(fPath => !fPath.split(path.sep).filter(f => this.ignore.includes(f)).length);
    const promises = [];

    filePaths.forEach(fPath => {
      const isText = this.fileIsText(fPath);
      promises.push(this.zip.files[fPath].async(isText ? 'string' : this.zipType).then(fContent => {
        return cb(fPath.replace(this.codePath + path.sep, ''), fContent, isText);
      }));
    });

    return Promise.all(promises);
  }
}

export class LocalInput extends Input {
  constructor(codePath) {
    super();
    this.codePath = codePath;
    this.ignore = [];
  }

  setIgnorePattern(ignoreArray) {
    this.ignore = ignoreArray;
  }

  forEachCodeFile(cb) {
    walkDir(this.codePath, (fPath, isFolder) => {
      if (isFolder) return;
      const isText = this.fileIsText(fPath);

      return cb(fPath.replace(this.codePath + path.sep, ''), readFile(fPath, !isText), isText);
    }, this.ignore);
    return Promise.all([]);
  }
}

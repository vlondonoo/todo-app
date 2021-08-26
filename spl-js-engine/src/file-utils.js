import fs from 'fs';
import path from 'path';
import stripBom from 'strip-bom';

export const getExtension = f => f.substring(f.lastIndexOf('.') + 1);
export const getFileName = f => path.basename(f);
export const getFolder = f => path.dirname(f);
export const isNode = typeof window === 'undefined';

export function existsFile(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (e) {
    return false;
  }
}

export function readFile(filePath, bin = false) {
  if (bin) {
    return fs.readFileSync(filePath, null);
  } else {
    return stripBom(fs.readFileSync(filePath, 'utf8'));
  }
}

export function writeFile(filePath, data, bin = false) {
  if (!bin && (!data || !data.trim())) return;
  mkDirRecursively(path.dirname(filePath));
  fs.writeFileSync(filePath, data, bin ? null : 'utf8');
}

function mkDirRecursively(folderPath) {
  const parentPath = path.dirname(folderPath);

  if (!existsFile(parentPath)) {
    mkDirRecursively(parentPath);
  }

  const stat = existsFile(folderPath);

  if (!stat) {
    fs.mkdirSync(folderPath);
  } else if (stat.isFile()) {
    throw `Found file on ${folderPath} while creating a folder`;
  }
}

export function walkDir(pathToWalk, cb, ignore = []) {
  let stat = existsFile(pathToWalk);

  if (!stat || stat.isFile()) return;

  fs.readdirSync(pathToWalk).filter(function (path) {
    return ignore.indexOf(path) == -1;
  }).forEach((filePath) => {
    const fullFilePath = `${pathToWalk}${path.sep}${filePath}`;
    stat = fs.statSync(fullFilePath);

    if (stat.isFile()) {
      cb(fullFilePath, false);
    } else if (stat.isDirectory()) {
      walkDir(fullFilePath, cb, ignore);
    }
  });

  cb(pathToWalk, true);
}

export function readJsonFromFile(path) {
  const stat = existsFile(path);

  if (!stat || !stat.isFile()) {
    throw `${path} is not a file`;
  }

  const fileContent = readFile(path);

  try {
    return JSON.parse(fileContent);
  } catch (e) {
    // nothing to do
  }

  return undefined;
}

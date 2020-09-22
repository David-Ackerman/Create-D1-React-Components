import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import tsxD1ReactComponent from './templates/typescript/d1ReactComponent';
import tsxd1createIndex from './templates/typescript/d1createIndex';

export default async (
  componentName: string,
  { dir, styled, mobile }: { dir?: string; styled?: boolean; mobile?: boolean }
) => {
  // const config = vscode.workspace.getConfiguration('createD1ReactComponents');

  // const fileExtension = config.get('fileExtension') as string;
  // const cssFileFormat = config.get('stylesFormat') as string;

  // const componentsExtensions = 'tsx';

  const componentFileName = 'index.tsx';

  // const componentFileName = componentsFileNames;
  // const componentFileName = componentsFileNames;

  let reactD1Component = tsxD1ReactComponent;
  let createD1Index = tsxd1createIndex;

  const projectRoot = (vscode.workspace.workspaceFolders as any)[0].uri.fsPath;

  componentName = componentName.split(' ').join('');

  if (!dir) {
    dir =
      (await vscode.window.showInputBox({
        value: '/',
        prompt: `Path from root`,
        ignoreFocusOut: true,
        valueSelection: [-1, -1],
      })) || '';
  }
  if (!dir.includes(projectRoot)) {
    dir = projectRoot + dir;
  }
  if (dir[dir.length - 1] !== '/') {
    dir = dir + '/';
  }
  const dirWithFileName = dir + componentName;
  const filePath = (fileName: string) => dirWithFileName + '/' + fileName;

  createDir(dirWithFileName);

  await createFile(
    filePath(`${componentName}.tsx`),
    reactD1Component(componentName)
  );
  await createFile(filePath(componentFileName), createD1Index(componentName));
  // if (mobile) {
  //   if (styled) {
  //     await createFile(filePath(componentFileName), styledReactNativeArrowComponent(componentName));
  //     await createFile(filePath(styledFileName), styledFileReactNative());
  //   } else {
  //     await createFile(filePath(componentFileName), reactNativeArrowComponent(componentName));
  //   }
  // } else {
  //   if (styled) {
  //     await createFile(filePath(componentFileName), styledReactArrowComponent(componentName, importStyledFileName));
  //     await createFile(filePath(styledFileName), styledTemplate());
  //   } else {
  //     await createFile(filePath(componentFileName), reactArrowComponent(componentName));
  //   }
  // }

  setTimeout(() => {
    vscode.workspace
      .openTextDocument(filePath(componentFileName))
      .then((editor) => {
        if (!editor) {
          return;
        }
        vscode.window.showTextDocument(editor);
      });
  }, 50);
};

const createDir = (targetDir: string) => {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = __dirname;

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
};

const createFile = async (filePath: string, content: string | string[]) => {
  if (!fs.existsSync(filePath)) {
    await fs.createWriteStream(filePath).close();
    await fs.writeFile(filePath, content.toString(), (err) => {
      if (err) {
        vscode.window.showErrorMessage('Maker cant write to file.');
      }
    });
  } else {
    vscode.window.showWarningMessage('File already exists.');
  }
};

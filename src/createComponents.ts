import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import tsxD1ReactComponent from './templates/typescript/d1ReactComponent';
import tsxd1createIndex from './templates/typescript/d1createIndex';

type Props = {
  dir: string;
};
const componentFileName = 'index.tsx';

export default async (componentName: string, { dir }: Props) => {
  // Armazena as funçoes que criam o cogido dos arquivos
  let reactD1Component = tsxD1ReactComponent;
  let createD1Index = tsxd1createIndex;

  // Armazena o diretorio raiz do projeto
  const projectRoot = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';

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

  // Cria a pasta do compoonente com o nome digitado pelo desenvolvedor
  createDir(dirWithFileName);

  // Cria o arquivo index do componente.
  await createFile(filePath(componentFileName), createD1Index(componentName));

  // Cria o arquivo com o codigo do componente
  await createFile(
    filePath(`${componentName}.tsx`),
    reactD1Component(componentName)
  );

  // Abre o arquivo do componente criado em uma aba do vscode
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

// Função que cria o diretorio do componente
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
        return curDir;
      }

      if (err.code === 'ENOENT') {
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err;
      }
    }

    return curDir;
  }, initDir);
};

//função que cria os arquivos do componente
const createFile = async (filePath: string, content: string | string[]) => {
  if (!fs.existsSync(filePath)) {
    fs.createWriteStream(filePath).close();
    fs.writeFile(filePath, content.toString(), (err) => {
      if (err) {
        vscode.window.showErrorMessage(
          'Não foi possivel exrever o conteudo do arquivo.'
        );
      }
    });
  } else {
    vscode.window.showWarningMessage('Arquivo já existe');
  }
};

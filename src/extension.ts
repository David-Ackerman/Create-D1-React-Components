import * as vscode from 'vscode';
import createComponent from './createComponents';

const handleCreateComponent = async (args: any) => {
  const componentName = await vscode.window.showInputBox({
    prompt: `Enter the component name:`,
    ignoreFocusOut: true,
    valueSelection: [-1, -1],
  });

  if (!componentName) {
    return;
  }

  if (args) {
    const path = args.fsPath;
    createComponent(componentName, { dir: path });
  }
};

// Função executada quando a extensão é ativada no vscode.
export function activate(context: vscode.ExtensionContext) {
  // Mensagem exibida quando a extensão
  console.log(
    'Congratulations, your extension "create-d1-react-components" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    'extension.create-d1-react-component',
    (args) => {
      // codiggo executado na execução do comando
      handleCreateComponent(args);
    }
  );
  //registra a extensão no contexto do vscode
  context.subscriptions.push(disposable);
}

// Função executada quando a extensão é desabilitada
export function deactivate() {}

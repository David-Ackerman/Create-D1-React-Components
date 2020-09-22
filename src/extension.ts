// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import createComponent from './createComponents';

const handleCreateComponent = async (
  args: any,
  styled?: boolean,
  mobile?: boolean
) => {
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
    createComponent(componentName, { dir: path, styled, mobile });
  } else {
    createComponent(componentName, { styled, mobile });
  }
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "create-d1-react-components" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.create-d1-react-component',
    (args) => {
      // The code you place here will be executed every time your command is executed
      handleCreateComponent(args);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

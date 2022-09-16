// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	
	
	
	context.subscriptions.push(vscode.commands.registerCommand('angular-unused-css-finder.scan-for-unused', () => {
		const activeCssFileText = vscode.window.activeTextEditor?.document.getText();
		const activeCssFileUri = vscode.window.activeTextEditor?.document.uri;
		const linkedHtmlFileUri = activeCssFileUri?.fsPath.replace('.component.css', '.component.html');
		let linkedHtmlFileText = '';
		let arr;
		try {
			if (linkedHtmlFileUri) {
				linkedHtmlFileText = fs.readFileSync(linkedHtmlFileUri, { encoding: 'utf-8' })
				arr = linkedHtmlFileText.match(/(?:class=")[^"]*"/g)?.map(x => x.replace('class="', "").replace("\"", "").split(" ")).flat();
			} else {
				console.log(`linkedHtmlFileText - Can't be empty`);
			}
		} catch {

		}
		
		if (arr?.some((x: string) => activeCssFileText?.includes(x))) {
			//
		}
		
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}

import * as vscode from "vscode";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "angular-unused-css-finder.scan-for-unused",
      () => {
        if (!vscode.window.activeTextEditor) {
          console.log("No active text editor");
          return;
        }
        const activeEditor = vscode.window.activeTextEditor;

        const activeCssFileText = activeEditor?.document.getText();
        const activeCssFileUri = activeEditor?.document.uri;
        const linkedHtmlFileUri = activeCssFileUri?.fsPath.replace(
          ".component.css",
          ".component.html"
        );
        const linkedTSFileUri = activeCssFileUri?.fsPath.replace(
          ".component.css",
          ".component.ts"
        );
        let linkedHtmlFileText = "";
        let linkedTSFileText = "";
        let classesInLinkedHtmlFile;
        let isViewEncapsulationNone = false;
        try {
          if (linkedHtmlFileUri) {
            linkedHtmlFileText = fs.readFileSync(linkedHtmlFileUri, {
              encoding: "utf-8",
            });
            classesInLinkedHtmlFile = linkedHtmlFileText
              .match(/(?:class=")[^"]*"/g)
              ?.map((x) => x.replace('class="', "").replace('"', "").split(" "))
              .flat();
          } else {
            console.log(`linkedHtmlFileText - Can't be empty`);
          }
        } catch {}

        try {
          if (linkedTSFileUri) {
            linkedTSFileText = fs.readFileSync(linkedTSFileUri, {
              encoding: "utf-8",
            });
            isViewEncapsulationNone = linkedTSFileText.includes(
              "ViewEncapsulation.None"
            );
          } else {
            console.log(`linkedTSFileText - Can't be empty`);
          }
        } catch {}

        if (
          isViewEncapsulationNone &&
          classesInLinkedHtmlFile?.some((x: string) =>
            activeCssFileText?.includes(x)
          )
        ) {
          //
        }
      }
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

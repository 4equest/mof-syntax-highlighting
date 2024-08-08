import * as vscode from 'vscode';
import * as keywords from './data/keywords.json';

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerCompletionItemProvider(
        { language: 'mof' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                const completionItems = keywords.map(keyword => {
                    const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                    return item;
                });
                return completionItems;
            }
        }
    );

    context.subscriptions.push(provider);
}

export function deactivate() { }

vscode.languages.registerDefinitionProvider({ language: 'mof' }, {
    provideDefinition(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /\$?[A-Za-z_][A-Za-z0-9_]*/);
        const word = document.getText(wordRange);
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text;
            const match = regex.exec(lineText);
            if (match && lineText.includes("as") && i !== position.line) {
                return new vscode.Location(document.uri, new vscode.Position(i, match.index));
            }
        }
        return null;
    }
});

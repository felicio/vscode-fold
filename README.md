# Fold
Automatic folding of indented lines for Visual Studio Code

## About

Once a text document is opened, this extension will automatically fold all indented lines
to the default `fold.level` set in User Settings.

## Usage

Team @code does host a decent documentation suite and [this](https://code.visualstudio.com/docs/editor/codebasics#_folding)
Folding chapter is a good example of it. Below is an extract of available
fold actions and their respective keybindings to really help you get the most out of this extension.

- Unfold (`⌥⌘]`) unfolds the collapsed region at the cursor
- Fold (`⌥⌘[`) folds the innermost uncollapsed region at the cursor
- Unfold All (`⌘K ⌘J`) unfolds all regions in the editor
- Fold All (`⌘K ⌘0`) folds all region in the editor

## Known issues

> Note: With one exception, listed issues are challenging due to the fact them being rooted in the functionality VS Code extenisbility API exposes, or the lack thereof.

- Folding does not apply on documents opened in Split Editor.
- If document begins with a folding region (e.g. `package.json`) applicable fold level **cannot** be lower than `2`.
- `jsconfig.json` experiences inconsistent folding behaviour. In majority of times the regions within won't be folded.

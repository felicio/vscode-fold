# VS Code Fold
Auto-folding of indented lines for Visual Studio Code

## About

Once a text document is opened, this extension will automatically fold all
indented lines to the default `fold.level` set in User Settings. Already
opened documents can be folded to the default level with **Fold Level
Default** command from **Command Palette**.

## Features

- Auto-folding
- Fold Level Default command


## Usage

Team @code does host a decent documentation suite and
[this](https://code.visualstudio.com/docs/editor/codebasics#_folding) Folding
chapter is a good example of it. Below is an extract of available fold
actions and their respective keybindings to really help you get the most out
of this extension.

- Fold (`⌥⌘[`) folds the innermost uncollapsed region at the cursor
- Unfold (`⌥⌘]`) unfolds the collapsed region at the cursor
- Fold All (`⌘K ⌘0`) folds all region in the editor
- Unfold All (`⌘K ⌘J`) unfolds all regions in the editor
- Fold All Block Comments (`⌘K ⌘/`) folds all regions that start with a block comment token
- Fold Marker Regions (`⌘K ⌘8`) folds all marker regions
- Unfold Marker Regions (`⌘K ⌘9`) unfolds all marker regions

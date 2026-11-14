const { Plugin, TFile } = require("obsidian");

module.exports = class FolderCanvasClickPlugin extends Plugin {
    onload() {
        this.registerDomEvent(
            document,
            "click",
            (event) => {
                if (!(event.target instanceof Element)) return;

                const title = event.target.closest(".nav-folder-title");
                if (!title) return;

                // Don't intercept the arrow; Obsidian uses it to expand/collapse the tree. (Just use "Auto-reveal current file option instead)
                if (event.target.closest(".nav-folder-collapse-indicator")) return;

                const folderPath =
                title.dataset.path ??
                title.closest(".nav-folder")?.dataset.path;

                if (!folderPath) return;

                // Find a canvas directly inside this folder.
                const canvas = this.app.vault
                .getFiles()
                .find(
                    (file) =>
                    file.extension === "canvas" &&
                    file.parent?.path === folderPath
                );

                // If the folder has no canvas, leave its normal behavior alone.
                if (!(canvas instanceof TFile)) return;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                this.app.workspace.getLeaf(false).openFile(canvas);
            },
            true
        );
    }
};

import {progressBar, win} from "@/ui.ts";

const updateProgress = (progress: number) => {
    progressBar.value = progress;
    win.layout.layout(true)
}


const getOrCreateFolder = (name, parent) => {
    for (let i = 1; i <= parent.numItems; i++) {
        if (parent.item(i) instanceof FolderItem && parent.item(i).name === name) {
            return parent.item(i);
        }
    }
    return parent.items.addFolder(name);
};

export {
    updateProgress,
    getOrCreateFolder
}

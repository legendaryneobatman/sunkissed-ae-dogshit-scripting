import {getOrCreateFolder, updateProgress} from "@/helpers.ts";
const AUDIO_FORMATS = ["mp3", "wav", "aac", "aif", "m4a"];
const IMAGE_FORMATS = ["mp3", "wav", "aac", "aif", "m4a"];
const VECTOR_FORMATS = ["ai", "eps", "pdf"];
const VIDEO_FORMATS = ["mp4", "mov", "avi", "gif"];
const OBJECT_FORMATS = ["obj", "c4d"];

const getFootageItemFileName = (item: FootageItem) => {
    if (item.file === null) {
        return ''
    } else {
        return item.file.name.split(".").pop()?.toLowerCase() || ''
    }
}

const checkIfAudio = (item: FootageItem) => {
    const fileName = getFootageItemFileName(item)
    return AUDIO_FORMATS.indexOf(fileName) !== -1;
}
const checkIfImage = (item: FootageItem) => {
    return IMAGE_FORMATS.indexOf(getFootageItemFileName(item)) !== -1;
}
const checkIfVectors = (item: FootageItem) => {
    return VECTOR_FORMATS.indexOf(getFootageItemFileName(item)) !== -1;
}
const checkIfVideo = (item: FootageItem) => {
    return VIDEO_FORMATS.indexOf(getFootageItemFileName(item)) !== -1;
}
const checkIfObjects = (item: FootageItem) => {
        return OBJECT_FORMATS.indexOf(getFootageItemFileName(item)) !== -1;
}

export const organizeProject = () => {
    if (!app.project) {
        alert("No project found!");
        return;
    }
    app.beginUndoGroup("Organize Project");

    let folderDefinitions = [
        {
            name: "Audios",
            parent: "Assets",
            condition: checkIfAudio
        },
        {
            name: "Images",
            parent: "Assets",
            condition: checkIfImage
        },
        {
            name: "Vectors",
            parent: "Assets",
            condition: checkIfVectors
        },
        {
            name: "Videos",
            parent: "Assets",
            condition: checkIfVideo
        },
        {
            name: "3D Files",
            parent: "Assets",
            condition: checkIfObjects
        },
        {
            name: "Comps",
            parent: null,
            condition: (item: _ItemClasses) => item instanceof CompItem
        },
        {
            name: "Solids",
            parent: null,
            condition: function (item: _ItemClasses) {
                return item.typeName === "Solid" || item.typeName === "Null";
            }
        }
    ];

    let createdFolders = [];

    for (let d = 0; d < folderDefinitions.length; d++) {
        let def = folderDefinitions[d];
        updateProgress((d / folderDefinitions.length) * 100);
        let parentFolder = def.parent ? getOrCreateFolder(def.parent, app.project) : app.project;
        let folder = getOrCreateFolder(def.name, parentFolder);
        createdFolders.push(folder);

        for (let i = 1; i <= app.project.items.length; i++) {
            if (def.condition(app.project.items[i])) {
                app.project.items[i].parentFolder = folder;
            }
        }
    }

    for (let f = 0; f < createdFolders.length; f++) {
        if (createdFolders[f].numItems === 0) {
            createdFolders[f].remove();
        }
    }

    app.endUndoGroup();
    alert("Project organized into folders.");
    updateProgress(0); // Сброс прогресс-бара
};

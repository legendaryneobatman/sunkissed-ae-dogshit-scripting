import {updateProgress} from "@/helpers.ts";

export const deleteOffLayers = function () {
    if (!app.project) {
        alert("No project found!");
        return;
    }
    app.beginUndoGroup("Delete Off Layers");
    let layersRemoved = 0;
    let totalLayers = 0;

    for (let i = 1; i <= app.project.items.length; i++) {
        if (app.project.items[i] instanceof CompItem) {
            totalLayers += app.project.items[i].layers.length;
        }
    }

    let currentLayer = 0;
    for (let i = 1; i <= app.project.items.length; i++) {
        let item = app.project.items[i];
        if (item instanceof CompItem) {
            for (let j = item.layers.length; j >= 1; j--) {
                updateProgress((currentLayer / totalLayers) * 100);
                currentLayer++;
                let layer = item.layers[j];
                if (!layer.enabled && !layer.audioEnabled) {
                    layer.remove();
                    layersRemoved++;
                }
            }
        }
    }

    app.endUndoGroup();
    alert(layersRemoved + " off layers removed.");
    updateProgress(0); // Сброс прогресс-бара
};

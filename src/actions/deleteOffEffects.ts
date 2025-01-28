import {updateProgress} from "@/helpers.ts";

export const deleteOffEffects = function () {
    if (!app.project) {
        alert("No project found!");
        return;
    }
    app.beginUndoGroup("Delete Effects");
    let effectsRemoved = 0;
    let totalEffects = 0;

    for (let i = 1; i <= app.project.items.length; i++) {
        if (app.project.items[i] instanceof CompItem) {
            for (let j = 1; j <= app.project.items[i].layers.length; j++) {
                let effects = app.project.items[i].layers[j].property("ADBE Effect Parade");
                if (effects) {
                    totalEffects += effects.numProperties;
                }
            }
        }
    }

    let currentEffect = 0;
    for (let i = 1; i <= app.project.items.length; i++) {
        let item = app.project.items[i];
        if (item instanceof CompItem) {
            for (let j = 1; j <= item.layers.length; j++) {
                let layer = item.layers[j];
                let effects = layer.property("ADBE Effect Parade");
                if (effects) {
                    for (let k = effects.numProperties; k >= 1; k--) {
                        updateProgress((currentEffect / totalEffects) * 100);
                        currentEffect++;
                        let effect = effects.property(k);
                        if (!effect.enabled) {
                            effect.remove();
                            effectsRemoved++;
                        }
                    }
                }
            }
        }
    }

    app.endUndoGroup();
    alert(effectsRemoved + " effects removed.");
    updateProgress(0); // Сброс прогресс-бара
};

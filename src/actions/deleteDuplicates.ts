// Функции для кнопок
import {updateProgress} from "@/helpers.ts";

export const deleteDuplicates = function () {
    if (!app.project) {
        alert("No project found!");
        return;
    }
    app.beginUndoGroup("Delete Duplicates");
    let duplicatesRemoved = 0;
    let sizeRemoved = 0;
    let items = app.project.items;
    let seen: Record<string, boolean> = {};

    for (let i = items.length; i >= 1; i--) {
        updateProgress(((items.length - i) / items.length) * 100);
        let item = items[i];
        if (item instanceof FootageItem && item.file) {
            let path = item.file.fsName;
            if (seen[path]) {
                duplicatesRemoved++;
                sizeRemoved += item.file.length / (1024 * 1024); // MB
                item.remove();
            } else {
                seen[path] = true;
            }
        }
    }

    app.endUndoGroup();
    alert(duplicatesRemoved + " duplicates removed.\nTotal size freed: " + sizeRemoved.toFixed(2) + " MB.");
    updateProgress(0); // Сброс прогресс-бара
};

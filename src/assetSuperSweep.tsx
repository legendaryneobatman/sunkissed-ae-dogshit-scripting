(function (me) {
    var win = new Window("palette", "Project Tools")

    // Настройка окна
    win.orientation = "column"
    win.spacing = 10;
    win.margins = 10;

    var progressBar = win.add("progressbar", undefined, 0, 100);
    progressBar.preferredSize.width = 300;
    progressBar.preferredSize.height = 20;

    // Группа для кнопок
    var buttonGroup = win.add("group", undefined, {name: 'buttonGroup'});
    buttonGroup.orientation = "column";
    buttonGroup.alignment = "center";
    buttonGroup.spacing = 5;
    buttonGroup.margins = 5;

    // Кнопки
    var deleteButton = buttonGroup.add("button", undefined, "DELETE DUPLICATES");
    deleteButton.preferredSize.width = 200;
    deleteButton.preferredSize.height = 30;

    var heartButton = buttonGroup.add("button", undefined, "DELETE OFF LAYERS");
    heartButton.preferredSize.width = 200;
    heartButton.preferredSize.height = 30;

    var deleteEffectsButton = buttonGroup.add("button", undefined, "DELETE EFFECTS");
    deleteEffectsButton.preferredSize.width = 200;
    deleteEffectsButton.preferredSize.height = 30;

    var deleteAllButton = buttonGroup.add("button", undefined, "DELETE ALL SHIT");
    deleteAllButton.preferredSize.width = 200;
    deleteAllButton.preferredSize.height = 30;

    var organizeButton = buttonGroup.add("button", undefined, "Organize Project");
    organizeButton.preferredSize.width = 200;
    organizeButton.preferredSize.height = 30;

    // Функция для обновления прогресс-бара
    function updateProgress(progress: number) {
        progressBar.value = progress;
        win.layout.layout(true)
    }

    // Функции для кнопок

    const deleteDuplicates = function () {
        if (!app.project) {
            alert("No project found!");
            return;
        }
        app.beginUndoGroup("Delete Duplicates");
        var duplicatesRemoved = 0;
        var sizeRemoved = 0;
        var items = app.project.items;
        var seen = {};

        for (var i = items.length; i >= 1; i--) {
            updateProgress(((items.length - i) / items.length) * 100);
            var item = items[i];
            if (item instanceof FootageItem && item.file) {
                var path = item.file.fsName;
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
    const deleteOffLayers = function () {
        if (!app.project) {
            alert("No project found!");
            return;
        }
        app.beginUndoGroup("Delete Off Layers");
        var layersRemoved = 0;
        var totalLayers = 0;

        for (var i = 1; i <= app.project.items.length; i++) {
            if (app.project.items[i] instanceof CompItem) {
                totalLayers += app.project.items[i].layers.length;
            }
        }

        var currentLayer = 0;
        for (var i = 1; i <= app.project.items.length; i++) {
            var item = app.project.items[i];
            if (item instanceof CompItem) {
                for (var j = item.layers.length; j >= 1; j--) {
                    updateProgress((currentLayer / totalLayers) * 100);
                    currentLayer++;
                    var layer = item.layers[j];
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
    const deleteOffEffects = function () {
        if (!app.project) {
            alert("No project found!");
            return;
        }
        app.beginUndoGroup("Delete Effects");
        var effectsRemoved = 0;
        var totalEffects = 0;

        for (var i = 1; i <= app.project.items.length; i++) {
            if (app.project.items[i] instanceof CompItem) {
                for (var j = 1; j <= app.project.items[i].layers.length; j++) {
                    var effects = app.project.items[i].layers[j].property("ADBE Effect Parade");
                    if (effects) {
                        totalEffects += effects.numProperties;
                    }
                }
            }
        }

        var currentEffect = 0;
        for (var i = 1; i <= app.project.items.length; i++) {
            var item = app.project.items[i];
            if (item instanceof CompItem) {
                for (var j = 1; j <= item.layers.length; j++) {
                    var layer = item.layers[j];
                    var effects = layer.property("ADBE Effect Parade");
                    if (effects) {
                        for (var k = effects.numProperties; k >= 1; k--) {
                            updateProgress((currentEffect / totalEffects) * 100);
                            currentEffect++;
                            var effect = effects.property(k);
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
    const deleteAll = function () {
        app.beginUndoGroup("Delete All Shit");
        deleteButton.onClick();
        heartButton.onClick();
        deleteEffectsButton.onClick();
        app.endUndoGroup();
        alert("All actions completed successfully.");
    };
    const organizeProject = function () {
        if (!app.project) {
            alert("No project found!");
            return;
        }
        app.beginUndoGroup("Organize Project");

        function getOrCreateFolder(name, parent) {
            for (var i = 1; i <= parent.numItems; i++) {
                if (parent.item(i) instanceof FolderItem && parent.item(i).name === name) {
                    return parent.item(i);
                }
            }
            return parent.items.addFolder(name);
        }

        var folderDefinitions = [
            {
                name: "Audios",
                parent: "Assets",
                condition: function (item) {
                    return item instanceof FootageItem && ["mp3", "wav", "aac", "aif", "m4a"].indexOf(item.file ? item.file.name.split(".").pop().toLowerCase() : "") !== -1;
                }
            },
            {
                name: "Images",
                parent: "Assets",
                condition: function (item) {
                    return item instanceof FootageItem && ["png", "jpg", "psd", "tga", "webp"].indexOf(item.file ? item.file.name.split(".").pop().toLowerCase() : "") !== -1;
                }
            },
            {
                name: "Vectors",
                parent: "Assets",
                condition: function (item) {
                    return item instanceof FootageItem && ["ai", "eps", "pdf"].indexOf(item.file ? item.file.name.split(".").pop().toLowerCase() : "") !== -1;
                }
            },
            {
                name: "Videos",
                parent: "Assets",
                condition: function (item) {
                    return item instanceof FootageItem && ["mp4", "mov", "avi", "gif"].indexOf(item.file ? item.file.name.split(".").pop().toLowerCase() : "") !== -1;
                }
            },
            {
                name: "3D Files",
                parent: "Assets",
                condition: function (item) {
                    return item instanceof FootageItem && ["obj", "c4d"].indexOf(item.file ? item.file.name.split(".").pop().toLowerCase() : "") !== -1;
                }
            },
            {
                name: "Comps",
                parent: null,
                condition: function (item) {
                    return item instanceof CompItem;
                }
            },
            {
                name: "Solids",
                parent: null,
                condition: function (item) {
                    return item.typeName === "Solid" || item.typeName === "Null";
                }
            }
        ];

        var createdFolders = [];

        for (var d = 0; d < folderDefinitions.length; d++) {
            var def = folderDefinitions[d];
            updateProgress((d / folderDefinitions.length) * 100);
            var parentFolder = def.parent ? getOrCreateFolder(def.parent, app.project) : app.project;
            var folder = getOrCreateFolder(def.name, parentFolder);
            createdFolders.push(folder);

            for (var i = 1; i <= app.project.items.length; i++) {
                if (def.condition(app.project.items[i])) {
                    app.project.items[i].parentFolder = folder;
                }
            }
        }

        for (var f = 0; f < createdFolders.length; f++) {
            if (createdFolders[f].numItems === 0) {
                createdFolders[f].remove();
            }
        }

        app.endUndoGroup();
        alert("Project organized into folders.");
        updateProgress(0); // Сброс прогресс-бара
    };

    deleteButton.onClick = deleteDuplicates;
    heartButton.onClick = deleteOffLayers;
    deleteEffectsButton.onClick = deleteOffEffects;
    deleteAllButton.onClick = deleteAll;
    organizeButton.onClick = organizeProject;

    // Показываем панель, если это не панель
    if (isPanel) {
        win.layout.layout(true);
    } else {
        win.center();
        win.show();
    }
})(this);

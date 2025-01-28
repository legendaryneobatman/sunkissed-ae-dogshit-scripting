const win = new Window("palette", "Project Tools");

// Настройка окна
win.orientation = "column"
win.spacing = 10;
win.margins = 10;

const progressBar = win.add("progressbar", undefined, 0, 100);
progressBar.preferredSize.width = 300;
progressBar.preferredSize.height = 20;

// Группа для кнопок
const buttonGroup = win.add("group", undefined, {name: 'buttonGroup'});
buttonGroup.orientation = "column";
buttonGroup.alignment = "center";
buttonGroup.spacing = 5;
buttonGroup.margins = 5;

// Кнопки
const deleteButton = buttonGroup.add("button", undefined, "DELETE DUPLICATES");
deleteButton.preferredSize.width = 200;
deleteButton.preferredSize.height = 30;

const heartButton = buttonGroup.add("button", undefined, "DELETE OFF LAYERS");
heartButton.preferredSize.width = 200;
heartButton.preferredSize.height = 30;

const deleteEffectsButton = buttonGroup.add("button", undefined, "DELETE EFFECTS");
deleteEffectsButton.preferredSize.width = 200;
deleteEffectsButton.preferredSize.height = 30;

const deleteAllButton = buttonGroup.add("button", undefined, "DELETE ALL SHIT");
deleteAllButton.preferredSize.width = 200;
deleteAllButton.preferredSize.height = 30;

const organizeButton = buttonGroup.add("button", undefined, "Organize Project");
organizeButton.preferredSize.width = 200;
organizeButton.preferredSize.height = 30;

export {
    win,
    progressBar,
    buttonGroup,
    deleteButton,
    heartButton,
    deleteEffectsButton,
    deleteAllButton,
    organizeButton,
}

export const showAlert = () => {alert('zakyuo')}

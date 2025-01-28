import {deleteAllButton, deleteButton, deleteEffectsButton, heartButton, organizeButton, win,} from '@/ui.ts'
import {deleteDuplicates} from "@/actions/deleteDuplicates.ts";
import {deleteOffLayers} from "@/actions/deleteOffLayers.ts";
import {deleteOffEffects} from "@/actions/deleteOffEffects.ts";
import {deleteAll} from "@/actions/deleteAll.ts";
import {organizeProject} from "@/actions/organizeProject.ts";

export const assetSuperSweep = () => {
    deleteButton.onClick = deleteDuplicates;
    heartButton.onClick = deleteOffLayers;
    deleteEffectsButton.onClick = deleteOffEffects;
    deleteAllButton.onClick = deleteAll;
    organizeButton.onClick = organizeProject;

    win.layout.layout(true);
    win.center();
    win.show();
}

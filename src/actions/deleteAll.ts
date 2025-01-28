import {deleteDuplicates} from "@/actions/deleteDuplicates.ts";
import {deleteOffLayers} from "@/actions/deleteOffLayers.ts";
import {deleteOffEffects} from "@/actions/deleteOffEffects.ts";

export
const deleteAll = function () {
    app.beginUndoGroup("Delete All Shit");

    deleteDuplicates();
    deleteOffLayers();
    deleteOffEffects();

    app.endUndoGroup();
    alert("All actions completed successfully.");
};

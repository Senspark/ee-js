'use strict';

const Electron = require("electron");

let findItem = (array, pred) => {
    for (let item of array) {
        if (pred(item)) {
            return item;
        }
    }
    return undefined;
};

let findPrefabMenu = () => {
    let menu = Electron.Menu.getApplicationMenu();
    let eeMenu = findItem(menu.items, item => item.id === 'ee');
    let prefabMenu = findItem(eeMenu.submenu.items, item => item.position === 'prefab');
    return prefabMenu;
};

// https://github.com/electron/electron/blob/master/docs/api/menu-item.md
module.exports = {
    load() {
        this.listener = new Editor.IpcListener();
        this.listener.on('ee:profile_manager_loaded', event => {
            Editor.Ipc.sendToAll('ee:profile_manager:get_data', 'use_nested_prefab', 'ee:update_prefab_menu');
        });
        this.listener.on('ee:update_prefab_menu', (event, data) => {
            let menu = findPrefabMenu();
            menu.checked = data;
        });
    },

    unload() {
        //
    },

    messages: {
        use_nested_prefab: event => {
            let menu = findPrefabMenu();
            Editor.Ipc.sendToAll('ee:profile_manager:set_data', 'use_nested_prefab', menu.checked);
        },
    },
};
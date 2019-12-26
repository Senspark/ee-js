'use strict';

const fs = require('fs');
const Electron = require("electron");
const PngQuant = require('pngquant');

// https://docs.cocos.com/creator/manual/en/publish/custom-project-build-template.html
function onBeforeBuildFinish(options, callback) {
    // Options:
    // actualPlatform: string (web-desktop)
    // android: {
    //   packageName: string (com.company.app)
    // }
    // android-instant: {
    //   REMOTE_SERVER_ROOT: ?
    //   host: ?
    //   packageName: ?
    //   pathPattern: ?
    //   recordPath: ?
    //   scheme: string (https)
    //   skipRecord: boolean
    // }
    // appABI: [
    //   arm64-v8a
    //   armeabi-v7a
    // ]
    // appBunble: boolean
    // buildPath: string (project_dir/build)
    // debug: boolean
    // dest: string (project_dir/build/web-desktop)
    // embedWebDebugger: boolean
    // encryptJs: boolean
    // excludeScenes: [
    //   string (uuid)
    // ]
    // fb-instant-games: {}
    // includeSDKBox: boolean
    // inlineSpriteFrames: boolean
    // inlineSpriteFrames_native: boolean
    // ios: {
    //   packageName: string
    // }
    // mac: {
    //   packageName: string
    // }
    // md5Cache: boolean
    // mergeStartScene: boolean
    // optimizeHotUpdate: boolean
    // orientation: {
    //   landscapeLeft: boolean
    //   landscapeRight: boolean
    //   portrait: boolean
    //   upsidedown: boolean
    // }
    // packageName: string
    // platform: string (web-desktop)
    // previewHeight: number
    // previewWidth: number
    // scenes: [
    //   string (uuid)
    // ]
    // sourceMaps: boolean
    // startScene: string (uuid)
    // template: string (default/link)
    // title: string
    // useDebugKeystore: boolean
    // vsVersion: string (auto)
    // webOrientation: string (landspace)
    // win32: {}
    // xxteaKey: string
    // zipCompressJs: boolean
    // project: string
    // projectName: string
    // debugBuildWorker: boolean
    // buildResults {
    //   _buildAssets: {
    //     [uuid]: {
    //       isRoot?: boolean
    //       nativePath?: string
    //       nativePaths?: [
    //         string
    //       ]
    //       dependUuids?: [
    //         string
    //       ]
    //     }
    //   }
    //   _packedAssets: {
    //     [uuid]: [
    //       string
    //     ]
    //   }
    //   _subpackages: {}
    //   _nativeMd5Map: null
    //   _md5Map: null
    // }
    Editor.log(`Building ${options.platform} to ${options.dest}`);

    const optimizePng = async path => {
        const altPath = `${path}.alt`;
        Editor.log(`Optimize ${path}.`)
        try {
            // Don't use the same PngQuant instance for all optimizations (error ERR_STREAM_WRITE_AFTER_END).
            const quanter = new PngQuant([
                256,
                '--force',
                '--quality', '0-100',
                '--speed', '1',
                '-',
            ]);
            await new Promise((resolve, reject) => {
                fs.createReadStream(path)
                    .pipe(quanter)
                    .pipe(fs.createWriteStream(altPath))
                    .on('error', err => reject(err))
                    .on('finish', () => fs.rename(altPath, path, err => err ? reject(err) : resolve()));
            });
        } catch (ex) {
            Editor.log(`${err}`);
        }
    };

    const buildResults = options.buildResults;
    const uuids = buildResults.getAssetUuids();
    const textureType = cc.js._getClassId(cc.Texture2D);
    // Editor.log(`textureType = ${textureType}`);
    const promises = [];
    for (let i = 0, n = uuids.length; i < n; ++i) {
        const uuid = uuids[i];
        if (buildResults.getAssetType(uuid) !== textureType) {
            continue;
        }
        const asset = buildResults._buildAssets[uuid];
        if (!asset) {
            continue;
        }
        const nativePaths = asset.nativePaths;
        if (!nativePaths) {
            continue;
        }
        for (let j = 0, m = nativePaths.length; j < m; ++j) {
            const path = nativePaths[j];
            const extension = path.split('.').pop();
            if (extension !== 'png') {
                continue;
            }
            promises.push(new Promise(resolve =>
                fs.stat(path, async (err, stats) => {
                    if (err) {
                        // File not exist.
                    } else {
                        await optimizePng(path);
                    }
                    resolve();
                })));
            break;
        }
    }

    Editor.log(`size = ${promises.length}`);
    Promise.all(promises).then(() => {
        callback();
    });
}

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
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },

    unload() {
        this.listener.clear();
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    },

    messages: {
        use_nested_prefab: event => {
            let menu = findPrefabMenu();
            Editor.Ipc.sendToAll('ee:profile_manager:set_data', 'use_nested_prefab', menu.checked);
        },
    },
};
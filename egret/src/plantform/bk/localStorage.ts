namespace egret.localStorage.BKlocalStorage {
    let localStoragePath = "GameSandBox://resource/localStorage";

    function getItem(key: string) {
        if (!BK.FileUtil.isFileExist(localStoragePath))
            return undefined;
        let str = BK.FileUtil.readFile(localStoragePath).readAsString(true);
        if (!str) {
            return undefined;
        }
        let data = JSON.parse(str);
        if (data) {
            return data[key];
        }
        return undefined;
        // return "";
    }

    function setItem(key: string, value: string) {
        let str = BK.FileUtil.readFile(localStoragePath).readAsString(true);
        let data: any = {};
        if (str) {
            let parseData = JSON.parse(str);
            if (parseData) {
                data = parseData;
            }
        }
        data[key] = value;
        let data_str = JSON.stringify(data);
        BK.FileUtil.writeFile(localStoragePath, data_str as any);
        return true;
    }

    function removeItem(key: string): void {
        let str = BK.FileUtil.readFile(localStoragePath).readAsString(true);
        if (!str)
            return;
        let data = JSON.parse(str);
        if (!data || !data[key])
            return;
        delete data[key];
        let data_str = JSON.stringify(data);
        BK.FileUtil.writeFile(localStoragePath, data_str as any);
    }

    function clear(): void {
        if (!BK.FileUtil.isFileExist(localStoragePath))
            return;
        let data = {};
        let data_str = JSON.stringify(data);
        BK.FileUtil.writeFile(localStoragePath, data_str as any);
    }

    egret.localStorage.setItem = setItem;
    egret.localStorage.getItem = getItem;
    egret.localStorage.removeItem = removeItem;
    egret.localStorage.clear = clear;

}
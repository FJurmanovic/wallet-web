declare module "*.scss";
declare var __CONFIG__: SettingType;

type SettingType = {
    apiUrl: string;
    apiVersion: string;
    ssl: string;
    appName: string;
};

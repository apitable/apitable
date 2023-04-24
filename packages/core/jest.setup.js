const _global = global || window;

const language = typeof _global == 'object' && _global.__initialization_data__ && _global.__initialization_data__.locale;
const defaultLang = (typeof _global == 'object' && _global.__initialization_data__?.envVars?.SYSTEM_CONFIGURATION_DEFAULT_LANGUAGE) || 'zh-CN';
_global.currentLang = language || defaultLang;
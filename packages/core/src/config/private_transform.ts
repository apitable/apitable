import { isPrivateDeployment } from './env';

export function privateTransform(
  configJson: Object,
  datasheetName: string,
  modifyKey: string
) {
  if (isPrivateDeployment()) {
    const copyOfConfJson = JSON.parse(JSON.stringify(configJson));

    const datasheet = copyOfConfJson[datasheetName];

    for (const key in datasheet) {
      const config = datasheet[key];
      if (typeof config[modifyKey] === 'string') {
        const regs = [/https:\/\/s1.vika.cn/, /https:\/\/vika.cn/];
        const replacedStr = [process.env.REACT_APP_PRIVATE_OSS_PATH || '/vk-assets-ltd', ''];
        regs.forEach((reg, regIndex) => {
          if (reg.test(config[modifyKey])) {
            config[modifyKey] = config[modifyKey].replace(
              reg,
              (substr: string, index: number) => {
                if (index === 0) {
                  return replacedStr[regIndex];
                }
                return substr;
              }
            );
          }
        });
      }
    }

    return copyOfConfJson;
  }
  return configJson;
}

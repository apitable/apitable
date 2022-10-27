const {
  Vika,
} = require('@vikadata/vika');
const https = require('https');
const fs = require('fs');
const path = require('path');
const envfile = require('envfile');
const TEMPLATE = require('./template');

const SPACE_ID = 'spczdmQDfBAn5';
const CONFIG_PACKAGE_ID = 'fodt3Nv5QPPNX';
const BUILD_PATH = './';

const sleep = (delay = 1000) => new Promise(res => setTimeout(res, delay));

const vika = new Vika({
  token: 'uskM7PcEPftF4wh0Ni1', // 建议通过环境变量传入
  host: 'https://integration.vika.ltd/fusion/v1',
});

// 获取cmd参数中私有化环境名称
const getEnvName = () => {
  const argv = process.argv?.slice(2);
  if (!Array.isArray(argv) || argv.length < 1) {
    throw new Error('Expected 1 arguments, but got 0');
  }

  if (argv.length > 1) {
    throw new Error(`Expected 1 arguments, but got ${argv.length}`);
  }

  return argv[0];
};

// 获取对应部署环境所有配置表
const getConfigDatasheet = async(envName) => {
  // 获取指定空间站的指定文件夹详情
  const privateEnvFoldersRes = await vika.nodes.get({ spaceId: SPACE_ID, nodeId: CONFIG_PACKAGE_ID });
  if (privateEnvFoldersRes.success) {
    // 找到对应部署环境所有配置表
    const folder = privateEnvFoldersRes.data.children?.find(fol => fol.name === envName);

    if (!folder) throw new Error(`Cannot find the folder named ${envName}`);

    console.log(`Found private env folder ${folder.id}`);

    await sleep(); // 不sleep会报429
    const privateEnvDstRes = await vika.nodes.get({ spaceId: SPACE_ID, nodeId: folder.id });
    if (privateEnvDstRes.success) {
      if (privateEnvDstRes.data.children) return privateEnvDstRes.data.children;
      throw new Error('No configuration datasheets');
    }
    throw new Error(privateEnvDstRes.message);
  }
  throw new Error(privateEnvFoldersRes.message);
};

// 获取表数据
const getDatasheetData = async(datasheetId, setting) => {
  let records = [];

  try {
    for await (const eachPageRecords of vika.datasheet(datasheetId).records.queryAll({ ...setting })) {
      records = [...records, ...eachPageRecords];
    }
    return records;
  } catch (err) {
    console.error('Fail to fetch records');
    return [];
  }
};

// 下载附件build
const download = (url, fileName) => {
  const _path = path.resolve(`${BUILD_PATH}/public`);

  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path);
  }

  https.get(url, (res) => {
    const writeStream = fs.createWriteStream(path.resolve(`${_path}/${fileName}`));

    res.pipe(writeStream);

    writeStream.on('finish', () => {
      writeStream.close();
      console.log(`Successfully download ${fileName}`);
    });
  });
};

// 替换build目录下图标等
const fetchPublic = async(datasheetOfPublic) => {
  if (!datasheetOfPublic) {
    console.log('Public datasheet not found, skip');
    return;
  }

  console.log(`Execute fetching ${datasheetOfPublic.name}`);

  const recordsOfPublic = await getDatasheetData(datasheetOfPublic.id);

  if (!recordsOfPublic?.length) {
    console.error(`No data under ${datasheetOfPublic.name}`);
    return;
  }

  recordsOfPublic.forEach((record) => {
    const { name, file } = record.fields;

    if (!name || !file) {
      console.error(`${record.recordId} has no name or file`);
      return;
    }

    const attachmentFile = file?.[0];

    if (!attachmentFile) {
      console.error(`${record.recordId} file has wrong data`);
      return;
    }

    download(attachmentFile.url, name);
  });
};

// 增加lang目录下文件私有化i18n内容
const fetchStrings = async(datasheetOfStrings, template) => {
  let _template = template;

  if (!datasheetOfStrings) {
    console.log('Strings datasheet not found, skip');

    return _template.replace('{{zh_CN}}', '{}').replace('{{en_US}}', '{}');
  }

  console.log(`Execute ${datasheetOfStrings.name} datasheet to generate custom language pack`);

  const recordsOfStrings = await getDatasheetData(datasheetOfStrings.id);

  if (!recordsOfStrings.length) throw new Error('Strings datasheet has no data');

  const langPacks = {};

  recordsOfStrings.forEach((record) => {
    const translation = record.fields;
    const { id, ...langs } = translation;

    Object.keys(langs).forEach(lang => {
      langPacks[lang] = {
        ...langPacks[lang],
        [id]: langs[lang],
      };
    });
  }, {});

  Object.keys(langPacks).forEach(lang => {
    const dict = langPacks[lang];
    const jsonDict = JSON.stringify(dict, null, 2);

    _template = _template.replace(`{{${lang}}}`, jsonDict);
  });

  console.log('Successfully generated language pack');

  return _template;
};

const fetchSettings = async(datasheetOfStrings) => {
  if (!datasheetOfStrings) {
    console.log('Settings datasheet not found, skip');

    return {};
  }

  console.log(`Execute ${datasheetOfStrings.name} datasheet to generate custom settings`);

  const recordsOfSettings = await getDatasheetData(datasheetOfStrings.id);

  if (!recordsOfSettings.length) throw new Error('Settings datasheet has no data');

  const settingsObject = recordsOfSettings.reduce((acc, cur) => {
    if (cur?.fields) {
      return {
        ...acc,
        [cur.fields.id]: cur.fields.value,
      };
    }
  }, {});

  return settingsObject;
};

const generateENV = async(configDatasheets,_path) => {
  const settings = await fetchSettings(configDatasheets.find(configDatasheet => configDatasheet.name === 'settings'));
  let parsedFile = {};

  for (const k in settings) {
    parsedFile[`${k.toUpperCase()}`] = settings[k] ?? '';
  }
  fs.writeFileSync(path.resolve(`${_path}/.env`), envfile.stringify(parsedFile));
};

const main = async() => {
  try {
    const envName = getEnvName();

    if (/vika/gi.test(envName)) return;

    const configDatasheets = await getConfigDatasheet(envName);

    await fetchPublic(configDatasheets.find(configDatasheet => configDatasheet.name === 'public'));

    let template = TEMPLATE;
    const _path = path.resolve(`${BUILD_PATH}/custom`);
    template = await fetchStrings(configDatasheets.find(configDatasheet => configDatasheet.name === 'strings'), template);

    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path);
    }

    await generateENV(configDatasheets,_path);
    fs.writeFileSync(path.resolve(`${_path}/custom_config.js`), template);
  } catch (err) {
    console.error(err);
  }
};

main();

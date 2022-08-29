module.exports =`
  function main() {
    // i18n
    window.vika_i18n = {
      'zh-CN': {
        ...window.vika_i18n?.['zh-CN'],
        ...{{zh_CN}}
      },
      'en-US': {
        ...window.vika_i18n?.['en-US'],
        ...{{en_US}}
      },
    };

    // settings
    window.vika_settings = {{custom_settings}};
  }

  main();
`;

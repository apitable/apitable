import { FC, useState } from 'react';
import { Select, Typography } from '@apitable/components';
import { Message } from 'pc/components/common';
import { useRequest } from 'pc/hooks';
import styles from './style.module.less';
import { getLanguage, Strings, t, TrackEvents } from '@apitable/core';
import { useUserRequest } from 'pc/hooks';
import { tracker } from 'pc/utils/tracker';

const options = [{
  label: '简体中文',
  value: 'zh-CN'
}, {
  label: 'English (beta)',
  value: 'en-US' 
}];

export const LanguageSetting: FC = props => {
  const lang = getLanguage();

  const [value, setValue] = useState<string>(lang);
  const { updateLangReq } = useUserRequest();
  const { run: updateLang } = useRequest(updateLangReq, { manual: true });

  const handleSelected = async(option) => {
    const newValue: string = option.value;
    if (newValue === value) {
      return;
    }
    
    const { success, message } = await updateLang(newValue);

    if (!success) {
      Message.error({ content: message });
      return;
    }
    setValue(newValue);
    tracker.track(TrackEvents.Language, {
      languageType: newValue
    });
    window.location.reload();
  };

  return (
    <div className={styles.languageSetting}>
      <Typography variant="h7" className={styles.title}>{t(Strings.language_setting)}</Typography>
      <Select
        options={options}
        value={value}
        onSelected={handleSelected}
        dropdownMatchSelectWidth
        triggerStyle={{ width: 200 }}
      />
    </div >
  );
};

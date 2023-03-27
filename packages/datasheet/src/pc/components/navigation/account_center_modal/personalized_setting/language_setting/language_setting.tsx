/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Select, Typography } from '@apitable/components';
import { getLanguage, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { useRequest, useUserRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import styles from './style.module.less';

const options = [{
  label: '简体中文',
  value: 'zh-CN'
}, {
  label: 'English',
  value: 'en-US'
}];

export const LanguageSetting: FC<React.PropsWithChildren<unknown>> = () => {
  const lang = getLanguage();

  const [value, setValue] = useState<string>(lang);
  const { updateLangReq } = useUserRequest();
  const { run: updateLang } = useRequest(updateLangReq, { manual: true });

  const handleSelected = async(option: any) => {
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
    // cache client locale
    window.document.cookie = `client-lang=${newValue}`;
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

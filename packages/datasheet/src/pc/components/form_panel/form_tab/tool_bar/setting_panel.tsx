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

import { Checkbox, Tooltip } from 'antd';
import { useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { IToolBarBase } from './interface';
// @ts-ignore
import { SubscribeGrade, SubscribeLabel } from 'enterprise/subscribe_system/subscribe_label/subscribe_label';
import styles from './style.module.less';

enum IFormOptionType {
  CoverVisible = 'CoverVisible',
  LogoVisible = 'LogoVisible',
  IndexVisible = 'IndexVisible',
  BrandVisible = 'BrandVisible',
  FullScreen = 'FullScreen',
  CompactMode = 'CompactMode',
}

export const SettingPanel: React.FC<React.PropsWithChildren<IToolBarBase>> = (props) => {
  const colors = useThemeColors();
  const { IS_ENTERPRISE } = getEnvVariables();
  const { formProps, updateProps: _updateProps } = props;
  const { coverVisible, logoVisible, brandVisible, indexVisible, fullScreen, compactMode } = formProps;
  const [checkedList, setCheckedList] = useState<Set<IFormOptionType>>(() => {
    const set = new Set<IFormOptionType>();
    if (coverVisible) set.add(IFormOptionType.CoverVisible);
    if (logoVisible) set.add(IFormOptionType.LogoVisible);
    if (brandVisible) set.add(IFormOptionType.BrandVisible);
    if (indexVisible !== false) set.add(IFormOptionType.IndexVisible);
    if (fullScreen) set.add(IFormOptionType.FullScreen);
    if (compactMode) set.add(IFormOptionType.CompactMode);
    return set;
  });
  const product = useAppSelector((state) => state.billing?.subscription?.product);
  const controlFormBrandLogo = useAppSelector((state) => state.billing?.subscription?.controlFormBrandLogo);
  const { embedId } = useAppSelector((state) => state.pageParams);
  const updateProps = (id: IFormOptionType, selected: boolean) => {
    switch (id) {
      case IFormOptionType.CoverVisible:
        _updateProps({ coverVisible: selected });
        break;
      case IFormOptionType.LogoVisible:
        _updateProps({ logoVisible: selected });
        break;
      case IFormOptionType.BrandVisible:
        _updateProps({ brandVisible: selected });
        break;
      case IFormOptionType.IndexVisible:
        _updateProps({ indexVisible: selected });
        break;
      case IFormOptionType.FullScreen:
        _updateProps({ fullScreen: selected });
        break;
      case IFormOptionType.CompactMode:
        _updateProps({ compactMode: selected });
        break;
    }
  };

  const optionList = React.useMemo(() => {
    return [
      {
        id: IFormOptionType.CoverVisible,
        name: t(Strings.form_cover_visible),
        disabled: false,
        show: true,
      },
      {
        id: IFormOptionType.LogoVisible,
        name: t(Strings.form_logo_visible),
        disabled: false,
        show: true,
      },
      {
        id: IFormOptionType.IndexVisible,
        name: t(Strings.form_index_visible),
        disabled: false,
        show: true,
      },
      {
        id: IFormOptionType.FullScreen,
        name: t(Strings.form_full_screen),
        disabled: false,
        show: true,
      },
      {
        id: IFormOptionType.CompactMode,
        name: t(Strings.form_compact_option_mode),
        disabled: false,
        tooltipText: t(Strings.form_compact_option_desc),
        show: true,
      },
      {
        id: IFormOptionType.BrandVisible,
        name: (
          <>
            {t(Strings.form_brand_visible)}
            {IS_ENTERPRISE && <SubscribeLabel grade={SubscribeGrade.Gold} />}
          </>
        ),
        disabled: !controlFormBrandLogo,
        show: !embedId,
      },
    ];
  }, [product, embedId]);

  const onChange = (id: IFormOptionType) => {
    const temp = new Set([...checkedList]);
    const propSelected = temp.has(id);
    if (propSelected) {
      temp.delete(id);
    } else {
      temp.add(id);
    }
    setCheckedList(temp);
    updateProps(id, !propSelected);
  };

  return (
    <div className={styles.settingPanel}>
      <span className={styles.title}>{t(Strings.form_setting)}</span>
      <Checkbox.Group className={styles.optionList} value={[...checkedList]}>
        {optionList
          .filter((item) => item.show)
          .map((item) => (
            <div className={styles.optionItem} key={item.id}>
              <Checkbox value={item.id} key={item.id} onChange={() => onChange(item.id)} disabled={item.disabled}>
                {item.name}
              </Checkbox>
              {item.tooltipText ? (
                <Tooltip placement="top" trigger="hover" title={item.tooltipText}>
                  <div className={styles.iconWrap}>
                    <QuestionCircleOutlined size={16} color={colors.black[500]} />
                  </div>
                </Tooltip>
              ) : null}
            </div>
          ))}
      </Checkbox.Group>
    </div>
  );
};

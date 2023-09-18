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

import { Button, IconButton } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { AddOutlined, ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@apitable/icons';
import { useCssColors } from '../../../trigger/use_css_colors';
import { IArrayFieldTemplateProps } from '../../core/interface';
import styles from './style.module.less';

type IArrayFieldItems = Pick<IArrayFieldTemplateProps, 'items'>;
type IArrayFieldItem = IArrayFieldItems['items'][number];

const ArrayFieldItem = (props: IArrayFieldItem) => {
  const isUpDisable = props.disabled || props.readonly || !props.hasMoveUp;
  const isDownDisable = props.disabled || props.readonly || !props.hasMoveDown;
  return (
    <div className={styles.inlineArrayItem}>
      {props.children}
      {props.hasToolbar && (
        <>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton disabled={isUpDisable} size="small" onClick={props.onReorderClick(props.index, props.index - 1)} icon={ArrowUpOutlined} />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton disabled={isDownDisable} onClick={props.onReorderClick(props.index, props.index + 1)} icon={ArrowDownOutlined} />
          )}
          {props.hasRemove && (
            <IconButton disabled={props.disabled || props.readonly} onClick={props.onDropIndexClick(props.index)} icon={DeleteOutlined} />
          )}
        </>
      )}
    </div>
  );
};

export const ArrayFieldTemplate = (props: IArrayFieldTemplateProps) => {
  const marginTop = props.items.length > 0 ? 8 : 0;
  const colors = useCssColors();
  return (
    <div>
      {props.items.map((element) => (
        <ArrayFieldItem {...element} key={element.key} />
      ))}
      {props.canAdd && (
        <div style={{ marginTop }}>
          <Button
            onClick={props.onAddClick} size="small" prefixIcon={<AddOutlined color={colors.textCommonTertiary} size={16}/>} >
            {t(Strings.robot_action_send_web_request_add_header_button)}
          </Button>
        </div>
      )}
    </div>
  );
};

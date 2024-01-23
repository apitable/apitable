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

import * as React from 'react';
import { IFunction, IField, t, Strings } from '@apitable/core';
import { ExpressionColorant } from './token_colorant';
import styles from './styles.module.less';

interface IFormulaGuiding {
  type: 'field' | 'func';
  item: IField | IFunction;
}

export const FormulaGuiding: React.FC<React.PropsWithChildren<IFormulaGuiding>> = (props) => {
  const { type, item } = props;

  const title = item.name;
  const summary =
    type === 'func'
      ? (item as IFunction).summary
      : t(Strings.summary_return_field_value_of_row, {
        name: (item as IField).name,
      });

  const syntax = type === 'func' ? (item as IFunction).definition : `{${(item as IField).name}}`;
  const examples = type === 'func' ? (item as IFunction).example : `{${(item as IField).name}}`;
  const linkUrl = (item as IFunction).linkUrl;
  return (
    <>
      <h2 className={styles.descTitle}>{title}</h2>
      <div className={styles.summary}>
        {summary}
        {linkUrl && (
          <a className={styles.linkUrl} href={linkUrl} target="_blank" rel="noreferrer">
            {t(Strings.function_view_url)}
          </a>
        )}
      </div>
      <div className={styles.subTitle}>{t(Strings.formula_how_to_use)}</div>
      <code>{syntax}</code>
      <div className={styles.subTitle}>{t(Strings.formula_example_sub_title)}</div>
      <code>
        <ExpressionColorant expression={examples} />
      </code>
    </>
  );
};

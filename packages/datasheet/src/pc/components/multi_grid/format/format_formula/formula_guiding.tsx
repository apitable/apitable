import * as React from 'react';
import { IFunction, IField, t, Strings } from '@apitable/core';
import styles from './styles.module.less';
import { ExpressionColorant } from './token_colorant';

interface IFormulaGuiding {
  type: 'field' | 'func';
  item: IField | IFunction;
}

export const FormulaGuiding: React.FC<IFormulaGuiding> = props => {
  const { type, item } = props;

  const title = item.name;
  const summary = type === 'func' ? (item as IFunction).summary : t(Strings.summary_return_field_value_of_row, {
    name: (item as IField).name,
  });

  const syntax = type === 'func' ? (item as IFunction).definition : `{${(item as IField).name}}`;
  const examples = type === 'func' ? (item as IFunction).example : `{${(item as IField).name}}`;
  const linkUrl = (item as IFunction).linkUrl;
  return (
    <>
      <h2 className={styles.descTitle}>
        {title}
      </h2>
      <div className={styles.summary}>
        {summary}
        {linkUrl && <a className={styles.linkUrl} href={linkUrl} target="_blank" rel="noreferrer">{t(Strings.function_view_url)}</a>}
      </div>
      <div className={styles.subTitle}>
        {t(Strings.formula_how_to_use)}
      </div>
      <code>{syntax}</code>
      <div className={styles.subTitle}>
        {t(Strings.formula_example_sub_title)}
      </div>
      <code><ExpressionColorant expression={examples} /></code>
    </>
  );
};

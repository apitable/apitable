import { Typography, useTheme } from '@apitable/components';
import * as React from 'react';
import MarkdownIt from 'markdown-it';
import styles from './style.module.less';

const md = new MarkdownIt();
// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function render(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');
  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';// replace value of existing attr
  }
  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

interface IDescriptionFieldProps {
  id: string;
  description?: string | React.ReactElement;
}

export function DescriptionField(props: IDescriptionFieldProps) {
  const theme = useTheme();
  const { id, description } = props;
  if (!description) {
    return null;
  }
  const descriptionHTMLString = md.render(description || '');
  if (typeof description === 'string') {
    return (
      <Typography variant="body4" color={theme.color.fc3} >
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: descriptionHTMLString }} />
      </Typography>
    );
  }
  return (
    <div id={id} className="field-description">
      {description}
    </div>
  );
}

export default DescriptionField;

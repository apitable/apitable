import { t, Strings } from '@apitable/core';
import { Button, IconButton } from '@vikadata/components';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@vikadata/icons';
import styled from 'styled-components';
import { IArrayFieldTemplateProps } from '../../core/interface';

const InlineArrayItem = styled.div`
  display: flex;
  align-items: center;
`;

type IArrayFieldItems = Pick<IArrayFieldTemplateProps, 'items'>;
type IArrayFieldItem = IArrayFieldItems['items'][number];

const ArrayFieldItem = (props: IArrayFieldItem) => {
  const isUpDisable = props.disabled || props.readonly || !props.hasMoveUp;
  const isDownDisable = props.disabled || props.readonly || !props.hasMoveDown;
  return (
    <InlineArrayItem>
      {props.children}
      {props.hasToolbar && (
        <>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              disabled={isUpDisable}
              size="small"
              onClick={props.onReorderClick(props.index, props.index - 1)}
              icon={ArrowUpOutlined}
            />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              disabled={isDownDisable}
              onClick={props.onReorderClick(props.index, props.index + 1)}
              icon={ArrowDownOutlined}
            />
          )}
          {props.hasRemove && (
            <IconButton
              disabled={props.disabled || props.readonly}
              onClick={props.onDropIndexClick(props.index)}
              icon={DeleteOutlined}
            />
          )}
        </>
      )}
    </InlineArrayItem>
  );
};

export const ArrayFieldTemplate = (props: IArrayFieldTemplateProps) => {
  const marginTop = props.items.length > 0 ? 8 : 0;
  return (
    <div>
      {props.items.map(element => <ArrayFieldItem {...element} />)}
      {props.canAdd && (
        <div style={{ marginTop }}>
          <Button onClick={props.onAddClick} size="small" >+ {t(Strings.robot_action_send_web_request_add_header_button)}</Button>
        </div>
      )}
    </div >
  );
};

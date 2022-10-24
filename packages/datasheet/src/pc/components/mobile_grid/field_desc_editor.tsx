import { useThemeColors } from '@vikadata/components';
import { CollaCommandName, Strings, t } from '@apitable/core';
import { Input } from 'antd';
import closest from 'antd-mobile/lib/_util/closest';
import Modal from 'antd-mobile/lib/modal';
import { Action } from 'antd-mobile/lib/modal/PropsType';
import classNames from 'classnames';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Message } from '../common';
import { FIELD_DESC_LENGTH } from '../multi_grid/field_desc';
import styles from './styles.module.less';

const { TextArea } = Input;

const prefixCls = 'am-modal';

const noop = () => { };

const FieldDescEditor = ({ field, onClose, readOnly }) => {
  const [value, setValue] = useState(field.desc || '');
  const colors = useThemeColors();
  const textLenHasExceeded = value.length > FIELD_DESC_LENGTH;

  const onOk = () => new Promise((resolve, reject) => {
    if (textLenHasExceeded) {
      reject(t(Strings.field_desc_length_exceeded));
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      fieldId: field.id,
      data: {
        ...field,
        desc: value,
      },
    });
    resolve('succeed');
  });

  const actions: Action<React.CSSProperties>[] = [
    {
      text: t(Strings.cancel),
      style: { userSelect: 'none' },
    },
    {
      text: t(Strings.confirm),
      onPress: onOk,
      style: {
        // https://css-tricks.com/8-digit-hex-codes/
        color: textLenHasExceeded ? `${colors.primaryColor}80` : colors.primaryColor,
        userSelect: 'none',
      },
    },
  ];

  const readOnlyFooter: Action<React.CSSProperties>[] = [
    {
      text: t(Strings.confirm),
      onPress: onClose,
      style: {
        color: colors.fc1
      }
    },
  ];

  const footer = actions.map((button: Action<React.CSSProperties>) => {
    const originPress = button.onPress || noop;
    button.onPress = () => {
      const res = originPress();
      if (res && res.then) {
        res
          .then(() => {
            onClose();
          })
          .catch(error => {
            Message.error({ content: error });
          });
      } else {
        onClose();
      }
    };
    return button;
  });

  const onWrapTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target as Element, `.${prefixCls}-footer`);
    if (!pNode) {
      e.preventDefault();
    }
  };

  return (
    <Modal
      visible
      transparent
      title={t(Strings.field_desc)}
      transitionName="am-zoom"
      closable={false}
      maskClosable={false}
      footer={(readOnly ? readOnlyFooter : footer) as any}
      wrapClassName={classNames({
        [styles.singleBtn]: readOnly,
      })}
      maskTransitionName="am-fade"
      platform="ios"
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <TextArea
        placeholder={t(Strings.editing_field_desc)}
        className={classNames(styles.textarea, {
          [styles.error]: textLenHasExceeded,
          [styles.readOnly]: readOnly
        })}
        disabled={readOnly}
        rows={5}
        defaultValue={field.desc}
        readOnly={readOnly}
        onChange={e => setValue(e.target.value)}
      />
      <p
        className={classNames(styles.count, {
          [styles.error]: textLenHasExceeded,
        })}
      >
        {value.length}/{FIELD_DESC_LENGTH}
      </p>
    </Modal>
  );
};

export const expandFieldDescEditorMobile = ({ field, readOnly }) => {

  const onClose = () => {
    ReactDOM.unmountComponentAtNode(div);
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const div = document.createElement('div');
  document.body.appendChild(div);

  ReactDOM.render(
    <FieldDescEditor
      field={field}
      readOnly={readOnly}
      onClose={onClose}
    />,
    div,
  );
};

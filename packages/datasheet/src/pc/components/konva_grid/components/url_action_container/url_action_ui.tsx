import { useClickAway } from 'ahooks';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, colorVars, TextButton, TextInput, Typography } from '@apitable/components';
import { CollaCommandName, Selectors, Strings, t, ICellValue, FieldType } from '@apitable/core';
import { NewtabOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils/dom';
import { formatValue } from './util';
import styles from './styles.module.less';

interface IUrlActionUI {
  activeUrlAction: boolean;
  setActiveUrlAction: React.Dispatch<React.SetStateAction<boolean>>;
  fieldId?: string;
  recordId?: string;
  datasheetId: string;
  style?: React.CSSProperties;
  title?: string;
  tempValue?: string;
  callback?: React.Dispatch<React.SetStateAction<string>>;
}

export const UrlActionUI = (props: IUrlActionUI) => {
  const { activeUrlAction, setActiveUrlAction, fieldId, recordId, datasheetId, style, tempValue, callback } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const [mount, setMount] = useState(false);
  const snapshot = useAppSelector((state) => Selectors.getSnapshot(state)!);
  const cellValue = useAppSelector((state) => {
    if (!fieldId || !recordId) return null;
    return Selectors.getCellValue(state, snapshot, recordId, fieldId);
  });

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const cellValueText = get(cellValue, '0.text') || tempValue;
  const cellValueTitle = get(cellValue, '0.title') || tempValue;
  const cellValueFavicon = get(cellValue, '0.favicon');

  const [text, setText] = useState(cellValueText);
  const [title, setTitle] = useState(cellValueTitle || cellValueText);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useClickAway(
    () => {
      if (mount) {
        setActiveUrlAction(false);
      }
    },
    containerRef,
    'click',
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    stopPropagation(e);
  };

  const handleEnhanceTextClick = useEnhanceTextClick();

  const content = (
    <>
      <Typography className={styles.label} variant="body3">
        {t(Strings.link)}
      </Typography>
      <TextInput
        suffix={
          text && (
            <div className={styles.link} onClick={() => handleEnhanceTextClick(FieldType.URL, text)}>
              <Tooltip title={t(Strings.url_jump_link)} placement="top">
                <span>
                  <NewtabOutlined />
                </span>
              </Tooltip>
            </div>
          )
        }
        value={text}
        ref={inputRef}
        onChange={(evt) => {
          setText(evt.target.value);
        }}
        className={styles.text}
        block
      />
      <Typography className={classNames(styles.label, styles.titleLabel)} variant="body3">
        {t(Strings.default_datasheet_title)}
      </Typography>
      <TextInput
        value={title}
        onChange={(evt) => {
          setTitle(evt.target.value);
        }}
        className={styles.title}
        block
      />
      <section className={styles.buttonWrapper}>
        {!isMobile && (
          <TextButton size="small" onClick={() => setActiveUrlAction(false)} style={{ color: colorVars.thirdLevelText }}>
            {t(Strings.cancel)}
          </TextButton>
        )}
        <Button
          block={isMobile}
          size="small"
          onClick={() => {
            if (recordId && fieldId) {
              resourceService.instance!.commandManager.execute({
                cmd: CollaCommandName.SetRecords,
                datasheetId,
                data: [
                  {
                    recordId,
                    fieldId,
                    value: formatValue(text, title, cellValueFavicon) as ICellValue,
                  },
                ],
              });
              callback?.(text || title);
            }
            setActiveUrlAction(false);
          }}
          color="primary"
        >
          {t(Strings.confirm)}
        </Button>
      </section>
    </>
  );

  return isMobile ? (
    <Popup
      title={props.title}
      height="auto"
      open={activeUrlAction}
      onClose={(e) => {
        stopPropagation(e as any);
        setActiveUrlAction(false);
      }}
      className={styles.urlActionContainer}
      destroyOnClose
    >
      {content}
    </Popup>
  ) : (
    <div
      onKeyDown={handleKeyDown}
      onMouseDown={stopPropagation}
      ref={containerRef}
      className={classNames(styles.urlActionContainer, styles.pc)}
      style={style}
    >
      {content}
    </div>
  );
};

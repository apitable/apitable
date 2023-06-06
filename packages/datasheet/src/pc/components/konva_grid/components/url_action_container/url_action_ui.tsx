import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { CollaCommandName, Selectors, Strings, t, ICellValue } from '@apitable/core';
import { Button, colorVars, TextButton, TextInput, Typography } from '@apitable/components';
import { NewtabOutlined } from '@apitable/icons';
import styles from './styles.module.less';
import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { stopPropagation } from 'pc/utils/dom';
import { resourceService } from 'pc/resource_service';
import { formatValue } from './util';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';

interface IUrlActionUI {
  activeUrlAction: boolean;
  setActiveUrlAction: React.Dispatch<React.SetStateAction<boolean>>;
  fieldId?: string;
  recordId?: string;
  datasheetId: string;
  style?: React.CSSProperties;
}

export const UrlActionUI = (props: IUrlActionUI) => {
  const { activeUrlAction, setActiveUrlAction, fieldId, recordId, datasheetId, style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount]= useState(false);
  const snapshot = useSelector(state => Selectors.getSnapshot(state)!);
  const cellValue = useSelector(state => {
    if (!fieldId || !recordId) return null;
    return Selectors.getCellValue(state, snapshot, recordId, fieldId);
  });

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const cellValueText = get(cellValue, '0.text');
  const cellValueTitle = get(cellValue, '0.title');
  const cellValueFavicon = get(cellValue, '0.favicon');

  const [text, setText] = useState(cellValueText);
  const [title, setTitle] = useState(cellValueTitle || cellValueText);

  useEffect(() => {
    setMount(true);
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
  const content = (
    <>
      <Typography className={styles.label} variant="body3">{t(Strings.link)}</Typography>
      <TextInput
        suffix={<a target='_blank'rel='noreferrer' className={styles.link} href={text}><NewtabOutlined/></a>}
        value={text}
        onChange={(evt) => {
          setText(evt.target.value);
        }}
        block={isMobile}
      />
      <Typography className={classNames(styles.label, styles.titleLabel)} variant="body3">{t(Strings.default_datasheet_title)}</Typography>
      <TextInput
        value={title}
        onChange={(evt) => {
          setTitle(evt.target.value);
        }}
        block={isMobile}
      />
      <section className={styles.buttonWrapper}>
        {!isMobile && (
          <TextButton size="small" onClick={() => setActiveUrlAction(false)} style={{ color: colorVars.thirdLevelText }}>
            {t(Strings.cancel)}
          </TextButton>
        )}
        <Button
          block={isMobile}
          size='small'
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
            }
            setActiveUrlAction(false);
          }}
          color='primary'
        >
          {t(Strings.confirm)}
        </Button>
      </section>
    </>
  );

  return isMobile ? (
    <Popup
      title={t(Strings.please_edit_url)}
      height='auto'
      open={activeUrlAction}
      onClose={e => {
        stopPropagation(e as any);
        setActiveUrlAction(false);
      }}
      className={styles.urlActionContainer}
      destroyOnClose
    >
      {content}
    </Popup>
  ) : (
    <div onMouseDown={stopPropagation} ref={containerRef} className={classNames(styles.urlActionContainer, styles.pc)} style={style}>
      {content}
    </div>
  );
};
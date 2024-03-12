import { get } from 'lodash';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useEffect, useImperativeHandle, useState } from 'react';
import { IconButton } from '@apitable/components';
import { getNewId, ICellValue, IDPrefix, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { Status } from 'enterprise/editor/workdoc/interface';
import styles from './style.module.less';

// @ts-ignore
const CollaborationEditorNoSSR = dynamic(() => import('enterprise/editor/workdoc/collaboration_editor'), { ssr: false }) as any;

interface IFormWorkdocEditorProps extends Pick<IBaseEditorProps, 'onSave'> {
  cellValue?: ICellValue;
  fieldId: string;
  editing: boolean;
  editable: boolean;
  datasheetId: string;
  mount?: boolean;
  isMobile?: boolean;
}

const FormWorkdocEditorBase: React.ForwardRefRenderFunction<IEditor, IFormWorkdocEditorProps> = (porps, ref) => {
  const { cellValue, fieldId, editing, editable, datasheetId, mount, onSave, isMobile } = porps;
  const { formId } = useAppSelector((state) => state.pageParams);

  const [status, setStatus] = React.useState<Status>(Status?.Connecting);
  const [title, setTitle] = useState<string>(get(cellValue, '0.title') || '');

  useEffect(() => {
    const cellValueTitle = get(cellValue, '0.title');
    const documentId = get(cellValue, '0.documentId') || '';
    if (documentId && title && cellValueTitle !== title) {
      onSave?.([
        {
          documentId,
          title,
        },
      ]);
    }
  }, [cellValue, onSave, title]);

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        focus();
      },
      onEndEdit: () => {
        console.log('onEndEdit');
      },
      onStartEdit: () => {},
      setValue: () => {
        console.log('setValue');
      },
      saveValue: () => {
        console.log('saveValue');
      },
    }),
  );

  if (cellValue == null) {
    return (
      <div className={styles.createWorkdoc}>
        <IconButton
          disabled={!editable || isMobile}
          icon={AddOutlined}
          onClick={() => {
            if (!editable || isMobile) {
              return;
            }
            const documentId = getNewId(IDPrefix.Document);
            onSave?.([
              {
                documentId,
                title: '',
              },
            ]);
          }}
        />
        <div>{t(Strings.workdoc_create)}</div>
      </div>
    );
  }

  return (
    <div className={styles.formWorkdocEditor}>
      <div className={styles.status}>
        {status === Status.Connecting && <div className={styles.connecting}>{t(Strings.workdoc_ws_connecting)}</div>}
        {status === Status.Disconnected && <div className={styles.disconnected}>{t(Strings.workdoc_ws_disconnected)}</div>}
      </div>
      {Boolean(CollaborationEditorNoSSR) && (
        <CollaborationEditorNoSSR
          cellValue={cellValue}
          fieldId={fieldId}
          formId={formId}
          editing={editing}
          editable={editable}
          datasheetId={datasheetId}
          status={status}
          setStatus={setStatus}
          mount={mount}
          title={title}
          setTitle={setTitle}
          onSave={onSave}
          isMobile={isMobile}
          expandable={false}
        />
      )}
    </div>
  );
};

export const FormWorkdocEditor = React.forwardRef(FormWorkdocEditorBase);

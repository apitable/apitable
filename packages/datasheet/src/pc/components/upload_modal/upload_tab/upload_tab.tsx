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

import { Tooltip } from 'antd';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IAttachmentValue, Strings, t } from '@apitable/core';
import { FileAddOutlined, LinkOutlined, PasteOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { ExpandAttachContext } from 'pc/components/expand_record/expand_attachment';
import { FormContext } from 'pc/components/form_container/form_context';
import { resourceService } from 'pc/resource_service';
import { UploadManager } from 'pc/utils';
import { IUploadFileList } from '../upload_core';
import { UploadPaste } from '../upload_paste/upload_paste';
import { IUploadZoneItem, UploadZone } from '../upload_zone';
import styles from './styles.module.less';

export enum UploadTabType {
  Drag = 'Drag',
  Paste = 'Paste',
  Link = 'Link',
}

const tabConfig = {
  [UploadTabType.Drag]: {
    open: true,
    icon: FileAddOutlined,
    tip: t(Strings.local_drag_upload),
    index: 1,
  },
  [UploadTabType.Paste]: {
    open: true,
    icon: PasteOutlined,
    tip: t(Strings.paste_upload),
    index: 2,
  },
  [UploadTabType.Link]: {
    open: false,
    icon: LinkOutlined,
    tip: '',
    index: 3,
  },
};

interface IUploadTabProps {
  recordId: string;
  fieldId: string;
  cellValue: IAttachmentValue[];
  setUploadList: React.Dispatch<React.SetStateAction<IUploadFileList>>;
  uploadList: IUploadFileList;
  className?: string;
  setNvcVal: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ICommonTabRef {
  focus(): void;

  trigger?(): void;
}

export const UploadTab: React.FC<React.PropsWithChildren<IUploadTabProps>> = (props) => {
  const colors = useThemeColors();
  const { recordId, fieldId, setUploadList, className, cellValue, setNvcVal } = props;
  const uploadManager = resourceService.instance!.uploadManager;
  const tabInfoRef = useRef<ICommonTabRef>(null);
  // Store pending files that are waiting for captcha verification
  const pendingFilesRef = useRef<IUploadZoneItem[]>([]);

  const { isFocus } = useContext(ExpandAttachContext);
  
  // Get shared captcha from FormContext (for forms with multiple attachment fields)
  // The captcha is initialized at FormContainer level and shared across all attachment fields
  const formContext = useContext(FormContext);
  const { sharedNvcData, needCaptcha, triggerSharedVerification } = formContext || {};

  const [currentTab, setCurrentTab] = useState(UploadTabType.Drag);

  useEffect(() => {
    if (!isFocus) {
      return;
    }
    tabInfoRef.current?.focus();
  }, [currentTab, isFocus]);

  function onUpload(list: IUploadZoneItem[]) {
    // If captcha is needed but not yet obtained, store files and trigger verification
    if (needCaptcha && !sharedNvcData) {
      // Accumulate pending files (user might add more files while waiting)
      pendingFilesRef.current = uniqBy([...pendingFilesRef.current, ...list], 'fileId');
      
      if (triggerSharedVerification) {
        // Use shared captcha from FormContext
        triggerSharedVerification((data) => {
          setNvcVal(data || null);
          // Process pending files after shared verification succeeds
          if (data && pendingFilesRef.current.length > 0) {
            const queueIe = UploadManager.getCellId(recordId, fieldId);
            const existList = uploadManager.get(queueIe);
            setUploadList(uniqBy([...existList, ...pendingFilesRef.current], 'fileId'));
            pendingFilesRef.current = [];
          }
        });
      }
      return;
    }
    
    // If captcha is needed and already verified, update parent's nvcVal
    if (needCaptcha && sharedNvcData) {
      setNvcVal(sharedNvcData);
    }
    
    // If no captcha needed or already verified, proceed with upload
    const queueIe = UploadManager.getCellId(recordId, fieldId);
    const existList = uploadManager.get(queueIe);
    setUploadList(uniqBy([...existList, ...list], 'fileId'));
  }

  function showActiveIcon(isActive: boolean) {
    if (typeof isFocus !== 'boolean') {
      return isActive;
    }
    return isFocus && isActive;
  }

  function calcActiveLineOffset() {
    const activeIndex = tabConfig[currentTab].index;
    return parseInt(styles.tabWidth, 10) * activeIndex - 2 * parseInt(styles.activeLineWidth, 10);
  }

  return (
    <div className={classNames(styles.uploadTab, className)}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <nav className={styles.nav}>
          {Object.entries(tabConfig).map(([id, config]) => {
            if (!config.open) {
              return;
            }
            const Icon = config.icon;
            const isActive = id === currentTab;
            return (
              <Tooltip title={config.tip} key={id}>
                <span
                  className={styles.tab}
                  onMouseDown={() => {
                    setCurrentTab(id as UploadTabType);
                  }}
                  onClick={() => {
                    if (id === UploadTabType.Drag) {
                      tabInfoRef.current?.trigger?.();
                      return;
                    }
                    tabInfoRef.current?.focus();
                  }}
                >
                  <Icon size={16} color={showActiveIcon(isActive) ? colors.primaryColor : colors.fourthLevelText}/>
                </span>
              </Tooltip>
            );
          })}
          <span
            className={classNames({
              [styles.activeLine]: true,
              [styles.grayColor]: isFocus === false,
            })}
            style={{ transform: `translateX(${calcActiveLineOffset()}px)` }}
          />
        </nav>
      </ComponentDisplay>

      <div className={styles.uploadTabInfo}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          {currentTab === UploadTabType.Drag && (
            <UploadZone onUpload={onUpload} recordId={recordId} fieldId={fieldId} cellValue={cellValue}
              ref={tabInfoRef}/>
          )}
          {currentTab === UploadTabType.Paste && (
            <UploadPaste onUpload={onUpload} ref={tabInfoRef} fieldId={fieldId} recordId={recordId}
              cellValue={cellValue}/>
          )}
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <UploadZone onUpload={onUpload} recordId={recordId} fieldId={fieldId} cellValue={cellValue} ref={tabInfoRef}/>
        </ComponentDisplay>
      </div>
    </div>
  );
};

import { Button, TextButton, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { ButtonPlus } from 'pc/components/common';
import { execNoTraceVerification } from 'pc/utils';
import { FC, useState } from 'react';
// import FileSvg from 'static/icon/datasheet/attachment/datasheet_img_attachment_other_placeholder.svg';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import ExcelPng from 'static/icon/datasheet/attachment/datasheet_img_attachment_excel_placeholder.png';
import { IErrorInfo } from '../interface';
import { Records } from './records';
import styles from './style.module.less';

interface IFileSelected {
  file: File | undefined;
  init: () => void;
  previewList: IErrorInfo[];
  confirmImport(nvcVal?: string);
}

export const FileSelected: FC<IFileSelected> = ({
  file, init,
  previewList, confirmImport
}) => {
  const [preview, setPreview] = useState(false);
  const colors = useThemeColors();
  if (!file) return null;

  const _confirmImport = () => {
    window['nvc'] ? execNoTraceVerification(confirmImport) : confirmImport();
  };

  const previewClick = () => {
    setPreview(true);
  };
  const fileName = file ? file.name : '';

  return (
    <div className={styles.fileSelected}>
      <div className={styles.fileImg}>
        <Image src={ExcelPng} />
        <ButtonPlus.Font
          icon={<DeleteIcon style={{ margin: '4px' }} fill={colors.thirdLevelText} />}
          onClick={init}
          size="small"
        />
      </div>
      <div className={styles.fileName}>{fileName}</div>
      <div className={styles.btnWrap}>
        <Button
          color="primary"
          block
          onClick={_confirmImport}
          style={{ marginBottom: '8px' }}
        >
          {t(Strings.confirm_import)}
        </Button>
        <TextButton
          block
          onClick={previewClick}
        >
          {t(Strings.member_list_review)}
        </TextButton>
      </div>
      <Records
        records={previewList}
        close={() => setPreview(false)}
        init={init}
        title={t(Strings.member_preview_list)}
        subTitle={t(Strings.cur_import_member_count, { count: previewList.length })}
        visible={preview}
      />
    </div>
  );
};

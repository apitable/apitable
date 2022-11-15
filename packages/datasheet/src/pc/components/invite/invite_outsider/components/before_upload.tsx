import { useThemeColors } from '@apitable/components';
import { Strings, t, Url } from '@apitable/core';
import { Upload } from 'antd';
import * as React from 'react';
import { FC } from 'react';
import UploadIcon from 'static/icon/workbench/workbench_tip_upload.svg';
import { IErrorInfo, IKidType, KidType } from '../interface';
import styles from './style.module.less';

const { Dragger } = Upload;

interface IBeforeUpload {
  setKid: React.Dispatch<React.SetStateAction<IKidType>>;
  setPreviewList: React.Dispatch<React.SetStateAction<IErrorInfo[]>>;
  setErr: React.Dispatch<React.SetStateAction<string>>;
  setFile: (info: any) => void;
}
export const BeforeUpload: FC<IBeforeUpload> = ({ setFile, setKid, setErr, setPreviewList }) => {
  const downloadUrl = window.location.protocol + '//' + window.location.host + Url.DOWNLOAD_MEMBER_FILE;
  const colors = useThemeColors();
  const showFileErr = () => {
    setKid(KidType.Fail);
    setErr(t(Strings.failed_in_file_parsing));
  };
  const uploadFilesChange = (fileInfo: any) => {
    setFile(fileInfo.file as File);
    const fileReader = new FileReader();
    // const isCSV = f.name.split(".").reverse()[0] == "csv";
    fileReader.onload = async event => {
      try {
        const result = event.target?.result;
        if(!result) return;
        // Read the entire excel table object as a binary stream
        const Excel = await import('exceljs');
        const workbook = new Excel.Workbook();
        workbook.xlsx.load(result as ArrayBuffer).then(function() {
          // Storing the acquired data
          const data: IErrorInfo[] = [];
          const worksheet = workbook.getWorksheet(1); //Get the first worksheet
          worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            const emailContent = row.values[2];
            const rowName = row.values[1];
            const rowEmail = (emailContent && typeof emailContent === 'object')? emailContent.text : emailContent;
            const rowTeam = row.values[3];
            const hasText = rowName || rowEmail || rowTeam;
            if(rowNumber > 3 && hasText){
              data.push({
                rowNumber,
                name: rowName,
                email: rowEmail,
                team: rowTeam,
                message: '',
              });
            }
          });
          setPreviewList(data);
          setKid(KidType.FileSelected);
          setErr('');
        }, function(){
          showFileErr();
        });
      }catch (e) {
        showFileErr();
      }
    };
    fileReader.readAsBinaryString(fileInfo.file);
  };

  return (
    <div className={styles.beforeUpload}>
      <Dragger
        beforeUpload={()=> false}
        showUploadList={false}
        // accept=".xlsx,.xls,.csv"
        accept=".xlsx"
        onChange={uploadFilesChange}
      >
        <UploadIcon width={50} height={50} fill={colors.fourthLevelText}/>
        <h2>{t(Strings.invite_ousider_import_file_tip1)}</h2>
        {/* <h1>{t(Strings.invite_ousider_import_file_tip2)}</h1> */}
        <h1>{t(Strings.invite_ousider_import_file_tip3)}</h1>
      </Dragger>
      <div className={styles.fileInfo}>
        <a
          href={downloadUrl}
          download={t(Strings.invite_ousider_template_file_name)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primaryColor }}
        >
          {t(Strings.invite_ousider_template_click_to_download)}
        </a>
      </div>
    </div>
  );
};

import axios from 'axios';
import FileSaver from 'file-saver';
import { getDownloadSrc } from 'pc/utils';
import { IAttachmentValue, Strings, t } from '@apitable/core';

export function getFile(url: string) {
  return new Promise<Blob>((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      baseURL: '/', // axios will use the default baseURL
    })
      .then((data) => {
        resolve(data.data);
      })
      .catch((error) => {
        reject(error.toString());
      });
  });
}

export const bulkDownload = async(files: IAttachmentValue[]) => {
  const JSZip = await import('jszip').then((module) => module.default);

  const zip = new JSZip();

  const promises: Array<Promise<any>> = [];

  const namesToCount = {};

  const generateFileName = (file: IAttachmentValue, index: number) => {
    const fileName = file.name;
    if (namesToCount[fileName] == null) {
      namesToCount[fileName] = 1;
    } else {
      namesToCount[fileName]++;
    }
    // Doing something about renamed files
    if (namesToCount[fileName] > 1) {
      const [name, suffixName] = fileName.split('.');
      return `${name} ${namesToCount[fileName]}${suffixName ? '.' : ''}${suffixName || ''}`;
    }
    return fileName;
  };

  files.forEach((file, index) => {
    const promise = getFile(getDownloadSrc(file)).then((data) => {
      // issue: https://github.com/Stuk/jszip/issues/616
      // jszip is forcing UTC time as last modified date, in order to solve this problem, we need to handle it manually
      // Reference: https://github.com/Stuk/jszip/issues/369#issuecomment-388324954
      const currDate = new Date();
      const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60 * 1000); 

      // Download the file, and save it as an ArrayBuffer object
      const fileName = generateFileName(file, index);
      zip.file(fileName, data, {
        binary: true,
        date: dateWithOffset,
      });
    });
    promises.push(promise);
  });

  return Promise.all(promises).then(() => {
    zip
      .generateAsync({
        type: 'blob',
      })
      .then((content) => {
        // Generate binary streams
        // Save files with file-saver
        FileSaver.saveAs(
          content,
          t(Strings.file_name_with_bulk_download, {
            fileName: files[0].name,
            count: files.length,
          })
        );
      });
  });
};

export const isFocusingInput = () => {
  return document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
};

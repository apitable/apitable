import { cellValueToImageSrc, Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { stopPropagation } from '../../../../utils/dom';
import { IPreviewTypeBase } from '../preview_type.interface';
import styles from './style.module.less';

const PreviewPdf: React.FC<IPreviewTypeBase> = props => {
  const { file } = props;
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { screenIsAtMost, clientWidth } = useResponsive();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    // The latest version 5.7.2 has solved the signature problem, but there are font loading problems, 5.4.0 is a more perfect version
    // Future upgrades, you need to read the exact version number from pdfjs.version, 
    // otherwise it may be inconsistent with the version of the react-pdf resulting in errors (such as white screen, etc.)
    pdfjs.GlobalWorkerOptions.workerSrc = process.env.NEXT_PUBLIC_PUBLIC_URL + '/file/pdf/pdf.worker.2.9.359.min.js';
  });

  function pre(e: React.MouseEvent) {
    setPageNumber(state => (state <= 1 ? 1 : --state));
    stopPropagation(e);
  }

  function next(e: React.MouseEvent) {
    setPageNumber(state => (state >= numPages! ? numPages! : ++state));
    stopPropagation(e);
  }

  return (
    <>
      <Document
        file={cellValueToImageSrc(file)}
        onLoadSuccess={onDocumentLoadSuccess}
        className={styles.pdf}
        loading={<div className={styles.loading}>{t(Strings.loading_file)}</div>}
        // onMouseDown={stopPropagation}
        options={{
          cMapUrl: process.env.NEXT_PUBLIC_PUBLIC_URL + '/file/pdf/',
          cMapPacked: true,
        }}
      >
        <Page
          pageNumber={pageNumber}
          width={screenIsAtMost(ScreenSize.md) ? clientWidth : 800}
          loading={<div className={styles.loading}>{t(Strings.loading_file)}</div>}
        />
      </Document>
      <div className={styles.pagination} onMouseDown={stopPropagation}>
        <button className={styles.pageLeft} onClick={pre} onMouseDown={stopPropagation}>
          {t(Strings.previous_page)}
        </button>
        <p>
          {' '}
          {pageNumber} of {numPages}
        </p>
        <button className={styles.pageRight} onClick={next} onMouseDown={stopPropagation}>
          {t(Strings.next_page)}
        </button>
      </div>
    </>
  );
};

export default PreviewPdf;

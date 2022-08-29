import { getCustomConfig } from '@vikadata/core';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FileType, getDownloadSrc, isWhatFileType, renderFileIconUrl } from 'pc/utils/file_type';
import * as React from 'react';
import { memo } from 'react';
import { NoSupport } from './no_support';
import { PreviewDoc } from './preview_doc';
import { Loading } from './preview_doc/loading';
import { PreviewImage } from './preview_image/preview_image';
import { IPreviewTypeBase } from './preview_type.interface';

const PreviewPdf = dynamic(() => import('./preview_pdf/preview_pdf'), {
  ssr: false,
  loading: () => <Loading />,
});

const PreviewMedia = dynamic(() => import('./preview_media/preview_media'), {
  ssr: false,
  loading: () => <Loading />,
});

export const PreviewType: React.FC<IPreviewTypeBase> = memo(props => {
  const {
    file,
    userInfo,
    spaceId,
    onClose,
    officePreviewEnable,
    previewUrl,
    disabledDownload
  } = props;

  const fileType = isWhatFileType({ name: file.name, type: file.mimeType });

  const { marketplaceDisable } = getCustomConfig();

  const commonImgProps = {
    src: renderFileIconUrl({ name: file.name, type: file.mimeType }),
    width: '100%',
    draggable: false,
  };

  const downloadUrl = getDownloadSrc(file);

  const DefaultNoSupportComponent = (
    <NoSupport
      icon={
        <Image
          {...commonImgProps}
          alt={file.name}
        />
      }
      disabledDownload={disabledDownload}
      type={FileType.Other}
      downloadUrl={downloadUrl}
      fileName={file.name}
    />
  );

  const PreviewDocComponent = (
    <PreviewDoc
      file={file}
      icon={
        <Image
          {...commonImgProps}
          alt={file.name}
        />
      }
      previewEnable={officePreviewEnable}
      userInfo={userInfo}
      spaceId={spaceId}
      onClose={onClose}
      previewUrl={previewUrl}
      disabledDownload={disabledDownload}
    />
  );

  switch (fileType) {
    case FileType.Image: {
      return <PreviewImage {...props} />;
    }
    case FileType.Pdf: {
      if (!officePreviewEnable) {
        return <PreviewPdf {...props} />;
      }
      return PreviewDocComponent;
    }
    case FileType.Doc: {
      if (marketplaceDisable) {
        return DefaultNoSupportComponent;
      }
      return PreviewDocComponent;
    }
    case FileType.Media: {
      return <PreviewMedia {...props} />;
    }

    case FileType.Zip:
    case FileType.Other: {
      return DefaultNoSupportComponent;
    }
    default: {
      return DefaultNoSupportComponent;
    }
  }
});

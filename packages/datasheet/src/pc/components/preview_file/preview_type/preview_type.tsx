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

import dynamic from 'next/dynamic';
import Image from 'next/image';
import * as React from 'react';
import { memo } from 'react';
import { getEnvVariables } from 'pc/utils/env';
import { FileType, getDownloadSrc, isWhatFileType, renderFileIconUrl } from 'pc/utils/file_type';
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

export const PreviewType: React.FC<React.PropsWithChildren<IPreviewTypeBase>> = memo((props) => {
  const { file, userInfo, spaceId, onClose, officePreviewEnable, previewUrl, disabledDownload } = props;

  const fileType = isWhatFileType({ name: file.name, type: file.mimeType });

  const { SPACE_INTEGRATION_PAGE_VISIBLE } = getEnvVariables();

  const commonImgProps = {
    src: renderFileIconUrl({ name: file.name, type: file.mimeType }),
    width: '100%',
    draggable: false,
  };

  const downloadUrl = getDownloadSrc(file);

  const DefaultNoSupportComponent = (
    <NoSupport
      icon={<Image {...commonImgProps} alt={file.name} />}
      disabledDownload={disabledDownload}
      type={FileType.Other}
      downloadUrl={downloadUrl}
      fileName={file.name}
    />
  );

  const PreviewDocComponent = (
    <PreviewDoc
      file={file}
      icon={<Image {...commonImgProps} alt={file.name} />}
      previewEnable={officePreviewEnable}
      userInfo={userInfo!}
      spaceId={spaceId}
      onClose={onClose}
      previewUrl={previewUrl!}
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
      if (!SPACE_INTEGRATION_PAGE_VISIBLE) {
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

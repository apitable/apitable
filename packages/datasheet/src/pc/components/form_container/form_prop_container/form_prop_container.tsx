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

import classNames from 'classnames';
import * as React from 'react';
import { CollaCommandName, IFormProps, Selectors } from '@apitable/core';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { DescEditor } from './desc_editor';
import { CoverImgUploader, LogoImgUploader } from './img_uploader';
import { IModeEnum } from './interface';
import { TitleEditor } from './title_editor';
import styles from './style.module.less';

interface IFormPropContainerProps {
  formId: string;
  title: string;
  editable: boolean;
  formProps: IFormProps;
}

export const FormPropContainer: React.FC<React.PropsWithChildren<IFormPropContainerProps>> = (props) => {
  const { formId, editable, formProps } = props;
  const { description, fullScreen, coverVisible, logoVisible, logoUrl: _logoUrl, coverUrl } = formProps;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { shareId } = useAppSelector((state) => state.pageParams);
  const mode = Boolean(shareId) || !editable ? IModeEnum.Preview : IModeEnum.Edit;
  const title = useAppSelector((state) => Selectors.getForm(state)!.name);
  const logoUrl = useGetSignatureAssertByToken(_logoUrl || '');
  const updateProps = (partProps: Partial<IFormProps>) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UpdateFormProps,
      formId,
      partialProps: partProps,
    });
  };

  const commonProps = {
    nodeId: formId,
    mode,
    updateProps,
  };

  return (
    <div
      className={classNames(styles.formPropContainer, {
        [styles.noRadius]: fullScreen || isMobile,
      })}
    >
      {coverVisible && (
        <div
          className={classNames(styles.coverImgUploader, {
            [styles.coverImgUploaderMobile]: isMobile,
          })}
        >
          <CoverImgUploader {...commonProps} coverUrl={coverUrl} />
        </div>
      )}
      <div
        className={classNames(styles.limitStyle, {
          [styles.limitStyleMobile]: isMobile,
          [styles.noCover]: !coverVisible && logoVisible,
          [styles.noLogo]: !logoVisible || (logoVisible && mode === IModeEnum.Preview && !logoUrl),
          [styles.onlyTitle]: !coverVisible && !logoVisible,
          [styles.shareLogoPadding]: Boolean(shareId && isMobile),
        })}
      >
        {logoVisible && (
          <div className={classNames(styles.logoImgUploader, isMobile && styles.logoImgUploaderMobile)}>
            <LogoImgUploader {...commonProps} logoUrl={logoUrl} />
          </div>
        )}
        <TitleEditor {...commonProps} title={title} />
        <DescEditor {...commonProps} descData={description} />
      </div>
    </div>
  );
};

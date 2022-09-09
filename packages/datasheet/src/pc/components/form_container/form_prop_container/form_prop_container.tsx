import * as React from 'react';
import { useSelector } from 'react-redux';
import { IFormProps, CollaCommandName } from '@vikadata/core';
import styles from './style.module.less';
import classNames from 'classnames';
import { TitleEditor } from './title_editor';
import { DescEditor } from './desc_editor';
import { CoverImgUploader, LogoImgUploader } from './img_uploader';
import { IModeEnum } from './interface';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { resourceService } from 'pc/resource_service';

interface IFormPropContainerProps {
  formId: string;
  title: string;
  editable: boolean;
  formProps: IFormProps;
}

export const FormPropContainer: React.FC<IFormPropContainerProps> = props => {
  const { formId, editable, formProps } = props;
  const { description, fullScreen, coverVisible, logoVisible, logoUrl, coverUrl } = formProps;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { shareId } = useSelector(state => state.pageParams);
  const mode = Boolean(shareId) || !editable ? IModeEnum.Preview : IModeEnum.Edit;

  const updateProps = (partProps: Partial<IFormProps>) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UpdateFormProps,
      formId,
      partialProps: partProps,
    });
  };

  const commonProps = {
    formId,
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
        <TitleEditor {...commonProps} />
        <DescEditor {...commonProps} descData={description} />
      </div>
    </div>
  );
};

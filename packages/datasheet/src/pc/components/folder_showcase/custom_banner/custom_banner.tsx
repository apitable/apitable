import { useMount } from 'ahooks';
import { ConfigConstant, Strings, t, Settings, CutMethod, getImageThumbSrc, integrateCdnHost } from '@vikadata/core';
import { Col, Row, Tabs, Upload } from 'antd';
import { RowProps } from 'antd/lib/row';
import { BaseModal } from 'pc/components/common';
import { Button } from '@vikadata/components';
import { FC, useState } from 'react';
import SelectedIcon from 'static/icon/common/common_icon_select.svg';
import styles from './style.module.less';

const { TabPane } = Tabs;
const horizontalGutter = { xs: 16, sm: 16, md: 24, lg: 24, xl: 24 };
const rowConfig: RowProps = {
  gutter: [horizontalGutter, 24],
};

enum TabKeys {
  Default = '1',
  Custom = '2',
}

export interface ICustomBannerProps {
  checkId: string;
  changeBanner: (bannerId: string) => void;
  uploadBanner: (file: File) => boolean;
  closeModal?: () => void;
}

export const CustomBanner: FC<ICustomBannerProps> = props => {
  const { checkId, changeBanner, uploadBanner } = props;
  // banner图集合
  const [banners, setBanners] = useState<string[]>([]);

  useMount(() => {
    setBanners(Settings.folder_showcase_banners.value.split(','));
  });

  const upload = (file: File) => {
    uploadBanner(file);
    props.closeModal && props.closeModal();
    return false;
  };

  const cancelModal = () => {
    props.closeModal && props.closeModal();
  };

  return (
    <BaseModal
      title={t(Strings.custom_picture)}
      footer={null}
      width={486}
      onCancel={cancelModal}
      maskClosable
    >
      <div className={styles.customBannerWrapper}>
        <Tabs defaultActiveKey={TabKeys.Default}>
          <TabPane tab={t(Strings.default_picture)} key={TabKeys.Default}>
            <div className={styles.scrollWrapper}>
              <div className={styles.banners}>
                <Row {...rowConfig}>
                  {
                    banners.map((bannerId, index) => (
                      <Col
                        key={bannerId}
                        xl={8}
                        lg={8}
                        md={8}
                        sm={12}
                        xs={24}
                      >
                        <div
                          className={styles.bannerPerviewImg}
                          style={{ backgroundImage: `url(${getImageThumbSrc(integrateCdnHost(bannerId), { method: CutMethod.CUT, size: 470 })})` }}
                          onClick={() => changeBanner(bannerId)}
                        >
                          {
                            (checkId === bannerId || (!checkId && index === 0)) &&
                            <div className={styles.checked}>
                              <SelectedIcon />
                            </div>
                          }
                        </div>
                      </Col>
                    ))
                  }
                </Row>
              </div>
            </div>
          </TabPane>
          <TabPane tab={t(Strings.custom_upload)} key={TabKeys.Custom}>
            <div className={styles.uploadWrapper}>
              <div className={styles.upload}>
                <Upload
                  showUploadList={false}
                  beforeUpload={upload}
                  accept={ConfigConstant.ACCEPT_FILE_TYPE}
                >
                  <Button
                    color="primary"
                  >
                    {t(Strings.choose_picture)}
                  </Button>
                </Upload>
                <div className={styles.tip}>{t(Strings.custom_upload_tip)}</div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </BaseModal>
  );
};

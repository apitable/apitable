import { Button, TextButton, Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, Navigation, Settings, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, PlayFilled } from '@apitable/icons';
import Image from 'next/image';
import { showModal } from 'modules/enterprise/guide/ui';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { isSocialPlatformEnabled, isSocialWecom } from 'pc/components/home/social_platform';
import { MobileBar } from 'pc/components/mobile_bar';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import WelcomeIcon from 'static/icon/datasheet/datasheet_img_welcome@2x.png';
import ApiPng from 'static/icon/workbench/welcome/api_shadow.png';
import BookPng from 'static/icon/workbench/welcome/book_shadow.png';
import ErpPng from 'static/icon/workbench/welcome/erp_shadow.png';
import FaqPng from 'static/icon/workbench/welcome/faq_shadow.png';
import GetVikaPng from 'static/icon/workbench/welcome/get_vika_shadow.png';
import MoviePng from 'static/icon/workbench/welcome/movie_shadow.png';
import PmoPng from 'static/icon/workbench/welcome/pmo_shadow.png';
import QuickStartPng from 'static/icon/workbench/welcome/quick_start_shadow.png';
import VikaSheetPng from 'static/icon/workbench/welcome/vikasheet_shadow.png';
import { CreateDataSheetModal } from './create_datasheet_modal';
import styles from './style.module.less';

export const Welcome: FC = () => {
  const colors = useThemeColors();
  const [show, setShow] = useState(false);
  const { treeNodesMap, rootId } = useSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      rootId: state.catalogTree.rootId,
      user: state.user.info,
    }),
    shallowEqual,
  );
  const spaceId = useSelector(state => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [downModuleId, setDownModuleId] = useState('');
  const env = getEnvVariables();
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);
  // Distinguish between platforms using different QR codes.
  const isBindDingTalk = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.DINGTALK);
  const isBindWecom = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.WECOM);
  const isBindFeishu = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.FEISHU);

  const isWecomSpace = isSocialWecom(spaceInfo);

  const plm = isBindDingTalk ? '?plm=dingtalk' : isBindWecom ? '?plm=wecom' : isBindFeishu ? '?plm=feishu' : '';
  const data = [
    {
      title: t(Strings.welcome_sub_title1),
      rightBtn: (isWecomSpace || !env.EDUCATION_URL) ? null : (
        <TextButton className={styles.moreTemplateBtn} onClick={() => navigationToUrl(env.EDUCATION_URL, { method: Method.NewTab })}>
          <Typography variant='body4' color={colors.fc3}>
            {t(Strings.more_education)}
          </Typography>
          <ChevronRightOutlined size={16} color={colors.fc3} />
        </TextButton>
      ),
      modules: [
        {
          id: 'welcome_module_1',
          name: t(Strings.welcome_module1),
          img: VikaSheetPng,
          color: colors.fc0,
          backgroundColor: colors.deepPurple[50],
          activeBackgroundColor: colors.deepPurple[100],
          isVideo: true,
          onClick: () => showModal(JSON.parse(Settings.user_guide_welcome_what_is_datasheet_video.value)),
        },
        {
          id: 'welcome_module_2',
          name: t(Strings.welcome_module2),
          img: QuickStartPng,
          color: colors.pink[500],
          backgroundColor: colors.pink[50],
          activeBackgroundColor: colors.pink[100],
          isVideo: true,
          onClick: () => showModal(JSON.parse(Settings.user_guide_welcome_quick_start_video.value)),
        },
        {
          id: 'welcome_module_3',
          name: t(Strings.welcome_module3),
          img: GetVikaPng,
          color: colors.indigo[500],
          backgroundColor: colors.indigo[50],
          activeBackgroundColor: colors.indigo[100],
          isVideo: true,
          onClick: () => showModal(JSON.parse(Settings.user_guide_welcome_introduction_video.value)),
        },
      ],
    },
    {
      title: t(Strings.welcome_sub_title2),
      rightBtn: (
        <TextButton className={styles.moreTemplateBtn} onClick={() => Router.push(Navigation.TEMPLATE)}>
          <Typography variant='body4' color={colors.fc3}>
            {t(Strings.more_template)}
          </Typography>
          <ChevronRightOutlined size={16} color={colors.fc3} />
        </TextButton>
      ),
      modules: [
        {
          id: 'welcome_module_4',
          name: t(Strings.welcome_module4),
          img: PmoPng,
          color: colors.teal[500],
          backgroundColor: colors.teal[50],
          activeBackgroundColor: colors.teal[100],
          onClick: () => navigationToUrl(`${window.location.origin}${Settings.user_guide_welcome_template1_url.value}`, { method: Method.Push }),
        },
        {
          id: 'welcome_module_5',
          name: t(Strings.welcome_module5),
          img: ErpPng,
          color: colors.tangerine[500],
          backgroundColor: colors.tangerine[50],
          activeBackgroundColor: colors.tangerine[100],
          onClick: () => navigationToUrl(`${window.location.origin}${Settings.user_guide_welcome_template2_url.value}`, { method: Method.Push }),
        },
        {
          id: 'welcome_module_6',
          name: t(Strings.welcome_module6),
          img: MoviePng,
          color: colors.blue[500],
          backgroundColor: colors.blue[50],
          activeBackgroundColor: colors.blue[100],
          onClick: () => navigationToUrl(`${window.location.origin}${Settings.user_guide_welcome_template3_url.value}`, { method: Method.Push }),
        },
      ],
    },
    {
      title: t(Strings.welcome_sub_title3),
      rightBtn: (
        <TextButton
          className={styles.moreTemplateBtn}
          onClick={() => navigationToUrl(`${window.location.origin}${Settings.integration_wecom_bind_help_center.value}${plm}`)}
        >
          <Typography variant='body4' color={colors.fc3}>
            {t(Strings.welcome_more_help)}
          </Typography>
          <ChevronRightOutlined size={16} color={colors.fc3} />
        </TextButton>
      ),
      modules: [
        {
          id: 'welcome_module_8',
          name: t(Strings.welcome_module8),
          img: BookPng,
          color: colors.green[500],
          backgroundColor: colors.green[50],
          activeBackgroundColor: colors.green[100],
          onClick: () => navigationToUrl(Settings.user_guide_welcome_product_manual_url.value, { method: Method.NewTab }),
        },
        {
          id: 'welcome_module_7',
          name: t(Strings.welcome_module7),
          img: FaqPng,
          color: colors.red[500],
          backgroundColor: colors.red[50],
          activeBackgroundColor: colors.red[100],
          onClick: () => navigationToUrl(Settings.user_guide_welcome_faq_url.value, { method: Method.NewTab }),
        },
        {
          id: 'welcome_module_9',
          name: t(Strings.welcome_module9),
          img: ApiPng,
          color: colors.purple[500],
          backgroundColor: colors.purple[50],
          activeBackgroundColor: colors.purple[100],
          onClick: () => navigationToUrl(`${window.location.origin}${Settings.user_guide_welcome_developer_center_url.value}${plm}`),
        },
      ],
    },
  ];

  if (!treeNodesMap[rootId] || !spaceId) {
    return <></>;
  }

  return (
    <>
      {
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileBar />
        </ComponentDisplay>
      }
      {treeNodesMap[rootId].hasChildren ? (
        <>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div className={styles.guide}>
              <Typography variant='h1' color={colors.fc1}>
                {t(Strings.welcome_title)}
              </Typography>
              <div className={styles.scrollWrapper}>
                <div className={styles.container}>
                  <div className={styles.main}>
                    {data.map((item, index) => (
                      <div className={styles.guideItem} key={index}>
                        {!isMobile && (
                          <div className={styles.titleWrapper}>
                            <Typography className={styles.title} variant='body1' color={colors.fc2}>
                              {item.title}
                            </Typography>
                            {item.rightBtn && <div className={styles.rightBtn}>{item.rightBtn}</div>}
                          </div>
                        )}
                        <div className={styles.moduleContainer}>
                          {(item.modules as any).map(module => (
                            <div
                              key={module.id}
                              className={styles.moduleItem}
                              style={{ backgroundColor: downModuleId === module.id ? module.activeBackgroundColor : module.backgroundColor }}
                              onClick={module.onClick}
                              onMouseDown={() => setDownModuleId(module.id)}
                              onMouseUp={() => setDownModuleId('')}
                              onTouchStart={() => setDownModuleId(module.id)}
                              onTouchEnd={() => setDownModuleId('')}
                            >
                              {module.isVideo && (
                                <div className={styles.videoBtn}>
                                  <PlayFilled size={20} />
                                </div>
                              )}
                              <span className={styles.moduleImg}>
                                <Image src={module.img} alt={module.name} />
                              </span>
                              <Typography variant='body3' className={styles.moduleName} color={module.color}>
                                {module.name}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <div className={styles.mobileGuide}>
              <div>
                <Typography variant='h2' color={colors.fc1}>
                  {t(Strings.welcome_title)}
                </Typography>
                <div className={styles.container}>
                  {data.map(item =>
                    (item.modules as any).map(module => (
                      <div
                        key={module.id}
                        className={styles.moduleItem}
                        style={{ backgroundColor: downModuleId === module.id ? module.activeBackgroundColor : module.backgroundColor }}
                        onClick={module.onClick}
                        onTouchStart={() => setDownModuleId(module.id)}
                        onTouchEnd={() => setDownModuleId('')}
                        onMouseDown={() => setDownModuleId(module.id)}
                        onMouseUp={() => setDownModuleId('')}
                      >
                        {module.isVideo && (
                          <div className={styles.videoBtn}>
                            <PlayFilled size={20} />
                          </div>
                        )}
                        <div className={styles.moduleImg}>
                          <Image src={module.img} alt={module.name} width={34} height={34} />
                        </div>
                        <Typography variant='body3' className={styles.moduleName} color={module.color}>
                          {module.name}
                        </Typography>
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>
          </ComponentDisplay>
        </>
      ) : (
        <div className={styles.welcome}>
          <div className={styles.contentWrapper}>
            <Image src={WelcomeIcon} alt={t(Strings.welcome_interface)} />
            {treeNodesMap[rootId].permissions.childCreatable ? (
              <>
                <div className={styles.tip}>{t(Strings.welcome_workspace_tip1)}</div>
                <Button style={{ width: 200 }} color='primary' size='large' onClick={() => setShow(true)}>
                  {t(Strings.create)}
                </Button>
              </>
            ) : (
              <div className={styles.tip}>{t(Strings.welcome_workspace_tip1)}</div>
            )}
          </div>

          {show && <CreateDataSheetModal setShow={setShow} />}
        </div>
      )}
    </>
  );
};

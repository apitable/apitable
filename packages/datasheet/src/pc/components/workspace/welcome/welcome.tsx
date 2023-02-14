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

import { Button, TextButton, Typography, useThemeColors, ThemeName } from '@apitable/components';
import { ConfigConstant, integrateCdnHost, IReduxState, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, PlayFilled } from '@apitable/icons';
// @ts-ignore
import { showModal } from 'enterprise';
import { get } from 'lodash';
import Image from 'next/image';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise';
import { MobileBar } from 'pc/components/mobile_bar';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useResponsive } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import WelcomeIconLight from 'static/icon/datasheet/workbench_empty_light.png';
import WelcomeIconDark from 'static/icon/datasheet/workbench_empty_dark.png';
import { CreateDataSheetModal } from './create_datasheet_modal';
import styles from './style.module.less';

const openUrl = (url: string) => {
  if (url.includes('http')) {
    return url;
  }
  return `${window.location.origin}${url}`;
};

export const Welcome: FC<React.PropsWithChildren<unknown>> = () => {
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
  const isBindDingTalk = spaceInfo && isSocialPlatformEnabled?.(spaceInfo, ConfigConstant.SocialType.DINGTALK);
  const isBindWecom = spaceInfo && isSocialPlatformEnabled?.(spaceInfo, ConfigConstant.SocialType.WECOM);
  const isBindFeishu = spaceInfo && isSocialPlatformEnabled?.(spaceInfo, ConfigConstant.SocialType.FEISHU);

  // const isWecomSpace = isSocialWecom(spaceInfo);

  const plm = isBindDingTalk ? '?plm=dingtalk' : isBindWecom ? '?plm=wecom' : isBindFeishu ? '?plm=feishu' : '';
  const data = (env.WELCOME_CONFIG ? Object.values(JSON.parse(env.WELCOME_CONFIG)) : []) as Record<string, any>[];
  const themeName = useSelector(state => state.theme);
  const WelcomeIcon = themeName === ThemeName.Light ? WelcomeIconLight : WelcomeIconDark;
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
                              {t(Strings[item.moduleTitleKey])}
                            </Typography>
                            {item.moreOperation && <div className={styles.rightBtn}>
                              <TextButton
                                className={styles.moreTemplateBtn}
                                onClick={() => navigationToUrl(openUrl(`${item.moreOperation.linkUrl}`))}
                              >
                                <Typography variant='body4' color={colors.fc3}>
                                  {t(Strings[item.moreOperation.textKay])}
                                </Typography>
                                <ChevronRightOutlined size={16} color={colors.fc3} />
                              </TextButton>
                            </div>}
                          </div>
                        )}
                        <div className={styles.moduleContainer}>
                          {(item.cards as any).map((card: any) => {
                            return <div
                              key={card.id}
                              className={styles.moduleItem}
                              style={{
                                backgroundColor: downModuleId === card.id ? get(colors, card.activeBackgroundColor) :
                                  get(colors, card.backgroundColor)
                              }}
                              onClick={() => {
                                if (card.video) {
                                  showModal(card.video);
                                  return;
                                }
                                navigationToUrl(openUrl(`${card.linkUrl}${plm}`), {
                                  method: card.linkNewTab === 'true' ? Method.NewTab : Method.Push
                                });
                              }}
                              onMouseDown={() => setDownModuleId(card.id)}
                              onMouseUp={() => setDownModuleId('')}
                              onTouchStart={() => setDownModuleId(card.id)}
                              onTouchEnd={() => setDownModuleId('')}
                            >
                              {card.Video && (
                                <div className={styles.videoBtn}>
                                  <PlayFilled size={20} />
                                </div>
                              )}
                              <span className={styles.moduleImg}>
                                <Image src={integrateCdnHost(card.img)} alt={card.text} width={34} height={34} />
                              </span>
                              <Typography variant='body3' className={styles.moduleName} color={get(colors, card.color)}>
                                {t(Strings[card.textKey])}
                              </Typography>
                            </div>;
                          })}
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
                    (item.cards as any).map((card: any) => (
                      <div
                        key={card.id}
                        className={styles.moduleItem}
                        style={{
                          backgroundColor: downModuleId === card.id ? get(colors, card.activeBackgroundColor) :
                            get(colors, card.backgroundColor)
                        }}
                        onClick={() => {
                          if (card.video) {
                            showModal(card.video);
                            return;
                          }
                          navigationToUrl(openUrl(`${card.linkUrl}${plm}`), {
                            method: card.linkNewTab === 'true' ? Method.NewTab : Method.Push
                          });
                        }}
                        onTouchStart={() => setDownModuleId(card.id)}
                        onTouchEnd={() => setDownModuleId('')}
                        onMouseDown={() => setDownModuleId(card.id)}
                        onMouseUp={() => setDownModuleId('')}
                      >
                        {card.video && (
                          <div className={styles.videoBtn}>
                            <PlayFilled size={20} />
                          </div>
                        )}
                        <div className={styles.moduleImg}>
                          <Image src={integrateCdnHost(card.img)} alt={card.name} width={34} height={34} />
                        </div>
                        <Typography variant='body3' className={styles.moduleName} color={get(colors, card.color)}>
                          {t(Strings[card.textKey])}
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
            <Image src={WelcomeIcon} alt={t(Strings.welcome_interface)} width={400} height={300} />
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

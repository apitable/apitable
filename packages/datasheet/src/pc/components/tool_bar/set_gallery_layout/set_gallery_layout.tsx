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

// import * as React from 'react';
import { Slider } from 'antd';
import { useEffect, useRef } from 'react';
import { useThemeColors, useListenVisualHeight, IUseListenTriggerInfo, WrapperTooltip, Switch } from '@apitable/components';
import {
  CollaCommandName,
  ViewType,
  Selectors,
  GalleryStyleKeyType,
  IGalleryViewProperty,
  LayoutType,
  Strings,
  t,
  ISetGalleryStyle,
} from '@apitable/core';
import { AddOutlined, GalleryOutlined, ListOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import ReduceIcon from 'static/icon/common/common_icon_reduce.svg';
import styles from './style.module.less';

const MAX_COLUMN_COUNT = 6;
const MIN_COLUMN_COUNT = 1;

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;
export const SetGalleryLayout = (props: { triggerInfo?: IUseListenTriggerInfo }) => {
  const { triggerInfo } = props;
  const colors = useThemeColors();
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state))! as IGalleryViewProperty;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });
  const isViewLock = useShowViewLockModal();

  const setGalleryStyle = (opt: Omit<ISetGalleryStyle, 'viewId' | 'cmd'>) => {
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetGalleryStyle,
          viewId: activeView.id,
          styleKey: opt.styleKey as any,
          styleValue: opt.styleValue,
        });
      },
      {
        style: {
          ...activeView.style,
          [opt.styleKey]: opt.styleValue,
        },
      },
    );
  };

  const layoutType = activeView && (activeView as IGalleryViewProperty).style.layoutType;

  const reduceCardCount = () => {
    if (isViewLock) return;
    const cardCount = (activeView as IGalleryViewProperty).style.cardCount;
    if (cardCount > 1) {
      setGalleryStyle({
        styleKey: GalleryStyleKeyType.CardCount,
        styleValue: cardCount - 1,
      });
    }
  };

  const addCardCount = () => {
    if (isViewLock) return;
    const cardCount = (activeView as IGalleryViewProperty).style.cardCount;
    if (cardCount < 6) {
      setGalleryStyle({
        styleKey: GalleryStyleKeyType.CardCount,
        styleValue: cardCount + 1,
      });
    }
  };

  const layoutColor = layoutType === LayoutType.Flex ? colors.primaryColor : colors.thirdLevelText;
  const listLayoutColor = layoutType === LayoutType.List ? colors.primaryColor : colors.thirdLevelText;

  useEffect(() => {
    if (activeView?.type === ViewType.Gallery) {
      onListenResize();
    }
  }, [activeView, onListenResize]);

  return (
    <>
      {!activeView || activeView.type !== ViewType.Gallery ? (
        <></>
      ) : (
        <div
          ref={containerRef}
          className={styles.layoutCard}
          onClick={stopPropagation}
          style={{ paddingBottom: activeView.style.isAutoLayout ? 16 : 10, ...style }}
        >
          <span className={styles.title}>{t(Strings.select_layout)}</span>
          <div className={styles.layoutIconWrapper}>
            <div className={styles.iconAndDesc}>
              <GalleryOutlined size={28} color={layoutColor} />
              <span className={styles.title} style={{ color: layoutColor }}>
                {t(Strings.tile)}
              </span>
            </div>

            <div className={styles.iconAndDesc}>
              <Tooltip title={t(Strings.this_feature_is_not_yet_available)} placement="top">
                <span style={{ cursor: 'not-allowed' }}>
                  <ListOutlined size={28} color={listLayoutColor} />
                </span>
              </Tooltip>
              <span className={styles.title} style={{ color: listLayoutColor }}>
                {t(Strings.list)}
              </span>
            </div>
          </div>
          <div className={styles.layoutSize}>
            <span className={styles.title}>{t(Strings.gallery_arrange_mode)}</span>
            <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
              <div className={styles.layoutSizeWrapper}>
                <Switch
                  checked={activeView.style.isAutoLayout}
                  size="small"
                  onChange={(value: boolean) =>
                    setGalleryStyle({
                      styleKey: GalleryStyleKeyType.IsAutoLayout,
                      styleValue: value,
                    })
                  }
                  disabled={isViewLock}
                />
                <span className={styles.title}>{t(Strings.auto)}</span>
              </div>
            </WrapperTooltip>
          </div>
          {!activeView.style.isAutoLayout && (
            <div className={styles.setSliderCount}>
              <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                <span>
                  <ReduceIcon
                    fill={!isViewLock && activeView.style.cardCount > 1 ? colors.primaryColor : colors.thirdLevelText}
                    width={16}
                    height={16}
                    onClick={reduceCardCount}
                    className={styles.reduceCardCountIcon}
                  />
                </span>
              </WrapperTooltip>

              <div style={{ width: '100%' }}>
                <Slider
                  max={MAX_COLUMN_COUNT}
                  min={MIN_COLUMN_COUNT}
                  value={activeView.style.cardCount}
                  disabled={isViewLock}
                  onChange={(value) =>
                    setGalleryStyle({
                      styleKey: GalleryStyleKeyType.CardCount,
                      styleValue: value as number,
                    })
                  }
                />
              </div>
              <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
                <span>
                  <AddOutlined
                    color={!isViewLock && activeView.style.cardCount < 6 ? colors.primaryColor : colors.thirdLevelText}
                    size={16}
                    onClick={addCardCount}
                    className={styles.addCardCountIcon}
                  />
                </span>
              </WrapperTooltip>
            </div>
          )}
        </div>
      )}
    </>
  );
};

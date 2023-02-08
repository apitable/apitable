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
import { useEffect, useRef } from 'react';
import {
  CollaCommandName, ViewType, Selectors,
  GalleryStyleKeyType, IGalleryViewProperty, LayoutType, Strings, t, ISetGalleryStyle,
} from '@apitable/core';
import styles from './style.module.less';
import { stopPropagation } from 'pc/utils';
import { Slider, Switch } from 'antd';
import GalleryIcon from 'static/icon/datasheet/gallery/datasheet_icon_tiling_big.svg';
import GalleryListIcon from 'static/icon/datasheet/gallery/datasheet_icon_list_big.svg';
import ReduceIcon from 'static/icon/common/common_icon_reduce.svg';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import { useThemeColors, useListenVisualHeight, IUseListenTriggerInfo } from '@apitable/components';
import { useSelector } from 'react-redux';
import { Tooltip } from 'pc/components/common';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { resourceService } from 'pc/resource_service';

const MAX_COLUMN_COUNT = 6;
const MIN_COLUMN_COUNT = 1;

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;
export const SetGalleryLayout = (props: { triggerInfo?: IUseListenTriggerInfo }) => {
  const { triggerInfo } = props;
  const colors = useThemeColors();
  const activeView = useSelector(state => Selectors.getCurrentView(state))! as IGalleryViewProperty;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const setGalleryStyle = (opt: Omit<ISetGalleryStyle, 'viewId' | 'cmd'>) => {
    executeCommandWithMirror(() => {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetGalleryStyle,
        viewId: activeView.id,
        styleKey: opt.styleKey as any,
        styleValue: opt.styleValue
      });
    }, {
      style: {
        ...activeView.style,
        [opt.styleKey]: opt.styleValue
      }
    });
  };

  const layoutType = activeView && (activeView as IGalleryViewProperty).style.layoutType;

  const reduceCardCount = () => {
    const cardCount = (activeView as IGalleryViewProperty).style.cardCount;
    if (cardCount > 1) {
      setGalleryStyle({
        styleKey: GalleryStyleKeyType.CardCount,
        styleValue: cardCount - 1,
      });
    }
  };

  const addCardCount = () => {
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
      {
        (!activeView || activeView.type !== ViewType.Gallery) ? <></> :
          <div
            ref={containerRef}
            className={styles.layoutCard}
            onClick={stopPropagation}
            style={{ paddingBottom: activeView.style.isAutoLayout ? 16 : 10, ...style }}
          >
            <span className={styles.title}>{t(Strings.select_layout)}</span>
            <div className={styles.layoutIconWrapper}>
              <div className={styles.iconAndDesc}>
                <GalleryIcon
                  width={28}
                  height={28}
                  fill={layoutColor}
                />
                <span
                  className={styles.title}
                  style={{ color: layoutColor }}
                >
                  {t(Strings.tile)}
                </span>
              </div>

              <div className={styles.iconAndDesc}>
                <Tooltip title={t(Strings.this_feature_is_not_yet_available)} placement="top">
                  <span>
                    <GalleryListIcon
                      width={28}
                      height={28}
                      fill={listLayoutColor}
                      style={{ cursor: 'not-allowed' }}
                    />
                  </span>
                </Tooltip>
                <span
                  className={styles.title}
                  style={{ color: listLayoutColor }}
                >
                  {t(Strings.list)}
                </span>
              </div>

            </div>
            <div className={styles.layoutSize}>
              <span className={styles.title}>{t(Strings.gallery_arrange_mode)}</span>
              <div className={styles.layoutSizeWrapper}>
                <Switch
                  checked={activeView.style.isAutoLayout}
                  size="small"
                  onChange={(value: boolean) => setGalleryStyle({
                    styleKey: GalleryStyleKeyType.IsAutoLayout,
                    styleValue: value,
                  })}
                />
                <span className={styles.title}>{t(Strings.auto)}</span>
              </div>
            </div>
            {
              !activeView.style.isAutoLayout &&
              <div className={styles.setSliderCount}>
                <ReduceIcon
                  fill={activeView.style.cardCount > 1 ? colors.primaryColor : colors.thirdLevelText}
                  width={16}
                  height={16}
                  onClick={reduceCardCount}
                  className={styles.reduceCardCountIcon}
                />
                <div style={{ width: '100%' }}>
                  <Slider
                    max={MAX_COLUMN_COUNT}
                    min={MIN_COLUMN_COUNT}
                    value={activeView.style.cardCount}
                    onChange={value => setGalleryStyle({
                      styleKey: GalleryStyleKeyType.CardCount,
                      styleValue: value as number,
                    })}
                  />
                </div>
                <AddIcon
                  fill={activeView.style.cardCount < 6 ? colors.primaryColor : colors.thirdLevelText}
                  width={16}
                  height={16}
                  onClick={addCardCount}
                  className={styles.addCardCountIcon}
                />
              </div>
            }
          </div>
      }
    </>
  );
};

import { Typography, useThemeColors } from '@vikadata/components';
import { ConfigConstant, IReduxState, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { Avatar, AvatarSize } from 'pc/components/common/avatar';
import { ButtonBase } from 'pc/components/common/button_base/button_base';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Tag } from 'pc/components/common/tag/tag';
import { MyTrigger } from 'pc/components/multi_grid/format/trigger';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import MoreIcon from 'static/icon/common/common_icon_more.svg';
import TemplateIcon from 'static/icon/datasheet/rightclick/template.svg';
import AvatarBgIcon from 'static/icon/template/template_img_cardbg.svg';
import styles from './style.module.less';

enum Types {
  BANNER = 'banner',
  CARD = 'card',
}

const DESC_MAX_LEN = 200;

export interface ITemplateItemProps {
  // 图片url
  img: string;
  // 模板Id
  templateId: string;
  // 图片的高度
  height?: number;
  // 模板名称
  name?: string;
  // 模板描述
  description?: string;
  // banner描述
  bannerDesc?: {
    title: string;
    color?: string;
    desc: string;
  };
  // banner类型
  bannerType?: ConfigConstant.BannerType;
  // 类型
  type?: 'banner' | 'card';
  // 节点类型
  nodeType?: number;
  // 模板标签
  tags?: string[];
  // 作者信息
  creator?: {
    name: string;
    avatar: string;
    userId: string;
  };
  // 是否是官方模板
  isOfficial?: boolean;
  // 删除模板
  deleteTemplate?: (templateId: string) => void;
  // 使用模板
  usingTemplate?: React.Dispatch<React.SetStateAction<string>>;
  onClick?: ({ event, templateId }: { event: React.MouseEvent; templateId: string }) => void;
}

export const TemplateItem: React.FC<ITemplateItemProps> = props => {
  const colors = useThemeColors();
  const {
    img,
    name,
    description,
    templateId,
    creator,
    deleteTemplate,
    usingTemplate,
    nodeType,
    onClick,
    bannerDesc,
    tags,
    height = 160,
    type = Types.BANNER,
    isOfficial = true,
    bannerType = ConfigConstant.BannerType.LARGE,
  } = props;
  // moreBtn菜单是否显示
  const [showPopup, setShowPopup] = useState(false);
  const { user, spaceResource } = useSelector(
    (state: IReduxState) => ({
      user: state.user.info,
      spaceResource: state.spacePermissionManage.spaceResource,
    }),
    shallowEqual,
  );

  const delTemplate = () => {
    setShowPopup(false);
    if (templateId && deleteTemplate) {
      deleteTemplate(templateId);
    }
  };

  const useTemplate = () => {
    setShowPopup(false);
    usingTemplate?.(templateId);
  };

  const isAction = Boolean(usingTemplate || deleteTemplate);

  const convertDescription = (description: string, nodeType?: number): string => {
    if (nodeType === ConfigConstant.NodeType.DATASHEET) {
      return convertDatasheetDesc(description);
    }
    if (nodeType === ConfigConstant.NodeType.FOLDER) {
      return convertFolderDesc(description);
    }
    return description;
  };

  const convertFolderDesc = (description: string): string => {
    const desc = JSON.parse(description);
    let content = '';
    let num = 0;
    if (desc.hasOwnProperty('blocks')) {
      for (const block of desc.blocks) {
        if (block.type === 'paragraph' && num <= DESC_MAX_LEN) {
          if (block.data.text.length + content.length > DESC_MAX_LEN) {
            content += block.data.text.slice(0, DESC_MAX_LEN - num);
            return content;
          }
          content += block.data.text;
          num += block.data.text.length;
        }
      }
    } else if (typeof desc.text === 'string') {
      content = desc.text.slice(0, DESC_MAX_LEN);
    } else if (typeof desc.data === 'string') {
      content = desc.data.replace(/<\/?.+?>/g, '').slice(0, DESC_MAX_LEN);
    }
    return content;
  };

  const convertDatasheetDesc = (description: string): string => {
    const desc = JSON.parse(description);
    let content = '';
    let num = 0;
    if (desc.data && Array.isArray(desc.data.ops)) {
      for (const op of desc.data.ops) {
        if (!op.attributes && num <= DESC_MAX_LEN) {
          if (op.insert.length + content.length > DESC_MAX_LEN) {
            content += op.insert.slice(0, DESC_MAX_LEN - num);
            return content;
          }
          content += op.insert;
          num += op.insert.length;
        }
      }
    } else if (typeof desc.render === 'string') {
      content = desc.render.replace(/<\/?.+?>/g, '').slice(0, DESC_MAX_LEN);
    }
    return content;
  };

  const menu = () => {
    const deletable =
      !isOfficial &&
      (user?.isMainAdmin ||
        spaceResource?.permissions.includes(ConfigConstant.PermissionCode.TEMPLATE) ||
        (creator && creator.userId === user?.uuid));
    return (
      <div className={styles.moreContextMenu}>
        <div className={styles.contextMenuItem} onClick={useTemplate}>
          <TemplateIcon className={styles.icon} />
          <div className={styles.name}>{t(Strings.use_the_template)}</div>
        </div>
        {deletable && (
          <div className={styles.contextMenuItem} onClick={delTemplate}>
            <DeleteIcon className={styles.icon} />
            <div className={styles.name}>{t(Strings.delete)}</div>
          </div>
        )}
      </div>
    );
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleClick = (event: React.MouseEvent) => {
    onClick && onClick({ event, templateId });
  };

  return (
    <div className={classNames(styles.templateItem, { [styles.card]: type == Types.CARD })} onClick={handleClick}>
      {isAction && <div onClick={stopPropagation}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <MyTrigger
            className={styles.moreBtnWrapper}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            popup={menu()}
            popupStyle={{
              width: 240, // 占位
              zIndex: 101,
            }}
            popupAlign={{
              points: ['tl', 'tl'],
              offset: [0, 40],
              overflow: {
                adjustX: true,
                adjustY: true,
              },
            }}
            trigger={<ButtonBase size="x-small" shape="circle" shadow icon={<MoreIcon fill={colors.secondLevelText}/>}
              className={styles.moreBtn}/>}
          />
        </ComponentDisplay>
      </div>}
      <div
        className={classNames(styles.wrapper, {
          [styles.banner]: type === Types.BANNER,
          [styles.mediumBanner]: bannerType === ConfigConstant.BannerType.MIDDLE,
        })}
        style={{ height: `${height}px` }}
      >
        <div
          className={styles.backgroundImage}
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
        {creator && !isOfficial && (
          <>
            <AvatarBgIcon className={styles.avatarBackground} />
            <div className={styles.userAvatar} data-name={creator.name}>
              <Avatar id={creator.userId} src={creator.avatar} title={creator.name} size={AvatarSize.Size32} />
            </div>
          </>
        )}
        {bannerDesc && type === Types.BANNER && (
          <div className={classNames('bannerDesc', styles.bannerDesc)}>
            <div className={classNames('title', styles.title)} style={bannerDesc.color ? { color: bannerDesc.color } : undefined}>
              {bannerDesc.title}
            </div>
            <div className={classNames('desc', styles.desc)} style={bannerDesc.color ? { color: bannerDesc.color } : undefined}>
              {bannerDesc.desc}
            </div>
          </div>
        )}
      </div>
      {type !== Types.BANNER && (
        <div className={styles.templateInfo}>
          <Typography variant="h6" className={styles.name} ellipsis>
            {name}
          </Typography>
          <Typography className={styles.desc} ellipsis={{ rows: 2 }} variant="body3">
            {description && convertDescription(description, nodeType)}
          </Typography>
          {tags && tags.length !== 0 && (
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <Tag key={index} className={styles.tag}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

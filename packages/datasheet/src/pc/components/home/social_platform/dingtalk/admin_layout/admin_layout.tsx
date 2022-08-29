import { LinkButton, Typography, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import Image from 'next/image';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Avatar, AvatarSize, AvatarType, Modal } from 'pc/components/common';
import { FC } from 'react';
import BronzeImg from 'static/icon/space/space_img_bronze.png';
import GradeEnterpriseImg from 'static/icon/space/space_img_enterprise.png';
import SilverImg from 'static/icon/space/space_img_silver.png';
import { Copyright, Header } from '../../ui';
import { AdminChangeModal } from './admin_change_modal';
import { AdminName } from './admin_name';
import styles from './style.module.less';

const LevelConfig = {
  bronze: {
    img: BronzeImg,
    text: t(Strings.bronze_grade)
  },
  silver: {
    img: SilverImg,
    text: t(Strings.silver_grade)
  },
  // 钉钉基础版
  dingtalk_base: {
    img: BronzeImg,
    text: t(Strings.dingtalk_basic)
  },
  // 钉钉标准版（历史字段）
  dingtalk_basic: {
    img: SilverImg,
    text: t(Strings.dingtalk_standard)
  },
  // 钉钉标准版
  dingtalk_standard: {
    img: SilverImg,
    text: t(Strings.dingtalk_standard)
  },
  // 钉钉企业版
  dingtalk_enterprise: {
    img: GradeEnterpriseImg,
    text: t(Strings.dingtalk_enterprise)
  },
  // 飞书基础版
  feishu_base: {
    img: BronzeImg,
    text: t(Strings.feishu_base)
  },
  // 飞书标准版
  feishu_standard: {
    img: SilverImg,
    text: t(Strings.feishu_standard)
  },
  // 飞书企业版
  feishu_enterprise: {
    img: GradeEnterpriseImg,
    text: t(Strings.feishu_enterprise)
  },
  // 企微基础版
  wecom_base: {
    img: BronzeImg,
    text: t(Strings.wecom_base)
  },
  // 企微标准版
  wecom_standard: {
    img: SilverImg,
    text: t(Strings.wecom_standard)
  },
  // 企微企业版
  wecom_enterprise: {
    img: GradeEnterpriseImg,
    text: t(Strings.wecom_enterprise)
  }
};

interface ISpace {
  deadline: string;
  mainAdminUserName: string;
  mainAdminUserAvatar: string;
  product: string;
  spaceId: string;
  spaceName: string;
  spaceLogo: string;
}

export interface IAdminData {
  avatar: string;
  tenantKey: string;
  tenantName: string;
  spaces: ISpace[]
}

interface IAdminLayoutProps {
  data: IAdminData;
  config: {
    adminTitle: string;
    adminDesc: string;
    helpLink: string;
  };
  onChange: (spaceId: string, memberId: string) => void;
}

export const AdminLayout: FC<IAdminLayoutProps> = (props) => {
  const colors = useThemeColors();
  const { data, config, onChange } = props;
  const { tenantKey, tenantName, avatar, spaces } = data;
  const { adminTitle, adminDesc, helpLink } = config;

  const handleSubmit = (spaceId, mainAdminUserName, values) => {
    if (values.length < 0) return;
    const memberId = values[0].memberId;
    const memberName = values[0].originName || values[0].memberName;
    Modal.confirm({
      type: 'warning',
      title: t(Strings.feishu_configure_change_space_master_modal_title),
      className: styles.changeConfirmModal,
      onOk: () => onChange(spaceId, memberId),
      content: (
        <AdminChangeModal
          memberName={memberName}
          spaceId={spaceId}
          mainAdminUserName={mainAdminUserName}
        />
      )
    });
  };

  const onClick = (spaceId, mainAdminUserName, mainAdminUserId) => {
    axios.defaults.headers['X-Space-Id'] =spaceId;
    expandUnitModal({
      source: SelectUnitSource.Admin,
      onSubmit: values => handleSubmit(spaceId, mainAdminUserName, values),
      isSingleSelect: true,
      hiddenInviteBtn: true,
      disableIdList: mainAdminUserId ? [mainAdminUserId] : undefined,
      spaceId,
    });
  };

  const columns = [
    {
      title: t(Strings.space_name),
      dataIndex: 'spaceName',
      key: 'spaceName',
      render: (value, record) =>
        (<span style={{ display: 'flex' }}>
          <Avatar src={record.spaceLogo} size={AvatarSize.Size20} id={record.spaceId} title={value} type={AvatarType.Space} />
          <span style={{ marginLeft:'4px' }}>{value}</span>
        </span>)
    },
    {
      title: t(Strings.main_admin_name),
      dataIndex: 'mainAdminUserName',
      key: 'mainAdminUserName',
      render: (value, record) => <AdminName value={value} {...record} />
    },
    {
      title: t(Strings.space_admin_level),
      dataIndex: 'product',
      key: 'product',
      render: (value) => {
        return (
          <span className={styles.levelWrapper}>
            <span className={styles.level}>
              <Image src={LevelConfig[value.toLowerCase()]?.img} width={24} height={24}/>
            </span>
            {LevelConfig[value.toLowerCase()]?.text}
          </span>
        );
      }
    },
    {
      title: t(Strings.expiration_time_of_space),
      dataIndex: 'deadline',
      key: 'deadline',
      render: (value) => value ? dayjs(value).format('YYYY-MM-DD HH:mm') : t(Strings.EXPIRATION_NO_BILLING_PERIOD)
    },
    {
      title: t(Strings.operate),
      dataIndex: 'product',
      key: 'product',
      render: (value, record) => {
        return (
          <div style={{ display: 'flex' }}>
            <LinkButton
              underline={false}
              style={{ marginRight:'8px' }}
              onClick={() => onClick(record.spaceId, record.mainAdminUserName, record?.mainAdminUserId)}
            >
              {t(Strings.change_main_admin)}
            </LinkButton>
            <LinkButton
              underline={false}
              href={window.location.origin + `/space/${record.spaceId}/workbench`}
              target="_blank"
            >
              {t(Strings.entry_space)}
            </LinkButton>
          </div>
        );
      }
    },
  ];

  return (
    <div className={styles.adminContainer}>
      <div className={styles.scrollWrap}>
        <Header>
          <div className={styles.headerRight}>
            <LinkButton
              underline={false}
              href={window.location.origin + helpLink}
              target="_blank"
              color={colors.defaultBg}
              className={styles.helper}
            >
              {t(Strings.help_center)}
            </LinkButton>
            <Avatar
              src={avatar}
              size={AvatarSize.Size24}
              id={tenantKey}
              title={tenantName}
            />
            <Typography
              className={styles.name}
              variant="body2"
              color={colors.thirdLevelText}
              align="center"
            >
              {tenantName}
            </Typography>
          </div>
        </Header>
        <div className={styles.contentWrap}>
          <div className={styles.content}>
            <div className={styles.titleWrapper}>
              <Typography variant='h3' className={styles.title}>
                {adminTitle}
              </Typography>
              <Typography variant='body2' className={styles.msg}>
                {adminDesc}
              </Typography>
            </div>
            <Table
              dataSource={spaces}
              columns={columns}
              pagination={false}
            />
          </div>
        </div>
        <Copyright />
      </div>
    </div>
  );
};

import {
  Api, ConfigConstant, DEFAULT_TIMEZONE, getLanguage, IMember, IReduxState, MemberType, Strings, SystemConfig, t, UnitItem,
} from '@apitable/core';
// import { DownloadOutlined } from '@vikadata/icons';
import { Audit } from '@apitable/core/src/config/system_config.interface';
import { Button, IconButton } from '@vikadata/components';
import { ReloadOutlined, SearchOutlined } from '@vikadata/icons';
import { useRequest } from 'ahooks';
import { Input, Select as AntSelect, Table, Tag } from 'antd';
import generatePicker from 'antd/es/date-picker/generatePicker';
import classnames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import parser from 'html-react-parser';

import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { getSocialWecomUnitName, isSocialWecom } from 'pc/components/home/social_platform';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { Trial } from 'pc/components/space_manage/log/trial';
import { LocalFormat } from 'pc/components/tool_bar/view_filter/filter_value/filter_date/local_format';

import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import styles from './styles.module.less';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig as any);

interface ILogSearchState {
  dates: [Dayjs | null, Dayjs | null] | null;
  actions: string[];
  keyword: string;
}

interface IAuditGroupOption {
  label: string;
  value: string;
}

interface ILogTablePagination {
  pageNum: number;
  pageSize: number;
}

const auditTypeMapToList = (auditTypeMap: Audit): IAuditGroupOption[] => Object
  .entries(auditTypeMap)
  .filter(([k, v]) => v?.online && v?.show_in_audit_log)
  .sort(([k1, v1], [k2, v2]) => v1?.sort - v2?.sort)
  .map(([k, v]) => ({
    value: k,
    label: t(Strings[v.name]),
  }));

const actionToTemplate = (record) => {
  const auditConfig = SystemConfig.audit[record.action];

  if (!auditConfig) return '';

  switch (auditConfig.name) {
    case SystemConfig.audit.enable_node_share.name:
      return parser(t(Strings.audit_enable_node_share_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.disable_node_share.name:
      return parser(t(Strings.audit_disable_node_share_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.update_node_share_setting.name:
      return parser(t(Strings.audit_update_node_share_setting_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.create_node.name:
      return parser(t(Strings.audit_space_node_create_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.recover_rubbish_node.name:
      return parser(t(Strings.audit_space_rubbish_node_recover_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.rename_node.name:
      return parser(t(Strings.audit_space_node_rename_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        oldNodeName: record.body.node.oldNodeName,
        nodeName: record.body.node.nodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.import_node.name:
      return parser(t(Strings.audit_space_node_import_detail, {
        nodeName: record.body.node.nodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.copy_node.name:
      return parser(t(Strings.audit_space_node_copy_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        sourceNodeName: record.body.node.sourceNodeName,
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.move_node.name:
      return parser(t(Strings.audit_space_node_move_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        parentName: record.body.node.parentName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.delete_node.name:
      return parser(t(Strings.audit_space_node_delete_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.store_share_node.name:
      return parser(t(Strings.audit_store_share_node_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        nodeName: record.body.node.nodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.enable_node_role.name:
      return parser(t(Strings.audit_enable_node_role_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.disable_node_role.name:
      return parser(t(Strings.audit_disable_node_role_detail, {
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.add_node_role.name:
      return parser(t(Strings.audit_add_node_role_detail, {
        role: ConfigConstant.permissionText[record.body.control.role],
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        unitNames: record.body.units?.map(unit => unit.name)?.join(','),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.delete_node_role.name:
      return parser(t(Strings.audit_delete_node_role_detail, {
        role: ConfigConstant.permissionText[record.body.control.oldRole],
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        unitNames: record.body.units?.map(unit => unit.name)?.join(','),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    case SystemConfig.audit.update_node_role.name:
      return parser(t(Strings.audit_update_node_role_detail, {
        role: ConfigConstant.permissionText[record.body.control.role],
        nodeType: ConfigConstant.nodeNameMap.get(record.body.node.nodeType),
        unitNames: record.body.units?.map(unit => unit.name)?.join(','),
        currentNodeName: record.body.node.currentNodeName,
        currentNodeURL: `/workbench/${record.body.node.nodeId}`,
      }));
    default:
      return '';
  }
};

const lang = getLanguage().split('-')[0];

const isMember = (object: any): object is IMember => 'memberId' in object;

const Log = (): JSX.Element => {
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const subscription = useSelector(state => state.billing.subscription, shallowEqual);

  const [state, setState] = useState<ILogSearchState>({
    dates: null,
    actions: [],
    keyword: '',
  });
  const [pagination, setPagination] = useState<ILogTablePagination>({
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<IMember[]>([]);
  const [showTrialModal, setShowTrialModal] = useState<boolean>(!subscription?.maxAuditQueryDays);

  const { run: getSpaceAudit, loading } = useRequest(async() => {
    if (!spaceId) return;

    const res = await Api.getSpaceAudit({
      spaceId,
      actions: state.actions,
      keyword: state.keyword,
      memberIds: selectedMembers.map((member: IMember) => member.memberId),
      beginTime: state.dates?.[0] ? dayjs(state.dates[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: state.dates?.[1] ? dayjs(state.dates[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      pageNo: pagination.pageNum,
      pageSize: pagination.pageSize,
    });

    if (res?.data?.success) {
      setTotal(res.data?.data?.total ?? 0);
      setTableData(res.data?.data?.records?.map(record => ({
        action: record?.action,
        createdAt: record?.createdAt ? dayjs(record.createdAt).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss') : '',
        operator: record?.operator || {},
        body: record?.body || {},
      })) || []);
    }
  }, { manual: true });

  const auditTypeOptions = useMemo(() => auditTypeMapToList(SystemConfig.audit as any), []);
  const isWecomSpace = isSocialWecom(spaceInfo);

  const onOpenMemberModal = () => {
    expandUnitModal({
      checkedList: selectedMembers,
      isSingleSelect: false,
      hiddenInviteBtn: true,
      onSubmit: onMemberSelectDone,
      source: SelectUnitSource.Admin,
      allowEmtpyCheckedList: true,
    });
  };

  const onMemberSelectDone = (values: UnitItem[]) => {
    const members: IMember[] = values.filter(value => isMember(value)) as IMember[];
    setSelectedMembers(members);
  };

  const onPaginationChange = (newPageNum: number, newPageSize: number | undefined) => {
    setPagination({
      pageNum: newPageNum,
      pageSize: newPageSize ?? 0,
    });
  };

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onReset = () => {
    setState({
      dates: null,
      actions: [],
      keyword: '',
    });
    setSelectedMembers([]);
  };

  const resetPaginationAndSearch = () => {
    if (pagination.pageNum === 1) {
      onSearch();
      return;
    }

    setPagination({
      pageSize: 10,
      pageNum: 1,
    });
  };

  const onSearch = () => {
    if (loading) return;

    getSpaceAudit();
  };

  const renderAction = (text, record: any) => actionToTemplate(record);

  const renderMemberNames = (): (string | JSX.Element)[] => {
    if (isWecomSpace) {
      return selectedMembers.map((member: IMember) => getSocialWecomUnitName({
        name: member.originName || member.memberName,
        isModified: member?.isMemberNameModified,
        spaceInfo,
      }));
    }

    return selectedMembers.map(member => member.originName || member.memberName);
  };

  useEffect(() => {
    onSearch();
  }, [pagination.pageNum, pagination.pageSize]); // eslint-disable-line

  useEffect(() => {
    resetPaginationAndSearch();
  }, [selectedMembers, state.dates]); // eslint-disable-line

  if (showTrialModal) {
    return <Trial setShowTrialModal={setShowTrialModal} title={t(Strings.space_log_title)}/>;
  }

  return (
    <div className={styles.logContainer}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          {t(Strings.space_log_title)}
        </h1>
        <span className={styles.spaceLevel}>{t(Strings.enterprise)}</span>
      </div>
      <h2 className={styles.desc}>
        {t(Strings.space_log_trial_desc1, { days: subscription?.maxAuditQueryDays })}
      </h2>
      <div className={styles.logSearchPanelContainer}>
        <div className={styles.item}>
          <span className={styles.label}>{t(Strings.space_log_date_range)}</span>
          <DatePicker.RangePicker
            className={classnames([styles.itemInput, styles.rangePicker])}
            disabledDate={current => current && current > dayjs().endOf('day') || current < dayjs()
              .subtract(subscription?.maxAuditQueryDays || 0, 'day')
              .startOf('day')
            }
            locale={lang === 'en' ? undefined : LocalFormat.getDefinedChineseLocal()}
            onCalendarChange={(dates: [Dayjs | null, Dayjs | null] | null) => setState({ ...state, dates })}
            placeholder={[t(Strings.start_time), t(Strings.end_time)]}
            suffixIcon={null}
            value={state.dates}
          />
        </div>
        <div className={classnames([styles.item, styles.operatorItem])}>
          <span className={styles.label}>{t(Strings.space_log_operator)}</span>
          <div className={styles.operatorRenderer}>
            {renderMemberNames().map((member, i, members) => (
              <span key={i} className={styles.operator}>
                {member}
                {i < members.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
          <AntSelect
            className={classnames([styles.itemSelect, styles.operatorSelect])}
            dropdownMatchSelectWidth
            onClick={onOpenMemberModal}
            open={false}
            showArrow
            showSearch={false}
            size='middle'
            value=''
            virtual={false}
          />
        </div>
        <div className={styles.item}>
          <span className={styles.label}>{t(Strings.space_log_action_type)}</span>
          <AntSelect
            className={classnames([styles.itemSelect])}
            dropdownClassName={styles.selectDropdown}
            maxTagPlaceholder={(value) => `... +${value.length} 条选项`}
            mode='multiple'
            onBlur={resetPaginationAndSearch}
            onChange={(value) => setState({ ...state, actions: value })}
            options={auditTypeOptions}
            showArrow
            showSearch={false}
            size='middle'
            tagRender={({ label, closable, onClose }) => (
              <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                className={styles.selectTag}
              >
                {label}
              </Tag>
            )}
            value={state.actions}
            virtual={false}
          />
        </div>
        <div className={styles.item}>
          <span className={styles.label}>{t(Strings.space_log_file_name)}</span>
          <Input
            value={state.keyword}
            onChange={(e) => setState({ ...state, keyword: e.target.value })}
            onPressEnter={resetPaginationAndSearch}
            className={classnames([styles.itemInput])}
          />
        </div>
        <div className={styles.buttons}>
          <IconButton
            className={styles.reloadButton}
            icon={ReloadOutlined}
            onClick={onReset}
            shape='square'
            variant='background'
          />
          <Button
            color='primary'
            disabled={loading}
            onClick={resetPaginationAndSearch}
            prefixIcon={<SearchOutlined />}
            size='middle'
          >
            {t(Strings.search)}
          </Button>
        </div>
      </div>
      <div className={styles.labelRow}>
        <h6 className={styles.subTitle}>{t(Strings.space_logs)}</h6>
      </div>
      <Table
        className={styles.logTable}
        columns={[{
          title: t(Strings.space_log_action_time),
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'left',
          width: 260,
        },
        {
          title: t(Strings.space_log_operator),
          dataIndex: 'operator',
          key: 'operator',
          align: 'left',
          width: 260,
          render: (value) => <MemberItem
            unitInfo={{
              type: MemberType.Member,
              userId: value?.memberId,
              name: value?.memberName,
              avatar: value?.avatar,
              isActive: value?.isActive,
            }}
          />,
        },
        {
          title: t(Strings.space_log_actions),
          dataIndex: 'action',
          key: 'action',
          align: 'left',
          render: renderAction,
        }]}
        dataSource={tableData}
        loading={loading}
        pagination={{
          position: ['bottomRight'],
          showSizeChanger: false,
          onChange: (newPageNum, newPageSize) => onPaginationChange(newPageNum, newPageSize),
          pageSize: pagination.pageSize,
          current: pagination.pageNum,
          total,
        }}
        rowKey={(record: any) => `${record.createdAt}-${record.operator.memberId}`}
      />
    </div>
  );
};

export default Log;

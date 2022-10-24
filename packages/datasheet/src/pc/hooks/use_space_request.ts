import { Api, ApiInterface, StoreActions, Strings, t } from '@apitable/core';
import { message } from 'antd';
import { Message } from 'pc/components/common';
import { useDispatch } from 'react-redux';

export const useSpaceRequest = () => {
  const dispatch = useDispatch();

  const getSpaceListReq = () => {
    return Api.spaceList().then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
      return null;
    });
  };

  // 空间名称更改（用于在新手引导中修改个人昵称之后，自动更改空间默认名称）
  const changeSpaceNameReq = (name: string) => {
    return Api.updateSpace(name).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.setSpaceInfo({ spaceName: name }));
        // dispatch(StoreActions.updateUserInfo({ spaceName: name }));
      }
    });
  };

  // 申请加入空间
  const applyJoinSpaceReq = (spaceId: string) => {
    return Api.applyJoinSpace(spaceId).then(res => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.apply_join_space_success) });
      } else {
        Message.error({ content: message });
      }
    });
  };

  // 获取空间特性
  const spaceFeaturesReq = () => {
    return Api.getSpaceFeatures().then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
    });
  };

  // 更改权限与安全设置
  const updateSecuritySettingReq = (config: ApiInterface.IUpdateSecuritySetting) => {
    return Api.updateSecuritySetting(config).then(res => {
      const { success } = res.data;
      message.config({
        top: 120,
      });
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      message.config({
        top: 80,
      });
      return res.data;
    });
  };

  // 更改成员设置
  const updateMemberSettingReq = (data: { invitable?: boolean, joinable?: boolean, mobileShowable?: boolean }) => {
    return Api.updateMemberSetting(data).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      return res.data;
    });
  };
  // 更改工作台设置
  const updateWorkbenchSettingReq = (data: { nodeExportable?: boolean, watermarkEnable?: boolean }) => {
    return Api.updateWorkbenchSetting(data).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      return res.data;
    });
  };

  // 判断空间内成员邮箱是否存在
  const checkEmailReq = (email: string) => {
    return Api.isExistEmail(email).then(res => {
      const { success, message, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  return {
    changeSpaceNameReq, getSpaceListReq, applyJoinSpaceReq, spaceFeaturesReq,
    checkEmailReq, updateMemberSettingReq, updateWorkbenchSettingReq, updateSecuritySettingReq
  };
};

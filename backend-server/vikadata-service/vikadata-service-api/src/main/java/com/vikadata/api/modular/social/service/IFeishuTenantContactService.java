package com.vikadata.api.modular.social.service;

import java.util.List;

import com.vikadata.api.modular.social.model.FeishuTenantContact;
import com.vikadata.social.feishu.exception.ContactAccessDeniesException;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.util.MultiValueMap;

/**
 * 飞书企业通讯录服务
 * @author Shawn Deng
 * @date 2022-02-08 18:19:10
 */
public interface IFeishuTenantContactService {

    /**
     * 拉取企业通讯录和组装数据结构
     * @param tenantKey 租户
     * @return MultiValueMap<FeishuDeptObject, FeishuUserObject>
     */
    MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey) throws ContactAccessDeniesException;

    /**
     * 请求租户通讯录
     * @param tenantKey 租户
     * @return FeishuTenantContact
     */
    FeishuTenantContact requestTenantContact(String tenantKey);

    /**
     * 组装租户通讯录结构化数据
     * @param tenantKey 租户
     * @param deptObjects 一级部门列表
     * @param userObjects 一级用户列表
     * @return 结构化数据
     */
    MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey, List<FeishuDeptObject> deptObjects, List<FeishuUserObject> userObjects);
}

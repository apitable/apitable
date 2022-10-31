package com.vikadata.api.modular.social.service;

import java.util.List;

import com.vikadata.api.modular.social.model.FeishuTenantContact;
import com.vikadata.social.feishu.exception.ContactAccessDeniesException;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.util.MultiValueMap;

/**
 * Lark Enterprise Address Book Service
 */
public interface IFeishuTenantContactService {

    /**
     * Pull enterprise address book and assemble data structure
     *
     * @param tenantKey Tenant
     * @return MultiValueMap<FeishuDeptObject, FeishuUserObject>
     */
    MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey) throws ContactAccessDeniesException;

    /**
     * Request tenant address book
     *
     * @param tenantKey Tenant
     * @return FeishuTenantContact
     */
    FeishuTenantContact requestTenantContact(String tenantKey);

    /**
     * Assemble tenant address book structured data
     *
     * @param tenantKey Tenant
     * @param deptObjects List of first level departments
     * @param userObjects First level user list
     * @return Structured data
     */
    MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey, List<FeishuDeptObject> deptObjects, List<FeishuUserObject> userObjects);
}

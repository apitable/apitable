package com.vikadata.api.enterprise.social.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.model.FeishuContactAuthScope;
import com.vikadata.api.enterprise.social.model.FeishuTenantContact;
import com.vikadata.api.enterprise.social.service.IFeishuService;
import com.vikadata.api.enterprise.social.service.IFeishuTenantContactService;
import com.vikadata.social.feishu.exception.ContactAccessDeniesException;
import com.vikadata.social.feishu.model.FeishuContactScope;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;
import com.vikadata.social.feishu.util.DebugUtil;

import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;

/**
 * Lark Enterprise Address Book Service Implementation
 */
@Service
@Slf4j
public class FeishuTenantContactServiceImpl implements IFeishuTenantContactService {

    @Resource
    private IFeishuService iFeishuService;

    @Override
    public MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey) throws ContactAccessDeniesException {
        try {
            FeishuTenantContact contact = requestTenantContact(tenantKey);
            return fetchTenantContact(tenantKey, contact.getDeptObjects(), contact.getUserObjects());
        }
        catch (Exception exception) {
            log.error("No Lark Enterprise Tenant[{}] any address book permission, gray scale test in progress", tenantKey, exception);
            throw new ContactAccessDeniesException();
        }
    }

    @Override
    public FeishuTenantContact requestTenantContact(String tenantKey) {
        // Actively pull the address book
        FeishuContactScope contactScope = iFeishuService.getFeishuTenantContactAuthScope(tenantKey);
        FeishuTenantContact contact = new FeishuTenantContact();
        // The list of authorized users. When all members are visible, the list of users from all top-level departments of the current enterprise is returned
        List<String> authedOpenIds = contactScope.getAuthedOpenIds();
        if (CollUtil.isNotEmpty(authedOpenIds)) {
            List<FeishuUserObject> userObjects = new ArrayList<>();
            authedOpenIds.forEach(openId -> userObjects.add(iFeishuService.getUser(tenantKey, openId)));
            contact.setUserObjects(userObjects);
        }
        // The list of authorized departments. When all employees are visible, the list of all first level departments of the current enterprise is returned
        List<String> authedDepartments = contactScope.getAuthedDepartments();
        if (CollUtil.isNotEmpty(authedDepartments)) {
            List<FeishuDeptObject> deptObjects = new ArrayList<>();
            authedDepartments.forEach(departmentId -> {
                if (departmentId.equals(FEISHU_ROOT_DEPT_ID)) {
                    deptObjects.add(FeishuContactAuthScope.createRootDeptObject());
                }
                else {
                    deptObjects.add(iFeishuService.getDept(tenantKey, departmentId, null));
                }
            });
            contact.setDeptObjects(deptObjects);
        }
        return contact;
    }

    @Override
    public MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContact(String tenantKey, List<FeishuDeptObject> deptObjects, List<FeishuUserObject> userObjects) {
        MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = new LinkedMultiValueMap<>();
        // Traversal department
        if (CollUtil.isNotEmpty(deptObjects)) {
            for (FeishuDeptObject deptObject : deptObjects) {
                // Employees directly under the department
                List<FeishuUserObject> users = fetchUsersByDepartmentId(tenantKey, deptObject.getDepartmentId());
                contactMap.addAll(deptObject, users);
                if (CollUtil.isNotEmpty(userObjects)) {
                    users.forEach(user -> userObjects.removeIf(object -> object.equals(user)));
                }

                // Subsidiary department
                FeishuV3DeptsPager subDeptsPager = iFeishuService.getDeptPager(tenantKey, deptObject.getDepartmentId());
                while (subDeptsPager.hasNext()) {
                    List<FeishuDeptObject> subDepts = subDeptsPager.next();
                    for (FeishuDeptObject subDept : subDepts) {
                        List<FeishuUserObject> subDeptUsers = fetchUsersByDepartmentId(tenantKey, subDept.getDepartmentId());
                        contactMap.addAll(subDept, subDeptUsers);
                        if (CollUtil.isNotEmpty(userObjects)) {
                            subDeptUsers.forEach(user -> userObjects.removeIf(object -> object.equals(user)));
                        }
                    }
                }
            }
        }

        // Duplicated authorized users are excluded. Users without department authorization are all users belonging to the root department
        if (CollUtil.isNotEmpty(userObjects)) {
            FeishuDeptObject rootDeptObject = FeishuContactAuthScope.createRootDeptObject();
            contactMap.addAll(rootDeptObject, userObjects);
        }
        if (log.isDebugEnabled()) {
            DebugUtil.printResult(contactMap);
        }
        return contactMap;
    }

    private List<FeishuUserObject> fetchUsersByDepartmentId(String tenantKey, String departmentId) {
        List<FeishuUserObject> userObjects = new ArrayList<>();
        FeishuV3UsersPager usersPager = iFeishuService.getUserPager(tenantKey, departmentId);
        while (usersPager.hasNext()) {
            List<FeishuUserObject> users = usersPager.next();
            for (FeishuUserObject user : users) {
                if (user.getStatus().isActivated()) {
                    userObjects.add(user);
                }
            }
        }
        return userObjects;
    }

}

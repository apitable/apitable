package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.model.FeishuContactAuthScope;
import com.vikadata.api.modular.social.model.FeishuTenantContact;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.IFeishuTenantContactService;
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
 * 飞书企业通讯录服务实现
 * @author Shawn Deng
 * @date 2022-02-08 18:19:23
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
            log.error("没有飞书企业租户[{}]的任何通讯录权限, 灰度测试中", tenantKey, exception);
            throw new ContactAccessDeniesException();
        }
    }

    @Override
    public FeishuTenantContact requestTenantContact(String tenantKey) {
        // 主动拉取通讯录
        FeishuContactScope contactScope = iFeishuService.getFeishuTenantContactAuthScope(tenantKey);
        FeishuTenantContact contact = new FeishuTenantContact();
        // 授权用户列表，全员可见时返回的是当前企业所有顶级部门用户列表
        List<String> authedOpenIds = contactScope.getAuthedOpenIds();
        if (CollUtil.isNotEmpty(authedOpenIds)) {
            List<FeishuUserObject> userObjects = new ArrayList<>();
            authedOpenIds.forEach(openId -> userObjects.add(iFeishuService.getUser(tenantKey, openId)));
            contact.setUserObjects(userObjects);
        }
        // 授权部门列表，全员可见时返回的是当前企业的所有一级部门列表
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
        // 遍历部门
        if (CollUtil.isNotEmpty(deptObjects)) {
            for (FeishuDeptObject deptObject : deptObjects) {
                // 部门直属员工
                List<FeishuUserObject> users = fetchUsersByDepartmentId(tenantKey, deptObject.getDepartmentId());
                contactMap.addAll(deptObject, users);
                if (CollUtil.isNotEmpty(userObjects)) {
                    users.forEach(user -> userObjects.removeIf(object -> object.equals(user)));
                }

                // 子部门
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

        // 授权用户重复则已经排除，无部门授权的用户都是归属根部门的用户
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

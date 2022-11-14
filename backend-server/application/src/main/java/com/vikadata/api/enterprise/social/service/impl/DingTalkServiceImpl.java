package com.vikadata.api.enterprise.social.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.model.DingTalkContactDTO;
import com.vikadata.api.enterprise.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.enterprise.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.social.dingtalk.DingTalkTemplate;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.config.DingTalkConfigStorage;
import com.vikadata.social.dingtalk.constants.DingTalkConst;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DeptParentResponse;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfo;
import com.vikadata.social.dingtalk.model.UserInfoV2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.social.dingtalk.constants.DingTalkApiConst.SEND_MESSAGE_USER_MAX_COUNT;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.ROOT_DEPARTMENT_ID;

/**
 * DingTalk Integration Service Interface Implementation
 */
@Service
@Slf4j
public class DingTalkServiceImpl implements IDingTalkService {
    /**
     * host/api/v1/bath_path/event/agentId
     */
    public static final String CALLBACK_URL = "{}/api/v1/{}/{}/{}";

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private DingTalkTemplate dingTalkTemplate;

    @Autowired(required = false)
    private DingTalkProperties dingTalkProperties;

    @Override
    public UserInfoV2 getUserInfoByCode(String agentId, String code) {
        return dingTalkTemplate.serviceCorpAppOperations().getUserInfoV2ByCode(agentId, code);
    }

    @Override
    public DingTalkUserDetail getUserDetailByUserId(String agentId, String userId) {
        return dingTalkTemplate.serviceCorpAppOperations().getUserDetailByUserId(agentId, userId);
    }

    @Override
    public DingTalkUserDetail getUserDetailByCode(String agentId, String code) {
        UserInfoV2 userInfo = getUserInfoByCode(agentId, code);
        return dingTalkTemplate.serviceCorpAppOperations().getUserDetailByUserId(agentId, userInfo.getUserid());
    }

    @Override
    public List<Long> getDepartmentSubIdList(String agentId, Long deptId) {
        return dingTalkTemplate.serviceCorpAppOperations().getDepartmentSubIdList(agentId, deptId);
    }

    @Override
    public UserPageResult getUserDetailList(String agentId, Long deptId, Integer cursor, Integer size) {
        return dingTalkTemplate.serviceCorpAppOperations().getUserList(agentId, deptId, cursor, size,
                DingTalkOrderField.CUSTOM, false, DingTalkLanguageType.ZH_CN);
    }

    @Override
    public UserPageResult getRootUserDetailList(String agentId, Integer cursor, Integer size) {
        return getUserDetailList(agentId, 1L, cursor, size);
    }

    @Override
    public List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long deptId) {
        return dingTalkTemplate.serviceCorpAppOperations().getDepartmentSubList(agentId, deptId, DingTalkLanguageType.ZH_CN);
    }

    @Override
    public void registerCallbackUrl(String agentId, String url, List<String> events) {
        try {
            dingTalkTemplate.serviceCorpAppOperations().registerCallbackUrl(agentId, url, events);
        }
        catch (Exception e) {
            log.error("DingTalk failed to register callback address:{}", url, e);
        }
    }

    @Override
    public void deleteCallbackUrl(String agentId) {
        try {
            dingTalkTemplate.serviceCorpAppOperations().deleteCallbackUrl(agentId);
        }
        catch (Exception e) {
            log.error("DingTalk failed to delete callback address:{}", agentId, e);
        }

    }

    @Override
    public List<String> asyncSendCardMessageToUserPrivate(String agentId, Message message, List<String> tenantUserIds) {
        List<String> taskIds = new ArrayList<>();
        try {
            if (tenantUserIds.size() > SEND_MESSAGE_USER_MAX_COUNT) {
                int maxSize = (tenantUserIds.size() + SEND_MESSAGE_USER_MAX_COUNT - 1) / SEND_MESSAGE_USER_MAX_COUNT;
                Stream.iterate(0, n -> n + 1).limit(maxSize).forEach(i -> {
                    List<String> tmpUserIds =
                            tenantUserIds.stream().skip((long) i * SEND_MESSAGE_USER_MAX_COUNT).limit(SEND_MESSAGE_USER_MAX_COUNT).collect(Collectors.toList());
                    try {
                        String taskId = dingTalkTemplate.serviceCorpAppOperations().asyncSendMessageToUser(agentId, message,
                                tmpUserIds);
                        taskIds.add(taskId);
                    }
                    catch (DingTalkApiException e) {
                        log.error("Failed to send DingTalk start notification:agentId={},userIds=[{}]", agentId, tmpUserIds, e);
                    }
                });
            }
            else {
                String taskId = dingTalkTemplate.serviceCorpAppOperations().asyncSendMessageToUser(agentId, message,
                        tenantUserIds);
                taskIds.add(taskId);
            }
        }
        catch (DingTalkApiException exception) {
            log.error("Failed to send DingTalk message", exception);
        }

        return taskIds;
    }

    @Override
    public String getAgentIdByAppIdAndTenantId(String appId, String tenantId) {
        Collection<AgentApp> agentApps = dingTalkTemplate.getDingTalkConfig().getAgentAppStorage().getAllAgentApps();
        for (AgentApp agentApp : agentApps) {
            if (agentApp.getCustomKey().equals(appId) && agentApp.getCorpId().equals(tenantId)) {
                return agentApp.getAgentId();
            }
        }
        return null;
    }

    @Override
    public DingTalkDeptDetail getDeptDetail(String agentId, Long deptId) {
        return getDeptDetail(agentId, deptId, DingTalkLanguageType.ZH_CN);
    }

    @Override
    public DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType languageType) {
        return dingTalkTemplate.serviceCorpAppOperations().getDeptDetail(agentId, deptId, languageType);
    }


    @Override
    public List<String> getDeptUserIdList(String agentId, Long deptId) {
        return dingTalkTemplate.serviceCorpAppOperations().getDeptUserIdList(agentId, deptId);
    }

    @Override
    public DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId) {
        return dingTalkTemplate.serviceCorpAppOperations().getServerAuthInfo(agentId);
    }

    @Override
    public String getTenantIdByAgentId(String agentId) {
        return dingTalkTemplate.getDingTalkConfig().getAgentAppStorage().getAgentApp(agentId).getCorpId();
    }

    @Override
    public DingTalkAppVisibleScopeResponse getAppVisibleScopes(String agentId) {
        return dingTalkTemplate.serviceCorpAppOperations().getAppVisibleScopes(agentId);
    }

    @Override
    public DingTalkUserParentDeptList getUserParentDeptList(String agentId, String userId) {
        return dingTalkTemplate.serviceCorpAppOperations().getParentDeptIdByUser(agentId, userId);
    }

    @Override
    public Integer getAppVisibleUserCount(String agentId) {
        DingTalkAppVisibleScopeResponse visibleScope = getAppVisibleScopes(agentId);
        // Only visible to administrators, get the list of enterprise administrators
        if (visibleScope.getIsHidden()) {
            return dingTalkTemplate.serviceCorpAppOperations().getAdminList(agentId).size();
        }
        if (!visibleScope.getIsHidden()) {
            List<Long> deptVisibleScopes = visibleScope.getDeptVisibleScopes();
            List<String> userVisibleScopes = visibleScope.getUserVisibleScopes();

            // Some employees are visible and not the creator
            if (!deptVisibleScopes.isEmpty()) {
                if (!userVisibleScopes.isEmpty()) {
                    // Department and employee selected
                    Set<String> countUserIds = new HashSet<>(userVisibleScopes);
                    countUserIds.addAll(getNotRepeatDeptUserIds(agentId, deptVisibleScopes));
                    return countUserIds.size();
                }
                else if (!DingTalkConst.ROOT_DEPARTMENT_ID.equals(CollUtil.getFirst(deptVisibleScopes))) {
                    // Only departments are selected
                    return getNotRepeatDeptUserIds(agentId, deptVisibleScopes).size();
                }
                else {
                    // All visible
                    return dingTalkTemplate.serviceCorpAppOperations().getUserCount(agentId, true);
                }
            }
            else {
                // Some users are directly assigned, but no departments are assigned
                if (!visibleScope.getUserVisibleScopes().isEmpty()) {
                    // Only employees are selected
                    return userVisibleScopes.size();
                }
            }
        }
        return 0;
    }

    @Override
    public List<Long> getDeptParentIdList(String agentId, Long deptId) {
        return dingTalkTemplate.serviceCorpAppOperations().getDeptParentIdList(agentId, deptId);
    }

    @Override
    public UserInfo getUserInfoByCode(String tmpAuthCode) {
        if (dingTalkTemplate == null) {
            throw new BusinessException("The DingTalk integration component service is not enabled");
        }
        return dingTalkTemplate.mobileAppOperations().getUserInfoByCode(tmpAuthCode);
    }

    @Override
    public UserInfoV2 getUserInfoV2ByCode(String code) {
        if (dingTalkTemplate == null) {
            throw new BusinessException("The DingTalk integration component service is not enabled");
        }
        return dingTalkTemplate.corpAppOperations().getUserInfoByCode(code);
    }

    @Override
    public DingTalkUserDetail getUserInfoByUserId(String userId) {
        return dingTalkTemplate.corpAppOperations().getUserInfoByUserId(userId);
    }

    @Override
    public AgentApp getAgentAppById(String agentId) {
        DingTalkConfigStorage dingTalkConfigStorage = dingTalkTemplate.getDingTalkConfig().getAgentAppStorage();
        if (dingTalkConfigStorage == null) {
            log.error("DingTalk integration configuration storage mode is not configured");
            return null;
        }
        return dingTalkTemplate.getDingTalkConfig().getAgentAppStorage().getAgentApp(agentId);
    }

    @Override
    public String getVikaDingAppId() {
        if (dingTalkProperties == null) {
            return "";
        }
        return constProperties.getVikaDingTalkAppId();
    }

    @Override
    public DingtalkConfig getDingTalkConfig() {
        if (dingTalkTemplate == null) {
            return null;
        }
        return dingTalkTemplate.getDingTalkConfig();
    }

    @Override
    public String getDingTalkEventCallbackUrl(String agentId) {
        return StrUtil.format(CALLBACK_URL, constProperties.getCallbackDomain(), dingTalkProperties.getBasePath(),
                dingTalkProperties.getEventPath(), agentId);
    }

    @Override
    public List<DingTalkUserDetail> getDeptAllUserDetailList(String agentId, Long deptId) {
        List<DingTalkUserDetail> users = new ArrayList<>();
        boolean hasMoreUser = true;
        int cursor = 0;
        while (hasMoreUser) {
            UserPageResult userPageResult = getUserDetailList(agentId, deptId, cursor, 100);
            if (CollUtil.isNotEmpty(userPageResult.getList())) {
                users.addAll(userPageResult.getList());
            }
            hasMoreUser = userPageResult.getHasMore();
            if (hasMoreUser) {
                cursor = userPageResult.getNextCursor().intValue();
            }
        }
        return users;
    }

    @Override
    public Map<String, DingTalkUserDTO> getUserDetailMap(String agentId, Long deptId) {
        Map<String, DingTalkUserDTO> userMap = new HashMap<>();
        List<DingTalkUserDetail> users = getDeptAllUserDetailList(agentId, deptId);
        users.forEach(user -> userMap.put(user.getUserid(), formatUserDto(user)));
        return userMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getUserDetailSubTreeMapByDeptId(String agentId, Long deptId,
            LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        List<DingTalkDeptBaseInfo> subDeptList = getDepartmentSubList(agentId, deptId);
        for (DingTalkDeptBaseInfo subDept : subDeptList) {
            DingTalkContactDTO contact = new DingTalkContactDTO();
            contact.setUserMap(getUserDetailMap(agentId, subDept.getDeptId()));
            contact.setDepartment(formatDingTalkDepartmentDto(subDept));
            contactMap.put(subDept.getDeptId(), contact);
            getUserDetailSubTreeMapByDeptId(agentId, subDept.getDeptId(), contactMap);
        }
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactSubTreeMapByDeptIds(String agentId, List<Long> deptIds) {
        LinkedHashMap<Long, DingTalkContactDTO> contactMap = new LinkedHashMap<>();
        for (Long deptId : deptIds) {
            // Users under the current department
            DingTalkDeptDetail deptDetail = getDeptDetail(agentId, deptId);
            DingTalkContactDTO contact = new DingTalkContactDTO();
            contact.setDepartment(formatDingTalkDepartmentDto(deptDetail));
            contact.setUserMap(getUserDetailMap(agentId, deptId));
            contactMap.put(deptId, contact);
            // Users under sub departments
            contactMap.putAll(getUserDetailSubTreeMapByDeptId(agentId, deptId, contactMap));
        }
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByDeptIds(String agentId, List<Long> deptIds) {
        LinkedHashMap<Long, DingTalkContactDTO> contactMap = new LinkedHashMap<>();
        for (Long deptId : deptIds) {
            // Processing department level
            if (!ROOT_DEPARTMENT_ID.equals(deptId)) {
                // All parent departments of the processing department, excluding the self, in reverse order, from [1, 2, 3]
                List<Long> parentIds = CollUtil.reverse(CollUtil.removeAny(getDeptParentIdList(agentId, deptId), deptId));
                for (Long parentId : parentIds) {
                    // Filter root department
                    if (!ROOT_DEPARTMENT_ID.equals(parentId)) {
                        DingTalkDeptDetail deptDetail = getDeptDetail(agentId, parentId);
                        DingTalkContactDTO contact = new DingTalkContactDTO();
                        contact.setDepartment(formatDingTalkDepartmentDto(deptDetail));
                        contactMap.put(parentId, contact);
                    }
                }
            }
        }
        // Process sub department and current department
        contactMap.putAll(getContactSubTreeMapByDeptIds(agentId, deptIds));
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByOpenIds(String agentId, List<String> openIds, LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        if (MapUtil.isEmpty(contactMap)) {
            contactMap = new LinkedHashMap<>();
            // Initialize root department
            DingTalkContactDTO contact = new DingTalkContactDTO();
            contact.setDepartment(formatDingTalkDepartmentDto(getDeptDetail(agentId, ROOT_DEPARTMENT_ID)));
            contactMap.put(ROOT_DEPARTMENT_ID, contact);
        }
        for (String openId : openIds) {
            // Synchronize User Tree
            if (constProperties.getDingTalkContactWithTree()) {
                DingTalkUserParentDeptList userParentDeptList = getUserParentDeptList(agentId, openId);
                for (DeptParentResponse value : userParentDeptList.getParentList()) {
                    // Reverse [1456, 123]
                    List<Long> parentIds = CollUtil.reverse(value.getParentDeptIdList());
                    for (Long deptId : parentIds) {
                        if (!contactMap.containsKey(deptId)) {
                            DingTalkContactDTO tmpContact = new DingTalkContactDTO();
                            tmpContact.setDepartment(formatDingTalkDepartmentDto(getDeptDetail(agentId, deptId)));
                            contactMap.put(deptId, tmpContact);
                        }
                    }
                }
            }
            // Processing user information
            DingTalkUserDetail userDetail = getUserDetailByUserId(agentId, openId);
            for (Long deptId : userDetail.getDeptIdList()) {
                DingTalkContactDTO userContact = contactMap.getOrDefault(deptId, contactMap.get(ROOT_DEPARTMENT_ID));
                Map<String, DingTalkUserDTO> userMap = userContact.getUserMap();
                userMap.put(userDetail.getUserid(), formatUserDto(userDetail));
                userContact.setUserMap(userMap);
                contactMap.put(userContact.getDepartment().getDeptId(), userContact);
            }
        }
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMap(String agentId) {
        LinkedHashMap<Long, DingTalkContactDTO> contactMap = new LinkedHashMap<>();
        // Initialize root department
        DingTalkContactDTO contact = new DingTalkContactDTO();
        contact.setDepartment(formatDingTalkDepartmentDto(getDeptDetail(agentId, ROOT_DEPARTMENT_ID)));
        contactMap.put(ROOT_DEPARTMENT_ID, contact);
        // Application visible range
        DingTalkAppVisibleScopeResponse visibleScope = getAppVisibleScopes(agentId);
        // Department ID in visible range
        if (CollUtil.isNotEmpty(visibleScope.getDeptVisibleScopes())) {
            if (constProperties.getDingTalkContactWithTree()) {
                contactMap.putAll(getContactTreeMapByDeptIds(agentId, visibleScope.getDeptVisibleScopes()));
            }
            else {
                contactMap.putAll(getContactSubTreeMapByDeptIds(agentId, visibleScope.getDeptVisibleScopes()));
            }
        }
        if (CollUtil.isNotEmpty(visibleScope.getUserVisibleScopes())) {
            contactMap.putAll(getContactTreeMapByOpenIds(agentId, visibleScope.getUserVisibleScopes(), contactMap));
        }
        return contactMap;
    }

    @Override
    public DingTalkDepartmentDTO formatDingTalkDepartmentDto(DingTalkDeptBaseInfo department) {
        DingTalkDepartmentDTO departmentDto = new DingTalkDepartmentDTO();
        departmentDto.setDeptId(department.getDeptId());
        departmentDto.setDeptName(department.getName());
        departmentDto.setParentDeptId(department.getParentId());
        return departmentDto;
    }

    /**
     * Obtain all user IDs under the department, and the duplicate has been removed
     *
     * @param agentId   App Id
     * @param deptIds   Department Collection Id
     * @return Unique user ID
     */
    private Set<String> getNotRepeatDeptUserIds(String agentId, List<Long> deptIds) {
        Set<String> notRepeatUserIds = new HashSet<>();
        // Synchronize departments, sub departments, and obtain all parent department IDs
        for (Long deptId : deptIds) {
            List<Long> parentIds = getDeptParentIdList(agentId, deptId);
            for (Long parentId : parentIds) {
                notRepeatUserIds.addAll(getDeptUserIdList(agentId, parentId));
            }
        }
        return notRepeatUserIds;
    }

    private DingTalkContactDTO.DingTalkUserDTO formatUserDto(DingTalkUserDetail userDetail) {
        DingTalkContactDTO.DingTalkUserDTO userDto = new DingTalkContactDTO.DingTalkUserDTO();
        userDto.setOpenId(userDetail.getUserid());
        userDto.setUnionId(userDetail.getUnionid());
        userDto.setPosition(userDetail.getTitle());
        userDto.setName(userDetail.getName());
        userDto.setAvatar(StrUtil.blankToDefault(userDetail.getAvatar(), ""));
        userDto.setActive(BooleanUtil.isTrue(userDetail.getActive()));
        userDto.setMobile(userDetail.getMobile());
        userDto.setEmail(userDetail.getEmail());
        return userDto;
    }

}

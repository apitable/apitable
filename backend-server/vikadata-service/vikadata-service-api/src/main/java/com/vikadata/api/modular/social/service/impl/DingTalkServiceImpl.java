package com.vikadata.api.modular.social.service.impl;

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

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties;
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
 * 钉钉集成服务 接口实现
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:29:55
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
            log.error("钉钉注册回调地址失败:{}", url, e);
        }
    }

    @Override
    public void deleteCallbackUrl(String agentId) {
        try {
            dingTalkTemplate.serviceCorpAppOperations().deleteCallbackUrl(agentId);
        }
        catch (Exception e) {
            log.error("钉钉删除回调地址失败:{}", agentId, e);
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
                        log.error("发送钉钉开始使用通知失败:agentId={},userIds=[{}]", agentId, tmpUserIds, e);
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
            log.error("发送钉钉消息失败", exception);
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
        // 仅管理员可见，获取企业管理员列表
        if (visibleScope.getIsHidden()) {
            return dingTalkTemplate.serviceCorpAppOperations().getAdminList(agentId).size();
        }
        if (!visibleScope.getIsHidden()) {
            List<Long> deptVisibleScopes = visibleScope.getDeptVisibleScopes();
            List<String> userVisibleScopes = visibleScope.getUserVisibleScopes();

            // 部分员工可见,并且不是创建人
            if (!deptVisibleScopes.isEmpty()) {
                if (!userVisibleScopes.isEmpty()) {
                    // 选了部门，和员工
                    Set<String> countUserIds = new HashSet<>(userVisibleScopes);
                    countUserIds.addAll(getNotRepeatDeptUserIds(agentId, deptVisibleScopes));
                    return countUserIds.size();
                }
                else if (!DingTalkConst.ROOT_DEPARTMENT_ID.equals(CollUtil.getFirst(deptVisibleScopes))) {
                    // 只选了部门
                    return getNotRepeatDeptUserIds(agentId, deptVisibleScopes).size();
                }
                else {
                    // 全部可见
                    return dingTalkTemplate.serviceCorpAppOperations().getUserCount(agentId, true);
                }
            }
            else {
                // 直接指定了部分用户，未指定部门
                if (!visibleScope.getUserVisibleScopes().isEmpty()) {
                    // 只选了员工
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
            throw new BusinessException("未开启钉钉集成组件服务");
        }
        return dingTalkTemplate.mobileAppOperations().getUserInfoByCode(tmpAuthCode);
    }

    @Override
    public UserInfoV2 getUserInfoV2ByCode(String code) {
        if (dingTalkTemplate == null) {
            throw new BusinessException("未开启钉钉集成组件服务");
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
            log.error("未配置钉钉集成配置存储方式");
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
        Map<String, DingTalkContactDTO.DingTalkUserDTO> userMap = new HashMap<>();
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
            // 当前部门下的用户
            DingTalkDeptDetail deptDetail = getDeptDetail(agentId, deptId);
            DingTalkContactDTO contact = new DingTalkContactDTO();
            contact.setDepartment(formatDingTalkDepartmentDto(deptDetail));
            contact.setUserMap(getUserDetailMap(agentId, deptId));
            contactMap.put(deptId, contact);
            // 子部门下的用户
            contactMap.putAll(getUserDetailSubTreeMapByDeptId(agentId, deptId, contactMap));
        }
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByDeptIds(String agentId, List<Long> deptIds) {
        LinkedHashMap<Long, DingTalkContactDTO> contactMap = new LinkedHashMap<>();
        for (Long deptId : deptIds) {
            // 处理部门层级
            if (!ROOT_DEPARTMENT_ID.equals(deptId)) {
                // 处理部门所有父部门,不包括自己,倒序，从[1, 2, 3]
                List<Long> parentIds = CollUtil.reverse(CollUtil.removeAny(getDeptParentIdList(agentId, deptId), deptId));
                for (Long parentId : parentIds) {
                    // 过滤根部门
                    if (!ROOT_DEPARTMENT_ID.equals(parentId)) {
                        DingTalkDeptDetail deptDetail = getDeptDetail(agentId, parentId);
                        DingTalkContactDTO contact = new DingTalkContactDTO();
                        contact.setDepartment(formatDingTalkDepartmentDto(deptDetail));
                        contactMap.put(parentId, contact);
                    }
                }
            }
        }
        // 处理子部门和当前部门
        contactMap.putAll(getContactSubTreeMapByDeptIds(agentId, deptIds));
        return contactMap;
    }

    @Override
    public LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByOpenIds(String agentId, List<String> openIds, LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        if (MapUtil.isEmpty(contactMap)) {
            contactMap = new LinkedHashMap<>();
            // 初始化根部门
            DingTalkContactDTO contact = new DingTalkContactDTO();
            contact.setDepartment(formatDingTalkDepartmentDto(getDeptDetail(agentId, ROOT_DEPARTMENT_ID)));
            contactMap.put(ROOT_DEPARTMENT_ID, contact);
        }
        for (String openId : openIds) {
            // 同步用户目录树
            if (constProperties.getDingTalkContactWithTree()) {
                DingTalkUserParentDeptList userParentDeptList = getUserParentDeptList(agentId, openId);
                for (DeptParentResponse value : userParentDeptList.getParentList()) {
                    // 倒序 [1，456, 123]
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
            // 处理用户信息
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
        // 初始化根部门
        DingTalkContactDTO contact = new DingTalkContactDTO();
        contact.setDepartment(formatDingTalkDepartmentDto(getDeptDetail(agentId, ROOT_DEPARTMENT_ID)));
        contactMap.put(ROOT_DEPARTMENT_ID, contact);
        // 应用可见范围
        DingTalkAppVisibleScopeResponse visibleScope = getAppVisibleScopes(agentId);
        // 可见范围中有部门ID
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
     * 获取部门下所有的用户Id，已去重
     *
     * @param agentId   应用Id
     * @param deptIds   部门集合Id
     * @return 不重复的用户Id
     * @author Pengap
     * @date 2021/9/8 11:34:55
     */
    private Set<String> getNotRepeatDeptUserIds(String agentId, List<Long> deptIds) {
        Set<String> notRepeatUserIds = new HashSet<>();
        // 同步部门，子部门，获取所有父部门ID
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

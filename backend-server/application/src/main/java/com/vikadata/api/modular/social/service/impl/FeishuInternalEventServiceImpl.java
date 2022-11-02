package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.appstore.service.ILarkAppInstanceConfigService;
import com.vikadata.api.modular.organization.factory.OrganizationFactory;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.event.feishu.FeishuCardFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.model.FeishuContactAuthScope;
import com.vikadata.api.modular.social.service.IFeishuInternalEventService;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.IFeishuTenantContactService;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;
import static com.vikadata.social.feishu.constants.FeishuErrorCode.NO_DEPT_AUTHORITY_ERROR;
import static com.vikadata.social.feishu.event.bot.BaseMessageEvent.GROUP_CHAT_TYPE;
import static com.vikadata.social.feishu.event.bot.BaseMessageEvent.PRIVATE_CHAT_TYPE;

/**
 * Lark Self built Application Event Processing Service
 * Asynchronous processing of Lark event push. The other party requires 200 responses within 1 second. Sometimes the execution time of business code cannot be met
 */
@Service
@Slf4j
public class FeishuInternalEventServiceImpl implements IFeishuInternalEventService {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialFeishuEventLogService iSocialFeishuEventLogService;

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ISocialTenantDepartmentService iSocialTenantDepartmentService;

    @Resource
    private ISocialTenantDepartmentBindService iSocialTenantDepartmentBindService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private ILarkAppInstanceConfigService iLarkAppInstanceConfigService;

    @Resource
    private IFeishuTenantContactService iFeishuTenantContactService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private IRoleMemberService iRoleMemberService;


    @Override
    public void urlCheck(String appInstanceId) {
        log.info("Post processing of event subscription address verification, application instance ID: {}", appInstanceId);
        iLarkAppInstanceConfigService.updateLarkEventCheckStatus(appInstanceId);
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void syncContactFirst(FeishuPassportUserInfo userInfo, AppInstance appInstance) {
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) appInstance.getConfig().getProfile();
        boolean isTenantExist = iSocialTenantService.isTenantExist(userInfo.getTenantKey(), profile.getAppKey());
        if (!isTenantExist) {
            // Create Tenant Record
            iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, profile.getAppKey(), userInfo.getTenantKey(), new JSONObject().toString());
        }
        // Create Tenant Binding
        boolean bindExist = iSocialTenantBindService.checkExistBySpaceIdAndTenantId(profile.getAppKey(), appInstance.getSpaceId(), userInfo.getTenantKey());
        if (!bindExist) {
            iSocialTenantBindService.addTenantBind(profile.getAppKey(), userInfo.getTenantKey(), appInstance.getSpaceId());
        }
        // The user's binding needs to be created in advance to synchronize the address book
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(appInstance.getSpaceId());
        UserHolder.set(mainAdminUserId);
        boolean isExist = iSocialUserBindService.isUnionIdBind(mainAdminUserId, userInfo.getUnionId());
        if (!isExist) {
            iSocialUserBindService.create(mainAdminUserId, userInfo.getUnionId());
        }
        // Switch application context
        FeishuConfigStorage configStorage = profile.buildConfigStorage();
        iFeishuService.switchContextIfAbsent(configStorage);
        // Except for the primary administrator, all departments and members can be cleaned up.
        // The first synchronization of the address book can delete all departments and members, which is not allowed under other circumstances
        Long rootTeamId = iTeamService.getRootTeamId(appInstance.getSpaceId());
        // Delete the invitation link of the space station
        iSpaceInviteLinkService.deleteByTeamId(rootTeamId);
        List<Long> subTeamIds = iTeamService.getAllSubTeamIdsByParentId(rootTeamId);
        iTeamService.deleteTeam(subTeamIds);
        // Query members other than the primary administrator
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(appInstance.getSpaceId());
        List<Long> readyRemovedMemberIds = iMemberService.getMemberIdsBySpaceId(appInstance.getSpaceId());
        readyRemovedMemberIds.removeIf(memberId -> memberId.equals(mainAdminMemberId));
        iMemberService.batchDeleteMemberFromSpace(appInstance.getSpaceId(), readyRemovedMemberIds, false);
        // Remote access to the address book, handle the scope of authorization changes, synchronize departments first, and then synchronize employees
        MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(userInfo.getTenantKey());
        if (contactMap.isEmpty()) {
            // After checking, the range of authorized address book is empty when it is loaded for the first time. By default, we add the user currently scanning the code under the root door
            contactMap.add(FeishuContactAuthScope.createRootDeptObject(), userInfo.createUserObject());
        }
        handleTenantContactData(profile.getAppKey(), appInstance.getSpaceId(), userInfo.getTenantKey(), userInfo.getOpenId(), contactMap);
        // Update the properties of a space
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder()
                .nodeExportable(true).invitable(false)
                .joinable(false).mobileShowable(false).build();
        iSpaceService.switchSpacePros(mainAdminUserId, appInstance.getSpaceId(), feature);
        // Send message card to user
        sendEntryCardToUser(profile.getAppKey(), userInfo.getTenantKey(), userInfo.getOpenId());
        // Update the synchronization status of the application instance
        iLarkAppInstanceConfigService.updateLarkContactSyncStatus(appInstance.getAppInstanceId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleContactScopeChangeEvent(ContactScopeUpdateEvent event) {
        // Switch application instance context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String tenantKey = event.getHeader().getTenantKey();
        String appId = event.getHeader().getAppId();
        boolean isTenantExist = iSocialTenantService.isTenantExist(tenantKey, appId);
        if (!isTenantExist) {
            // Skip if tenant does not exist
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // Remote access to address book
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    // Process the scope of authorization change, synchronize the department first, and then synchronize the employees
                    MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(tenantKey);
                    handleTenantContactData(appId, spaceId, tenantKey, null, contactMap);
                    // Event processing completed
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handling events [%s] fail, resolve it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleTenantContactData(String appId, String spaceId, String tenantKey, String installer, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap) {
        // Query department and department
        SpaceContext spaceContext = new SpaceContext(spaceId);
        // Bound department
        List<SocialTenantDepartmentBindEntity> tenantBindTeamList = iSocialTenantDepartmentBindService.getBindDepartmentList(tenantKey, spaceId);
        Map<String, Long> bindTeamMap = tenantBindTeamList.stream()
                .collect(Collectors.toMap(SocialTenantDepartmentBindEntity::getTenantDepartmentId, SocialTenantDepartmentBindEntity::getTeamId));
        Map<String, Long> deptIdGeneratorMap = generateDeptBindTeamIdIfAbsent(contactMap, bindTeamMap, spaceContext.getRootTeamId());
        List<String> bindDepartmentIdRecords = new ArrayList<>(bindTeamMap.keySet());
        // Bound members, including deleted members
        Map<String, Long> hasBindMemberMap = spaceContext.getMembers().stream()
                .filter(m -> StrUtil.isNotBlank(m.getOpenId()))
                .collect(Collectors.toMap(MemberEntity::getOpenId, MemberEntity::getId));
        // List of existing Open Ids in the space
        List<String> bindOpenIdRecords = new ArrayList<>(hasBindMemberMap.keySet());
        // Assign a member ID to the Open Id of all employees. If there is no ID, create a new one
        Map<String, Long> tenantUserBindMemberIdMap = new HashMap<>(contactMap.values().size());
        contactMap.values().forEach(users ->
                users.forEach(user ->
                        tenantUserBindMemberIdMap.put(user.getOpenId(),
                                hasBindMemberMap.getOrDefault(user.getOpenId(), IdWorker.getId()))));
        // Members of tenants
        List<String> tenantUserOpenIds = iSocialTenantUserService.getOpenIdsByAppIdAndTenantId(appId, tenantKey);
        // Tenant's department
        List<SocialTenantDepartmentEntity> tenantDepartments = iSocialTenantDepartmentService.getByTenantId(tenantKey, spaceId);
        Map<String, Long> tenantDepartmentIdMap = tenantDepartments.stream()
                .collect(Collectors.toMap(SocialTenantDepartmentEntity::getDepartmentId, SocialTenantDepartmentEntity::getId));

        ContactMeta meta = new ContactMeta();
        meta.spaceId = spaceContext.spaceId;

        Map<String, Long> createdOrUpdatedMemberIdMap = new HashMap<>(16);
        // Because employees of Lark enterprises can belong to multiple departments, traversal records are made to prevent multiple updates of members
        List<Long> updatedMemberIds = new ArrayList<>();
        for (Entry<FeishuDeptObject, List<FeishuUserObject>> entry : contactMap.entrySet()) {
            FeishuDeptObject dept = entry.getKey();
            Long teamId = deptIdGeneratorMap.get(dept.getDepartmentId());
            // Processing department
            if (!dept.getDepartmentId().equals(FEISHU_ROOT_DEPT_ID)) {
                // Non root sector
                Long parentTeamId = dept.getParentDepartmentId().equals(FEISHU_ROOT_DEPT_ID) ?
                        spaceContext.getRootTeamId() : deptIdGeneratorMap.getOrDefault(dept.getParentDepartmentId(), spaceContext.getRootTeamId());
                if (bindTeamMap.containsKey(dept.getDepartmentId())) {
                    // Department is bind
                    Long bindId = tenantDepartmentIdMap.get(dept.getDepartmentId());
                    if (bindId == null) {
                        log.error("Bound department [{}] not exit", dept.getDepartmentId());
                        continue;
                    }
                    meta.updateTenantDepartmentEntities.add(SocialTenantDepartmentEntity.builder()
                            .id(bindId).spaceId(meta.spaceId).tenantId(tenantKey)
                            .departmentId(dept.getDepartmentId())
                            .openDepartmentId(dept.getOpenDepartmentId())
                            .parentId(dept.getParentDepartmentId())
                            .departmentName(dept.getName())
                            .departmentOrder(Integer.parseInt(dept.getOrder()))
                            .build());
                    meta.updateTeamEntities.add(TeamEntity.builder()
                            .id(teamId)
                            .parentId(parentTeamId)
                            .teamName(subDeptName(dept.getName()))
                            .sequence(Integer.parseInt(dept.getOrder()))
                            .build());
                    // Delete a member under a department
                    iTeamMemberRelService.removeByTeamId(teamId);
                    // Remove Department Records
                    bindDepartmentIdRecords.remove(dept.getDepartmentId());
                }
                else {
                    // Department not bind
                    if (!tenantDepartmentIdMap.containsKey(dept.getDepartmentId())) {
                        // The tenant department does not exist
                        SocialTenantDepartmentEntity tenantDepartment = SocialFactory.createFeishuTenantDepartment(tenantKey, meta.spaceId, dept);
                        meta.tenantDepartmentEntities.add(tenantDepartment);
                        meta.teamEntities.add(OrganizationFactory.createTeam(meta.spaceId, teamId, parentTeamId, subDeptName(dept.getName()), Integer.parseInt(dept.getOrder())));
                        meta.tenantDepartmentBindEntities.add(SocialFactory.createTenantDepartmentBind(meta.spaceId, teamId, tenantKey, dept.getDepartmentId(), dept.getOpenDepartmentId()));
                    }
                }
            }
            // Members under the processing department
            for (FeishuUserObject user : entry.getValue()) {
                if (!tenantUserOpenIds.contains(user.getOpenId())) {
                    meta.tenantUserEntities.add(SocialFactory.createTenantUser(appId, tenantKey, user.getOpenId(), user.getUnionId()));
                    // Employees can have multiple departments to prevent duplicate employee addition
                    tenantUserOpenIds.add(user.getOpenId());
                }
                if (StrUtil.isNotBlank(installer)) {
                    // The installer synchronizes the address book
                    if (installer.equals(user.getOpenId())) {
                        // Installer: Primary administrator associated employee ID
                        if (!updatedMemberIds.contains(spaceContext.getMainAdminMemberId())) {
                            meta.updateMemberEntities.add(MemberEntity.builder()
                                    .id(spaceContext.getMainAdminMemberId())
                                    .memberName(user.getName())
                                    .position(user.getJobTitle())
                                    .openId(user.getOpenId())
                                    .nameModified(true)
                                    .isPoint(false)
                                    .isActive(true)
                                    .isAdmin(true)
                                    .status(UserSpaceStatus.ACTIVE.getStatus())
                                    .isDeleted(false)
                                    .build());
                            updatedMemberIds.add(spaceContext.getMainAdminMemberId());
                        }
                        bindOpenIdRecords.remove(user.getOpenId());
                        meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, spaceContext.getMainAdminMemberId()));
                    }
                    else {
                        // Non installers: add or modify members
                        Long memberId = tenantUserBindMemberIdMap.get(user.getOpenId());
                        if (hasBindMemberMap.containsKey(user.getOpenId())) {
                            // Modify Members
                            if (!updatedMemberIds.contains(memberId)) {
                                meta.updateMemberEntities.add(MemberEntity.builder()
                                        .id(memberId)
                                        .memberName(user.getName())
                                        .position(user.getJobTitle())
                                        .openId(user.getOpenId())
                                        .nameModified(true)
                                        .isPoint(false)
                                        .isActive(true)
                                        .isAdmin(false)
                                        .status(UserSpaceStatus.ACTIVE.getStatus())
                                        .isDeleted(false)
                                        .build());
                                updatedMemberIds.add(memberId);
                            }
                            bindOpenIdRecords.remove(user.getOpenId());
                        }
                        else {
                            if (!createdOrUpdatedMemberIdMap.containsKey(user.getOpenId())) {
                                // Add Members
                                meta.memberEntities.add(SocialFactory.createFeishuMember(memberId, spaceContext.spaceId,
                                        user.getName(), null, null, user.getJobTitle(),
                                        user.getOpenId(), false));
                                createdOrUpdatedMemberIdMap.put(user.getOpenId(), memberId);
                            }
                        }
                        // Members add associated departments
                        meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, memberId));
                    }
                }
                else {
                    // No installer, just refresh the address book
                    Long memberId = tenantUserBindMemberIdMap.get(user.getOpenId());
                    boolean isMainAdmin = spaceContext.getMainAdminMemberId().equals(memberId);
                    if (hasBindMemberMap.containsKey(user.getOpenId())) {
                        // Modify Members
                        if (!updatedMemberIds.contains(memberId)) {
                            meta.updateMemberEntities.add(MemberEntity.builder()
                                    .id(memberId)
                                    .memberName(user.getName())
                                    .position(user.getJobTitle())
                                    .openId(user.getOpenId())
                                    .nameModified(true)
                                    .isPoint(false)
                                    .isActive(true)
                                    .isAdmin(isMainAdmin)
                                    .status(UserSpaceStatus.ACTIVE.getStatus())
                                    .isDeleted(false)
                                    .build());
                            updatedMemberIds.add(memberId);
                        }
                        bindOpenIdRecords.remove(user.getOpenId());
                    }
                    else {
                        if (!createdOrUpdatedMemberIdMap.containsKey(user.getOpenId())) {
                            // Add Members
                            meta.memberEntities.add(SocialFactory.createFeishuMember(memberId, spaceContext.spaceId,
                                    user.getName(), null, null, user.getJobTitle(),
                                    user.getOpenId(), false));
                            createdOrUpdatedMemberIdMap.put(user.getOpenId(), memberId);
                        }
                    }
                    // Members add associated departments
                    meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, memberId));
                }
            }
        }
        if (StrUtil.isBlank(installer)) {
            // In the case of synchronization of non initial installation, the address book should be refreshed to delete the space members that do not exist this time
            List<Long> removeMemberIds = new ArrayList<>();
            bindOpenIdRecords.forEach(openId -> removeMemberIds.add(hasBindMemberMap.get(openId)));
            iMemberService.batchDeleteMemberFromSpace(spaceId, removeMemberIds, false);
            // At the same time, the department and employee records that do not exist under the tenant should also be deleted
            iSocialTenantUserService.deleteByFeishuOpenIds(appId, tenantKey, new ArrayList<>(bindOpenIdRecords));
            iSocialTenantDepartmentService.deleteBatchByDepartmentId(spaceId, tenantKey, bindDepartmentIdRecords);
        }
        // Save Changes
        meta.doSaveOrUpdate();
    }

    private Map<String, Long> generateDeptBindTeamIdIfAbsent(MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap, Map<String, Long> bindTeamMap, Long rootTeamId) {
        Map<String, Long> deptIdMap = new HashMap<>(contactMap.size());
        for (FeishuDeptObject deptObject : contactMap.keySet()) {
            deptIdMap.computeIfAbsent(deptObject.getDepartmentId(), v -> {
                if (deptObject.getDepartmentId().equals(FEISHU_ROOT_DEPT_ID)) {
                    return rootTeamId;
                }
                else {
                    return bindTeamMap.getOrDefault(deptObject.getDepartmentId(), IdWorker.getId());
                }
            });
        }
        return deptIdMap;
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleUserLeaveEvent(ContactUserDeleteEvent event) {
        // Switch application configuration context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // New version event
                    handleUserLeave(appId, tenantKey, event.getEvent().getUser().getOpenId());
                    // Event processing completed
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handling events [%s] fail, resolve it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    public void handleUserLeave(String appId, String tenantKey, String userOpenId) {
        // Get space ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[User resignation event] Tenant「{}」No space bind", tenantKey);
            return;
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userOpenId);
        if (member != null) {
            // Do not log in with Lark authorization
            iSocialTenantUserService.deleteByTenantIdAndOpenId(appId, tenantKey, userOpenId);
            // Remove member's space
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(member.getId()), false);
        }
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleUserUpdateEvent(ContactUserUpdateEvent event) {
        // Switch application configuration context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // New version event
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    handleUserUpdate(event);
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handing event [%s] fail, resolve it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    private void handleUserUpdate(ContactUserUpdateEvent event) {
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // Get the space ID of the current department
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error(" [User information change event] Tenant「{}」not bind any space", tenantKey);
            return;
        }
        // Changed employee information
        FeishuUserObject userObject = event.getEvent().getUser();
        // Employee information before change
        FeishuUserObject changeProperty = event.getEvent().getChangeProperty();
        if (changeProperty.getStatus() != null && !changeProperty.getStatus().equals(userObject.getStatus())) {
            // The employee status changes in three ways: employee activates the enterprise, employee account is suspended, and employee account is restored
            if (!changeProperty.getStatus().isActivated() && userObject.getStatus().isActivated()) {
                log.info("[User status change] - [Employee activates enterprise]");
                // Add the corresponding space station and modify other properties
                handleUserActive(event.getHeader().getAppId(), tenantKey, spaceId, userObject);
            }
            if (!changeProperty.getStatus().isFrozen() && userObject.getStatus().isFrozen()) {
                log.info("[User status change] - [Suspend employee account]");
                // Kick out of the space station
                handleUserSuspend(tenantKey, spaceId, userObject.getOpenId());
            }
            if (changeProperty.getStatus().isFrozen() && !userObject.getStatus().isFrozen()) {
                log.info("[User status change] - [Restore employee account]");
                // Restore the member and account corresponding to the employee
                handleUserRestore(tenantKey, spaceId, userObject);
            }
        }
        else {
            Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userObject.getOpenId());
            if (memberId != null) {
                // Name change
                if (StrUtil.isNotBlank(changeProperty.getName())) {
                    // Update member information
                    MemberEntity member = new MemberEntity();
                    member.setId(memberId);
                    member.setMemberName(userObject.getName());
                    iMemberService.updateById(member);
                }

                // Department change
                if (CollUtil.isNotEmpty(changeProperty.getDepartmentIds())) {
                    // First delete the original department association
                    iTeamMemberRelService.removeByMemberId(memberId);
                    // Reassociate
                    handleUserDepartmentRelate(tenantKey, spaceId, memberId, userObject.getDepartmentIds());
                }
            }
        }
        // Event processing completed
        iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
    }

    private void handleUserActive(String appId, String tenantKey, String spaceId, FeishuUserObject userObject) {
        // After the employee is employed, click the corresponding enterprise on the client to activate it
        // Tenant user records can only be created when the address book is synchronized. After the employee activates, there should be no space station
        // Create Tenant User Records
        boolean isExistTenantUser = iSocialTenantUserService.isTenantUserUnionIdExist(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        if (!isExistTenantUser) {
            iSocialTenantUserService.create(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userObject.getOpenId());
        if (member == null) {
            // Create Member
            member = SocialFactory.createFeishuMember(IdWorker.getId(), spaceId, userObject.getName(),
                    userObject.getMobile(), userObject.getEmail(), userObject.getJobTitle(),
                    userObject.getOpenId(), false);
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
        }
        else {
            // Update member information
            MemberEntity updateMember = new MemberEntity();
            updateMember.setId(member.getId());
            updateMember.setMemberName(userObject.getName());
            iMemberService.updateById(updateMember);
        }
        // Create Department Association
        handleUserDepartmentRelate(tenantKey, spaceId, member.getId(), userObject.getDepartmentIds());
    }

    private void handleUserSuspend(String tenantKey, String spaceId, String userOpenId) {
        // The administrator suspends the use of this employee account in the enterprise in the background
        // After the suspension, members cannot log in to the enterprise, so it is irrelevant to prohibit logging in
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userOpenId);
        if (memberId == null) {
            log.warn("Lark enterprise[{}] suspended members [{}] not exist", tenantKey, userOpenId);
            return;
        }
        List<Long> memberIds = Collections.singletonList(memberId);
        // Delete a member's associated department
        iTeamMemberRelService.removeByMemberIds(memberIds);
        // delete the associated role
        iRoleMemberService.removeByRoleMemberIds(memberIds);
        // Delete Member
        iMemberService.removeByMemberIds(memberIds);
    }

    private void handleUserRestore(String tenantKey, String spaceId, FeishuUserObject userObject) {
        // The administrator restores this employee account in the background for use in the enterprise
        Long memberId = iMemberService.getMemberIdByOpenIdIgnoreDelete(spaceId, userObject.getOpenId());
        if (memberId == null) {
            log.warn("Lark enterprise [{}] recovered members [{}] not exist", tenantKey, userObject.getOpenId());
            return;
        }
        MemberEntity member = iMemberService.getByIdIgnoreDelete(memberId);
        member.setIsActive(true);
        member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
        member.setIsPoint(true);
        // Member names in the space do not synchronize user names
        member.setNameModified(true);
        // Recover member data
        iMemberService.restoreMember(member);
        // Restore Organization Unit Data
        iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(memberId));
        // Relate departments
        handleUserDepartmentRelate(tenantKey, spaceId, memberId, userObject.getDepartmentIds());
    }

    private void handleUserDepartmentRelate(String tenantKey, String spaceId, Long memberId, List<String> userDepartmentIds) {
        List<TeamMemberRelEntity> entities = new ArrayList<>();
        for (String departmentId : userDepartmentIds) {
            TeamMemberRelEntity dmr = new TeamMemberRelEntity();
            dmr.setId(IdWorker.getId());
            dmr.setMemberId(memberId);
            if (departmentId.equals(FEISHU_ROOT_DEPT_ID)) {
                Long rootTeamId = iTeamService.getRootTeamId(spaceId);
                dmr.setTeamId(rootTeamId);
                entities.add(dmr);
            }
            else {
                Long bindTeamId = compatibleFeishuDept(spaceId, tenantKey, departmentId);
                if (bindTeamId != null) {
                    dmr.setTeamId(bindTeamId);
                    entities.add(dmr);
                }
            }
        }
        iTeamMemberRelService.createBatch(entities);
    }

    private Long compatibleFeishuDept(String spaceId, String tenantKey, String departmentId) {
        if (departmentId.startsWith("od-")) {
            FeishuDeptObject deptObject = getDeptOrNull(tenantKey, departmentId);
            if (deptObject == null) {
                return null;
            }
            return iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, deptObject.getDepartmentId());
        }
        return iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, departmentId);
    }

    private FeishuDeptObject getDeptOrNull(String tenantKey, String openDepartmentId) {
        try {
            return iFeishuService.getDept(tenantKey, null, openDepartmentId);
        }
        catch (FeishuApiException e) {
            if (e.getCode() != NO_DEPT_AUTHORITY_ERROR) {
                throw e;
            }
            return null;
        }
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptCreateEvent(ContactDeptCreateEvent event) {
        // Switch application configuration context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // Get the space ID of the current department
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    if (StrUtil.isBlank(spaceId)) {
                        return;
                    }
                    handleCreateDept(tenantKey, spaceId, event.getEvent().getDepartment());
                    // Event completion
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handling events [%s] fail, solve it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    private void handleCreateDept(String tenantKey, String spaceId, FeishuDeptObject deptObject) {
        FeishuDeptObject parentDeptObject = FeishuContactAuthScope.createRootDeptObject();
        if (StrUtil.isNotBlank(deptObject.getParentDepartmentId()) && !deptObject.getParentDepartmentId().equals(FEISHU_ROOT_DEPT_ID)) {
            if (deptObject.getParentDepartmentId().startsWith("od-")) {
                parentDeptObject = getDeptOrNull(tenantKey, deptObject.getParentDepartmentId());
                if (parentDeptObject == null) {
                    parentDeptObject = FeishuContactAuthScope.createRootDeptObject();
                }
            }
        }
        // The newly added department does not need to be queried in the system, just know what the parent department of the department is in the enterprise tenant
        Long toCreateTeamId = createTeamIfNotExist(tenantKey, spaceId, parentDeptObject.getDepartmentId(), subDeptName(deptObject.getName()), deptObject.getOrder());

        // Add Lark department record
        SocialTenantDepartmentEntity tenantDepartment = new SocialTenantDepartmentEntity();
        tenantDepartment.setId(IdWorker.getId());
        tenantDepartment.setTenantId(tenantKey);
        tenantDepartment.setSpaceId(spaceId);
        tenantDepartment.setDepartmentId(deptObject.getDepartmentId());
        tenantDepartment.setOpenDepartmentId(deptObject.getOpenDepartmentId());
        tenantDepartment.setParentId(parentDeptObject.getDepartmentId());
        tenantDepartment.setParentOpenDepartmentId(parentDeptObject.getOpenDepartmentId());
        tenantDepartment.setDepartmentName(deptObject.getName());
        iSocialTenantDepartmentService.createBatch(Collections.singletonList(tenantDepartment));
        // New Binding
        SocialTenantDepartmentBindEntity tenantDepartmentBind = new SocialTenantDepartmentBindEntity();
        tenantDepartmentBind.setId(IdWorker.getId());
        tenantDepartmentBind.setSpaceId(spaceId);
        tenantDepartmentBind.setTeamId(toCreateTeamId);
        tenantDepartmentBind.setTenantId(tenantKey);
        tenantDepartmentBind.setTenantDepartmentId(deptObject.getDepartmentId());
        tenantDepartmentBind.setTenantOpenDepartmentId(deptObject.getOpenDepartmentId());
        iSocialTenantDepartmentBindService.createBatch(Collections.singletonList(tenantDepartmentBind));
    }

    private Long createTeamIfNotExist(String tenantKey, String spaceId, String parentDepartmentId, String newTeamName, String order) {
        // First level department or not
        if (parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
            // First level department
            Long rootTeamId = iTeamService.getRootTeamId(spaceId);
            // New Department
            TeamEntity team = new TeamEntity();
            team.setId(IdWorker.getId());
            team.setSpaceId(spaceId);
            team.setTeamName(newTeamName);
            team.setSequence(Integer.parseInt(order));
            team.setParentId(rootTeamId);
            iTeamService.batchCreateTeam(spaceId, Collections.singletonList(team));
            return team.getId();
        }
        else {
            // Non primary departments
            // Get the group ID of the parent department ID bind to the space
            Long parentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, parentDepartmentId);
            if (parentTeamId == null) {
                // Superior department does not exist
                parentTeamId = iTeamService.getRootTeamId(spaceId);
            }
            // Create space team
            TeamEntity team = new TeamEntity();
            team.setId(IdWorker.getId());
            team.setSpaceId(spaceId);
            team.setTeamName(newTeamName);
            team.setSequence(Integer.parseInt(order));
            team.setParentId(parentTeamId);
            iTeamService.batchCreateTeam(spaceId, Collections.singletonList(team));
            return team.getId();
        }
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptUpdateEvent(ContactDeptUpdateEvent event) {
        // Switch application configuration context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // Preconditions: Name Modification | Department Level Adjustment (the following employees will be brought in automatically when adjusting.
        // Note that the department adjustment sorting is slightly complicated)
        // Get the space ID of the current department
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[Department information update event] Tenant 「{}」not bind any space", tenantKey);
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    FeishuDeptObject deptObject = event.getEvent().getDepartment();
                    handleUpdateDept(spaceId, tenantKey, deptObject);
                    // Event processing completed
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handling events [%s] fail, resolve it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    private void handleUpdateDept(String spaceId, String tenantKey, FeishuDeptObject deptObject) {
        // Bound department ID
        Long teamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, deptObject.getDepartmentId());
        if (teamId == null) {
            // It does not exist. It may not be authorized by all employees, but partially. Then move in. First, query whether the parent department exists
            FeishuDeptObject parentDeptObject = getDeptOrNull(tenantKey, deptObject.getParentDepartmentId());
            if (parentDeptObject == null) {
                log.warn("[Department information update event] Tenant「{}」department「{}」's superior department [{}] no access", tenantKey, deptObject.getDepartmentId(), deptObject.getParentDepartmentId());
                return;
            }
            Long bindParentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, parentDeptObject.getDepartmentId());
            if (bindParentTeamId == null) {
                log.warn("[Department information update event] Tenant「{}」department「{}」's superior department [{}] not bind", tenantKey, deptObject.getDepartmentId(), deptObject.getParentDepartmentId());
                return;
            }
            // New Department
            TeamEntity team = new TeamEntity();
            team.setId(IdWorker.getId());
            team.setSpaceId(spaceId);
            team.setTeamName(subDeptName(deptObject.getName()));
            team.setSequence(Integer.parseInt(deptObject.getOrder()));
            team.setParentId(bindParentTeamId);
            iTeamService.batchCreateTeam(spaceId, Collections.singletonList(team));

            // Add Lark department record
            SocialTenantDepartmentEntity tenantDepartment = new SocialTenantDepartmentEntity();
            tenantDepartment.setId(IdWorker.getId());
            tenantDepartment.setTenantId(tenantKey);
            tenantDepartment.setSpaceId(spaceId);
            tenantDepartment.setDepartmentId(deptObject.getDepartmentId());
            tenantDepartment.setOpenDepartmentId(deptObject.getOpenDepartmentId());
            tenantDepartment.setParentId(parentDeptObject.getDepartmentId());
            tenantDepartment.setParentOpenDepartmentId(parentDeptObject.getOpenDepartmentId());
            tenantDepartment.setDepartmentName(deptObject.getName());
            iSocialTenantDepartmentService.createBatch(Collections.singletonList(tenantDepartment));
            // New Binding
            SocialTenantDepartmentBindEntity tenantDepartmentBind = new SocialTenantDepartmentBindEntity();
            tenantDepartmentBind.setId(IdWorker.getId());
            tenantDepartmentBind.setSpaceId(spaceId);
            tenantDepartmentBind.setTeamId(team.getId());
            tenantDepartmentBind.setTenantId(tenantKey);
            tenantDepartmentBind.setTenantDepartmentId(deptObject.getDepartmentId());
            tenantDepartmentBind.setTenantOpenDepartmentId(deptObject.getOpenDepartmentId());
            iSocialTenantDepartmentBindService.createBatch(Collections.singletonList(tenantDepartmentBind));
            return;
        }
        TeamEntity team = new TeamEntity();
        team.setId(teamId);
        team.setTeamName(subDeptName(deptObject.getName()));
        team.setSequence(Integer.parseInt(deptObject.getOrder()));
        // Process parent department
        SocialTenantDepartmentEntity tenantDepartment = iSocialTenantDepartmentService.getByDepartmentId(spaceId, tenantKey, deptObject.getDepartmentId());
        String parentDepartmentId = deptObject.getParentDepartmentId();
        if (StrUtil.isNotBlank(parentDepartmentId) && !parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
            // The root door is 0, and the updated superior department is not empty or root department
            // If the parent department id returns the format of open department id, retrieve and overwrite it
            if (parentDepartmentId.startsWith("od-")) {
                FeishuDeptObject parentDept = getDeptOrNull(tenantKey, parentDepartmentId);
                parentDepartmentId = parentDept != null ? parentDept.getDepartmentId() : FEISHU_ROOT_DEPT_ID;
            }
        }
        Long parentTeamId = getParentTeamId(tenantKey, tenantDepartment, parentDepartmentId);
        team.setParentId(parentTeamId);
        iTeamService.updateById(team);

        // Override value of Lark department
        SocialTenantDepartmentEntity updateTenantDepartment = new SocialTenantDepartmentEntity();
        updateTenantDepartment.setId(tenantDepartment.getId());
        updateTenantDepartment.setDepartmentName(deptObject.getName());
        updateTenantDepartment.setParentId(parentDepartmentId);
        iSocialTenantDepartmentService.updateById(updateTenantDepartment);
    }

    private Long getParentTeamId(String tenantKey, SocialTenantDepartmentEntity tenantDepartment, String parentDepartmentId) {
        // Department level adjustment
        if (!tenantDepartment.getParentId().equals(parentDepartmentId)) {
            if (tenantDepartment.getParentId().equals(FEISHU_ROOT_DEPT_ID)) {
                // Previously, it was the lower layer of the root gate
                return iSocialTenantDepartmentBindService.getBindSpaceTeamId(tenantDepartment.getSpaceId(), tenantKey, parentDepartmentId);
            }

            if (parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
                // Now it's the lower layer of the root gate
                return iTeamService.getRootTeamId(tenantDepartment.getSpaceId());
            }
        }
        return null;
    }

    /**
     * Intercept the department name to prevent it from being too long
     *
     * @param deptName Department name
     * @return Name after interception
     */
    private String subDeptName(String deptName) {
        return StrUtil.sub(deptName, 0, 99);
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptDeleteEvent(ContactDeptDeleteEvent event) {
        // Switch application configuration context
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // Get the space ID of the current department
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[Department deletion event] Tenant「{}」not bind space", tenantKey);
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // Ignore the members under the department. The precondition for Lark department deletion is that the members under the department must be deleted
                    // There must be no sub department under the deleted department in Lark, so we don't need to pay attention to the change of the sub department
                    // Delete Tenant Department Record
                    FeishuDeptObject deptObject = event.getEvent().getDepartment();
                    iSocialTenantDepartmentService.deleteTenantDepartment(spaceId, tenantKey, deptObject.getDepartmentId());
                    // Event processing completed
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("Tenant [%s] handling events [%s] fail, resole it quickly", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]Tenant lock operations are too frequent", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    public void handleP2pChatCreateEvent(P2pChatCreateEvent event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // When the user clicks the robot to enter, he/she sends a <Start Using> message card
        sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getUser().getOpenId());
        // Event processing completed
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public void handleAddBotEvent(AddBotEvent event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // Send a message to the group
        sendEntryCardToChatGroup(event.getAppId(), event.getTenantKey(), event.getOpenChatId());
        // Event processing completed
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public <E extends BaseMessageEvent> void handleMessageEvent(E event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        if (event.isMention()) {
            // Mention robots
            if (event.getChatType().equals(PRIVATE_CHAT_TYPE)) {
                // Chat privately and send it to users to see for themselves without sending robots
                sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getOpenId());
            }
            else if (event.getChatType().equals(GROUP_CHAT_TYPE)) {
                // Group chat @ robot, directly sent to the group
                sendEntryCardToChatGroup(event.getAppId(), event.getTenantKey(), event.getOpenChatId());
            }
        }
        else {
            //  Didn't mention it. Only private chat will reply
            if (event.getChatType().equals(PRIVATE_CHAT_TYPE)) {
                // Chat privately and send it to users to see for themselves without sending robots
                sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getOpenId());
            }
        }
        // Event processing completed
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    private void sendEntryCardToUser(String appId, String tenantKey, String userOpenId) {
        try {
            // Send the <Start Using> message card to the user
            Message cardMessage = FeishuCardFactory.createInternalEntryCardMsg(appId);
            String messageId = iFeishuService.sendCardMessageToUserPrivate(tenantKey, userOpenId, cardMessage);
            log.info("Message delivery ID：{}", messageId);
        }
        catch (FeishuApiException exception) {
            // Don't pay attention if you can't send it out. Call the police to find out the reason
            log.error("Failed to send message card to application", exception);
        }
    }

    private void sendEntryCardToChatGroup(String appId, String tenantKey, String chatId) {
        try {
            // Send <Start using> message cards to the group
            Message cardMessage = FeishuCardFactory.createInternalEntryCardMsg(appId);
            String messageId = iFeishuService.sendCardMessageToChatGroup(tenantKey, chatId, cardMessage);
            log.info("Message delivery ID：{}", messageId);
        }
        catch (FeishuApiException exception) {
            // Don't pay attention if you can't send it out. Call the police to find out the reason
            log.error("Failed to send message card to group", exception);
        }
    }

    class ContactMeta {

        String spaceId;

        List<SocialTenantDepartmentEntity> tenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentEntity> updateTenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentBindEntity> tenantDepartmentBindEntities = new ArrayList<>();

        List<SocialTenantUserEntity> tenantUserEntities = new ArrayList<>();

        List<TeamEntity> teamEntities = new ArrayList<>();

        List<TeamEntity> updateTeamEntities = new ArrayList<>();

        List<MemberEntity> memberEntities = new ArrayList<>();

        List<MemberEntity> updateMemberEntities = new ArrayList<>();

        List<TeamMemberRelEntity> teamMemberRelEntities = new ArrayList<>();

        void doSaveOrUpdate() {
            iSocialTenantUserService.createBatch(tenantUserEntities);

            iSocialTenantDepartmentService.createBatch(tenantDepartmentEntities);
            iSocialTenantDepartmentService.updateBatchById(updateTenantDepartmentEntities);

            iSocialTenantDepartmentBindService.createBatch(tenantDepartmentBindEntities);

            iMemberService.batchCreate(spaceId, memberEntities);
            iMemberService.updatePartPropertyBatchByMemberId(spaceId, updateMemberEntities);

            iTeamService.batchCreateTeam(spaceId, teamEntities);
            iTeamService.updateBatchById(updateTeamEntities);
            iTeamMemberRelService.createBatch(teamMemberRelEntities);
        }
    }

    class SpaceContext {

        String spaceId;

        private Long rootTeamId;

        private Long mainAdminMemberId;

        private List<MemberEntity> members;

        public SpaceContext(String spaceId) {
            this.spaceId = spaceId;
        }

        public Long getRootTeamId() {
            if (rootTeamId == null) {
                rootTeamId = iTeamService.getRootTeamId(spaceId);
            }
            return rootTeamId;
        }

        public Long getMainAdminMemberId() {
            if (mainAdminMemberId == null) {
                mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
            }
            return mainAdminMemberId;
        }

        List<MemberEntity> getMembers() {
            if (CollUtil.isEmpty(members)) {
                members = iMemberService.getMembersBySpaceId(spaceId, true);
            }
            return members;
        }
    }
}

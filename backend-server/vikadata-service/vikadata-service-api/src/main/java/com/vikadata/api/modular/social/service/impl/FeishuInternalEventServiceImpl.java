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
 * 飞书自建应用事件处理服务
 * 异步处理飞书事件推送，对方要求1秒内响应200，业务代码执行时长有时无法满足
 * @author Shawn Deng
 * @date 2021-07-22 09:55:57
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
        log.info("事件订阅地址校验后置处理，应用实例ID: {}", appInstanceId);
        iLarkAppInstanceConfigService.updateLarkEventCheckStatus(appInstanceId);
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void syncContactFirst(FeishuPassportUserInfo userInfo, AppInstance appInstance) {
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) appInstance.getConfig().getProfile();
        boolean isTenantExist = iSocialTenantService.isTenantExist(userInfo.getTenantKey(), profile.getAppKey());
        if (!isTenantExist) {
            // 创建租户记录
            iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, profile.getAppKey(), userInfo.getTenantKey(), new JSONObject().toString());
        }
        // 创建租户绑定
        boolean bindExist = iSocialTenantBindService.checkExistBySpaceIdAndTenantId(profile.getAppKey(), appInstance.getSpaceId(), userInfo.getTenantKey());
        if (!bindExist) {
            iSocialTenantBindService.addTenantBind(profile.getAppKey(), userInfo.getTenantKey(), appInstance.getSpaceId());
        }
        // 同步通讯录需要提前创建用户的绑定
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(appInstance.getSpaceId());
        UserHolder.set(mainAdminUserId);
        boolean isExist = iSocialUserBindService.isUnionIdBind(mainAdminUserId, userInfo.getUnionId());
        if (!isExist) {
            iSocialUserBindService.create(mainAdminUserId, userInfo.getUnionId());
        }
        // 切换应用上下文
        FeishuConfigStorage configStorage = profile.buildConfigStorage();
        iFeishuService.switchContextIfAbsent(configStorage);
        // 除了主管理员，清理所有部门和成员，首次同步通讯录可以全部删除部门和成员，其他情况下不允许
        Long rootTeamId = iTeamService.getRootTeamId(appInstance.getSpaceId());
        // 删除空间站的邀请链接
        iSpaceInviteLinkService.deleteByTeamId(rootTeamId);
        List<Long> subTeamIds = iTeamService.getAllSubTeamIdsByParentId(rootTeamId);
        iTeamService.deleteTeam(subTeamIds);
        // 查询除了主管理员以外的成员
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(appInstance.getSpaceId());
        List<Long> readyRemovedMemberIds = iMemberService.getMemberIdsBySpaceId(appInstance.getSpaceId());
        readyRemovedMemberIds.removeIf(memberId -> memberId.equals(mainAdminMemberId));
        iMemberService.batchDeleteMemberFromSpace(appInstance.getSpaceId(), readyRemovedMemberIds, false);
        // 远程拉取通讯录, 处理授权变更范围,先同步部门,再同步员工
        MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(userInfo.getTenantKey());
        if (contactMap.isEmpty()) {
            // 经排查，首次加载，授权通讯录范围是空的，我们默认在根部门下添加当前扫码的用户
            contactMap.add(FeishuContactAuthScope.createRootDeptObject(), userInfo.createUserObject());
        }
        handleTenantContactData(profile.getAppKey(), appInstance.getSpaceId(), userInfo.getTenantKey(), userInfo.getOpenId(), contactMap);
        // 更新空间的属性
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder()
                .nodeExportable(true).invitable(false)
                .joinable(false).mobileShowable(false).build();
        iSpaceService.switchSpacePros(mainAdminUserId, appInstance.getSpaceId(), feature);
        // 发送消息卡片给用户
        sendEntryCardToUser(profile.getAppKey(), userInfo.getTenantKey(), userInfo.getOpenId());
        // 更新应用实例的同步状态
        iLarkAppInstanceConfigService.updateLarkContactSyncStatus(appInstance.getAppInstanceId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleContactScopeChangeEvent(ContactScopeUpdateEvent event) {
        // 切换应用实例上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String tenantKey = event.getHeader().getTenantKey();
        String appId = event.getHeader().getAppId();
        boolean isTenantExist = iSocialTenantService.isTenantExist(tenantKey, appId);
        if (!isTenantExist) {
            // 租户不存在则跳过
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 远程拉取通讯录
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    // 处理授权变更范围,先同步部门，再同步员工
                    MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(tenantKey);
                    handleTenantContactData(appId, spaceId, tenantKey, null, contactMap);
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleTenantContactData(String appId, String spaceId, String tenantKey, String installer, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap) {
        // 查询部门以及部门
        SpaceContext spaceContext = new SpaceContext(spaceId);
        // 已绑定的部门
        List<SocialTenantDepartmentBindEntity> tenantBindTeamList = iSocialTenantDepartmentBindService.getBindDepartmentList(tenantKey, spaceId);
        Map<String, Long> bindTeamMap = tenantBindTeamList.stream()
                .collect(Collectors.toMap(SocialTenantDepartmentBindEntity::getTenantDepartmentId, SocialTenantDepartmentBindEntity::getTeamId));
        Map<String, Long> deptIdGeneratorMap = generateDeptBindTeamIdIfAbsent(contactMap, bindTeamMap, spaceContext.getRootTeamId());
        List<String> bindDepartmentIdRecords = new ArrayList<>(bindTeamMap.keySet());
        // 已绑定的成员,包含已删除的成员
        Map<String, Long> hasBindMemberMap = spaceContext.getMembers().stream()
                .filter(m -> StrUtil.isNotBlank(m.getOpenId()))
                .collect(Collectors.toMap(MemberEntity::getOpenId, MemberEntity::getId));
        // 空间内已存在的OpenId列表
        List<String> bindOpenIdRecords = new ArrayList<>(hasBindMemberMap.keySet());
        // 为所有员工OpenId赋予成员标识ID，如果没有存在的，则新建
        Map<String, Long> tenantUserBindMemberIdMap = new HashMap<>(contactMap.values().size());
        contactMap.values().forEach(users ->
                users.forEach(user ->
                        tenantUserBindMemberIdMap.put(user.getOpenId(),
                                hasBindMemberMap.getOrDefault(user.getOpenId(), IdWorker.getId()))));
        // 租户的成员
        List<String> tenantUserOpenIds = iSocialTenantUserService.getOpenIdsByAppIdAndTenantId(appId, tenantKey);
        // 租户的部门
        List<SocialTenantDepartmentEntity> tenantDepartments = iSocialTenantDepartmentService.getByTenantId(tenantKey, spaceId);
        Map<String, Long> tenantDepartmentIdMap = tenantDepartments.stream()
                .collect(Collectors.toMap(SocialTenantDepartmentEntity::getDepartmentId, SocialTenantDepartmentEntity::getId));

        ContactMeta meta = new ContactMeta();
        meta.spaceId = spaceContext.spaceId;

        Map<String, Long> createdOrUpdatedMemberIdMap = new HashMap<>(16);
        // 因为飞书企业的员工可属于多个部门，遍历记录下来防止多次更新成员
        List<Long> updatedMemberIds = new ArrayList<>();
        for (Entry<FeishuDeptObject, List<FeishuUserObject>> entry : contactMap.entrySet()) {
            FeishuDeptObject dept = entry.getKey();
            Long teamId = deptIdGeneratorMap.get(dept.getDepartmentId());
            // 处理部门
            if (!dept.getDepartmentId().equals(FEISHU_ROOT_DEPT_ID)) {
                // 非根部门
                Long parentTeamId = dept.getParentDepartmentId().equals(FEISHU_ROOT_DEPT_ID) ?
                        spaceContext.getRootTeamId() : deptIdGeneratorMap.getOrDefault(dept.getParentDepartmentId(), spaceContext.getRootTeamId());
                if (bindTeamMap.containsKey(dept.getDepartmentId())) {
                    // 部门已绑定
                    Long bindId = tenantDepartmentIdMap.get(dept.getDepartmentId());
                    if (bindId == null) {
                        log.error("已绑定的部门[{}]不存在", dept.getDepartmentId());
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
                    // 删除部门下的成员
                    iTeamMemberRelService.removeByTeamId(teamId);
                    // 移除部门记录
                    bindDepartmentIdRecords.remove(dept.getDepartmentId());
                }
                else {
                    // 部门未绑定
                    if (!tenantDepartmentIdMap.containsKey(dept.getDepartmentId())) {
                        // 租户部门也不存在
                        SocialTenantDepartmentEntity tenantDepartment = SocialFactory.createFeishuTenantDepartment(tenantKey, meta.spaceId, dept);
                        meta.tenantDepartmentEntities.add(tenantDepartment);
                        meta.teamEntities.add(OrganizationFactory.createTeam(meta.spaceId, teamId, parentTeamId, subDeptName(dept.getName()), Integer.parseInt(dept.getOrder())));
                        meta.tenantDepartmentBindEntities.add(SocialFactory.createTenantDepartmentBind(meta.spaceId, teamId, tenantKey, dept.getDepartmentId(), dept.getOpenDepartmentId()));
                    }
                }
            }
            // 处理部门下的成员
            for (FeishuUserObject user : entry.getValue()) {
                if (!tenantUserOpenIds.contains(user.getOpenId())) {
                    meta.tenantUserEntities.add(SocialFactory.createTenantUser(appId, tenantKey, user.getOpenId(), user.getUnionId()));
                    // 员工可以有多部门，防止出现重复员工添加
                    tenantUserOpenIds.add(user.getOpenId());
                }
                if (StrUtil.isNotBlank(installer)) {
                    // 安装者同步通讯录
                    if (installer.equals(user.getOpenId())) {
                        // 安装者：主管理员关联员工ID
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
                        // 非安装者：添加或修改成员
                        Long memberId = tenantUserBindMemberIdMap.get(user.getOpenId());
                        if (hasBindMemberMap.containsKey(user.getOpenId())) {
                            // 修改成员
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
                                // 添加成员
                                meta.memberEntities.add(SocialFactory.createFeishuMember(memberId, spaceContext.spaceId,
                                        user.getName(), null, null, user.getJobTitle(),
                                        user.getOpenId(), false));
                                createdOrUpdatedMemberIdMap.put(user.getOpenId(), memberId);
                            }
                        }
                        // 成员添加关联部门
                        meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, memberId));
                    }
                }
                else {
                    // 没有安装者，只是刷新通讯录操作
                    Long memberId = tenantUserBindMemberIdMap.get(user.getOpenId());
                    boolean isMainAdmin = spaceContext.getMainAdminMemberId().equals(memberId);
                    if (hasBindMemberMap.containsKey(user.getOpenId())) {
                        // 修改成员
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
                            // 添加成员
                            meta.memberEntities.add(SocialFactory.createFeishuMember(memberId, spaceContext.spaceId,
                                    user.getName(), null, null, user.getJobTitle(),
                                    user.getOpenId(), false));
                            createdOrUpdatedMemberIdMap.put(user.getOpenId(), memberId);
                        }
                    }
                    // 成员添加关联部门
                    meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, memberId));
                }
            }
        }
        if (StrUtil.isBlank(installer)) {
            // 非初次安装同步情况下，刷新通讯录要删除本次不存在的空间成员
            List<Long> removeMemberIds = new ArrayList<>();
            bindOpenIdRecords.forEach(openId -> removeMemberIds.add(hasBindMemberMap.get(openId)));
            iMemberService.batchDeleteMemberFromSpace(spaceId, removeMemberIds, false);
            // 同时也要删除不存在租户下部门和员工记录
            iSocialTenantUserService.deleteByFeishuOpenIds(appId, tenantKey, new ArrayList<>(bindOpenIdRecords));
            iSocialTenantDepartmentService.deleteBatchByDepartmentId(spaceId, tenantKey, bindDepartmentIdRecords);
        }
        // 保存变更
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
        // 切换应用配置上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 新版事件
                    handleUserLeave(appId, tenantKey, event.getEvent().getUser().getOpenId());
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    public void handleUserLeave(String appId, String tenantKey, String userOpenId) {
        // 获取空间ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[用户离职事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userOpenId);
        if (member != null) {
            // 禁止使用飞书授权登录
            iSocialTenantUserService.deleteByTenantIdAndOpenId(appId, tenantKey, userOpenId);
            // 移除成员所在空间
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(member.getId()), false);
        }
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleUserUpdateEvent(ContactUserUpdateEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // 新版事件
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
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    private void handleUserUpdate(ContactUserUpdateEvent event) {
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // 获取当前部门的空间ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error(" [用户信息发生变化事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        // 改变后的员工信息
        FeishuUserObject userObject = event.getEvent().getUser();
        // 改变前的员工信息
        FeishuUserObject changeProperty = event.getEvent().getChangeProperty();
        if (changeProperty.getStatus() != null && !changeProperty.getStatus().equals(userObject.getStatus())) {
            // 员工状态更改，有三种情况：员工激活企业、员工账号被暂停、员工账号被恢复
            if (!changeProperty.getStatus().isActivated() && userObject.getStatus().isActivated()) {
                log.info("[用户状态变更] - [员工激活企业]");
                // 加入对应空间站,并且修改其他属性
                handleUserActive(event.getHeader().getAppId(), tenantKey, spaceId, userObject);
            }
            if (!changeProperty.getStatus().isFrozen() && userObject.getStatus().isFrozen()) {
                log.info("[用户状态变更] - [暂停员工账号]");
                // 踢出空间站
                handleUserSuspend(tenantKey, spaceId, userObject.getOpenId());
            }
            if (changeProperty.getStatus().isFrozen() && !userObject.getStatus().isFrozen()) {
                log.info("[用户状态变更] - [恢复员工账号]");
                // 恢复员工对应的成员以及账户
                handleUserRestore(tenantKey, spaceId, userObject);
            }
        }
        else {
            Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userObject.getOpenId());
            if (memberId != null) {
                // 名称变更
                if (StrUtil.isNotBlank(changeProperty.getName())) {
                    // 更新成员信息
                    MemberEntity member = new MemberEntity();
                    member.setId(memberId);
                    member.setMemberName(userObject.getName());
                    iMemberService.updateById(member);
                }

                // 部门变更
                if (CollUtil.isNotEmpty(changeProperty.getDepartmentIds())) {
                    // 先把原来的部门关联删除掉
                    iTeamMemberRelService.removeByMemberId(memberId);
                    // 重新关联
                    handleUserDepartmentRelate(tenantKey, spaceId, memberId, userObject.getDepartmentIds());
                }
            }
        }
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
    }

    private void handleUserActive(String appId, String tenantKey, String spaceId, FeishuUserObject userObject) {
        // 员工被入职后点击客户端对应企业后激活
        // 只有同步通讯录时候才会创建租户用户记录，员工激活后应该是不存在空间站
        // 创建租户用户记录
        boolean isExistTenantUser = iSocialTenantUserService.isTenantUserUnionIdExist(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        if (!isExistTenantUser) {
            iSocialTenantUserService.create(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userObject.getOpenId());
        if (member == null) {
            // 创建成员
            member = SocialFactory.createFeishuMember(IdWorker.getId(), spaceId, userObject.getName(),
                    userObject.getMobile(), userObject.getEmail(), userObject.getJobTitle(),
                    userObject.getOpenId(), false);
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
        }
        else {
            // 更新成员信息
            MemberEntity updateMember = new MemberEntity();
            updateMember.setId(member.getId());
            updateMember.setMemberName(userObject.getName());
            iMemberService.updateById(updateMember);
        }
        // 创建部门关联
        handleUserDepartmentRelate(tenantKey, spaceId, member.getId(), userObject.getDepartmentIds());
    }

    private void handleUserSuspend(String tenantKey, String spaceId, String userOpenId) {
        // 管理员在后台暂停此员工账号在本企业使用
        // 暂停后，成员也无法登录该企业，所以禁止登录也无关紧要
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userOpenId);
        if (memberId == null) {
            log.warn("飞书企业[{}]暂停的成员[{}]不存在", tenantKey, userOpenId);
            return;
        }
        List<Long> memberIds = Collections.singletonList(memberId);
        // 删除成员关联部门
        iTeamMemberRelService.removeByMemberIds(memberIds);
        // delete the associated role
        iRoleMemberService.removeByRoleMemberIds(memberIds);
        // 删除成员
        iMemberService.removeByMemberIds(memberIds);
    }

    private void handleUserRestore(String tenantKey, String spaceId, FeishuUserObject userObject) {
        // 管理员在后台恢复此员工账号在本企业使用
        Long memberId = iMemberService.getMemberIdByOpenIdIgnoreDelete(spaceId, userObject.getOpenId());
        if (memberId == null) {
            log.warn("飞书企业[{}]恢复的成员[{}]不存在", tenantKey, userObject.getOpenId());
            return;
        }
        MemberEntity member = iMemberService.getByIdIgnoreDelete(memberId);
        member.setIsActive(true);
        member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
        member.setIsPoint(true);
        // 空间内的成员名称不同步用户名称
        member.setNameModified(true);
        // 恢复成员数据
        iMemberService.restoreMember(member);
        // 恢复组织单元数据
        iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(memberId));
        // 重新关联部门
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
        // 切换应用配置上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 获取当前部门所在的空间ID
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    if (StrUtil.isBlank(spaceId)) {
                        return;
                    }
                    handleCreateDept(tenantKey, spaceId, event.getEvent().getDepartment());
                    // 事件完成
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
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
        // 新增的部门无需在系统里查询，只需知道此部门在企业租户的父部门是什么
        Long toCreateTeamId = createTeamIfNotExist(tenantKey, spaceId, parentDeptObject.getDepartmentId(), subDeptName(deptObject.getName()), deptObject.getOrder());

        // 新增飞书部门记录
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
        // 新增绑定
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
        // 是否一级部门
        if (parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
            // 一级部门
            Long rootTeamId = iTeamService.getRootTeamId(spaceId);
            // 新建部门
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
            // 非一级部门
            // 获取父部门ID绑定空间站的小组ID
            Long parentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, parentDepartmentId);
            if (parentTeamId == null) {
                // 上级部门未存在
                parentTeamId = iTeamService.getRootTeamId(spaceId);
            }
            // 创建空间站小组
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
        // 切换应用配置上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // 前提条件：名称修改 ｜ 部门层级调整（调整时会自动将下面的员工带过去,注意部门调整排序略显复杂）
        // 获取当前部门所在的空间ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[部门信息更新事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    FeishuDeptObject deptObject = event.getEvent().getDepartment();
                    handleUpdateDept(spaceId, tenantKey, deptObject);
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    private void handleUpdateDept(String spaceId, String tenantKey, FeishuDeptObject deptObject) {
        // 绑定的部门ID
        Long teamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, deptObject.getDepartmentId());
        if (teamId == null) {
            // 不存在，可能非是全员授权，部分授权，然后挪入，先查询父部门是否存在
            FeishuDeptObject parentDeptObject = getDeptOrNull(tenantKey, deptObject.getParentDepartmentId());
            if (parentDeptObject == null) {
                log.warn("[部门信息更新事件]租户「{}」部门「{}」的上级部门[{}]无权限获取", tenantKey, deptObject.getDepartmentId(), deptObject.getParentDepartmentId());
                return;
            }
            Long bindParentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantKey, parentDeptObject.getDepartmentId());
            if (bindParentTeamId == null) {
                log.warn("[部门信息更新事件]租户「{}」部门「{}」的上级部门[{}]没有绑定", tenantKey, deptObject.getDepartmentId(), deptObject.getParentDepartmentId());
                return;
            }
            // 新建部门
            TeamEntity team = new TeamEntity();
            team.setId(IdWorker.getId());
            team.setSpaceId(spaceId);
            team.setTeamName(subDeptName(deptObject.getName()));
            team.setSequence(Integer.parseInt(deptObject.getOrder()));
            team.setParentId(bindParentTeamId);
            iTeamService.batchCreateTeam(spaceId, Collections.singletonList(team));

            // 新增飞书部门记录
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
            // 新增绑定
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
        // 处理父级部门
        SocialTenantDepartmentEntity tenantDepartment = iSocialTenantDepartmentService.getByDepartmentId(spaceId, tenantKey, deptObject.getDepartmentId());
        String parentDepartmentId = deptObject.getParentDepartmentId();
        if (StrUtil.isNotBlank(parentDepartmentId) && !parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
            // 根部门是0，更新后的上级部门在非空和非根部门的情况下
            // 如果parent-department-id返回的是open-department-id的格式，重新获取并覆盖
            if (parentDepartmentId.startsWith("od-")) {
                FeishuDeptObject parentDept = getDeptOrNull(tenantKey, parentDepartmentId);
                parentDepartmentId = parentDept != null ? parentDept.getDepartmentId() : FEISHU_ROOT_DEPT_ID;
            }
        }
        Long parentTeamId = getParentTeamId(tenantKey, tenantDepartment, parentDepartmentId);
        team.setParentId(parentTeamId);
        iTeamService.updateById(team);

        // 覆盖飞书部门的值
        SocialTenantDepartmentEntity updateTenantDepartment = new SocialTenantDepartmentEntity();
        updateTenantDepartment.setId(tenantDepartment.getId());
        updateTenantDepartment.setDepartmentName(deptObject.getName());
        updateTenantDepartment.setParentId(parentDepartmentId);
        iSocialTenantDepartmentService.updateById(updateTenantDepartment);
    }

    private Long getParentTeamId(String tenantKey, SocialTenantDepartmentEntity tenantDepartment, String parentDepartmentId) {
        // 部门层级调整
        if (!tenantDepartment.getParentId().equals(parentDepartmentId)) {
            if (tenantDepartment.getParentId().equals(FEISHU_ROOT_DEPT_ID)) {
                // 以前是根部门下层
                return iSocialTenantDepartmentBindService.getBindSpaceTeamId(tenantDepartment.getSpaceId(), tenantKey, parentDepartmentId);
            }

            if (parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
                // 现在是根部门下层
                return iTeamService.getRootTeamId(tenantDepartment.getSpaceId());
            }
        }
        return null;
    }

    /**
     * 截取部门名称，防止过长
     * @param deptName 部门名称
     * @return 截取后的名称
     */
    private String subDeptName(String deptName) {
        return StrUtil.sub(deptName, 0, 99);
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptDeleteEvent(ContactDeptDeleteEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        String appId = event.getHeader().getAppId();
        String tenantKey = event.getHeader().getTenantKey();
        // 获取当前部门所在的空间ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[部门删除事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 不用理会部门下面的成员，飞书部门的删除前提条件是必须删除部门下面的成员才能删除
                    // 飞书上被删除的部门下面必须不存在子部门，所以也不用理会子部门的变更
                    // 删除租户部门记录
                    FeishuDeptObject deptObject = event.getEvent().getDepartment();
                    iSocialTenantDepartmentService.deleteTenantDepartment(spaceId, tenantKey, deptObject.getDepartmentId());
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getHeader().getEventType()), e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
        }
        catch (InterruptedException e) {
            log.error("[" + tenantKey + "]租户锁操作太频繁", e);
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    public void handleP2pChatCreateEvent(P2pChatCreateEvent event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // 用户点击机器人进入时，发送<开始使用>消息卡片
        sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getUser().getOpenId());
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public void handleAddBotEvent(AddBotEvent event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        // 发送消息到群里
        sendEntryCardToChatGroup(event.getAppId(), event.getTenantKey(), event.getOpenChatId());
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public <E extends BaseMessageEvent> void handleMessageEvent(E event) {
        iFeishuService.switchContextIfAbsent(iAppInstanceService.buildConfigStorageByInstanceId(event.getAppInstanceId()));
        if (event.isMention()) {
            // 提及到机器人
            if (event.getChatType().equals(PRIVATE_CHAT_TYPE)) {
                // 私聊消息, 发给用户自己看，不发机器人群
                sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getOpenId());
            }
            else if (event.getChatType().equals(GROUP_CHAT_TYPE)) {
                // 群聊里@机器人，直接发到群组
                sendEntryCardToChatGroup(event.getAppId(), event.getTenantKey(), event.getOpenChatId());
            }
        }
        else {
            //  未提及到，只有私聊才会回复
            if (event.getChatType().equals(PRIVATE_CHAT_TYPE)) {
                // 私聊消息, 发给用户自己看，不发机器人群
                sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getOpenId());
            }
        }
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    private void sendEntryCardToUser(String appId, String tenantKey, String userOpenId) {
        try {
            // 发送<开始使用>消息卡片给用户
            Message cardMessage = FeishuCardFactory.createInternalEntryCardMsg(appId);
            String messageId = iFeishuService.sendCardMessageToUserPrivate(tenantKey, userOpenId, cardMessage);
            log.info("消息送达ID：{}", messageId);
        }
        catch (FeishuApiException exception) {
            // 发不出去不用理会,报个警查一下原因
            log.error("发送消息卡片到应用里失败", exception);
        }
    }

    private void sendEntryCardToChatGroup(String appId, String tenantKey, String chatId) {
        try {
            // 发送<开始使用>消息卡片到群里
            Message cardMessage = FeishuCardFactory.createInternalEntryCardMsg(appId);
            String messageId = iFeishuService.sendCardMessageToChatGroup(tenantKey, chatId, cardMessage);
            log.info("消息送达ID：{}", messageId);
        }
        catch (FeishuApiException exception) {
            // 发不出去不用理会,报个警查一下原因
            log.error("发送消息卡片到群里失败", exception);
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

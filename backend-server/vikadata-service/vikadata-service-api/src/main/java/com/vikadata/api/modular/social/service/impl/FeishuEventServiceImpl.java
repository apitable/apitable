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
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.finance.service.ISocialFeishuOrderService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
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
import com.vikadata.api.modular.social.service.IFeishuEventService;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.IFeishuTenantContactService;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.billing.LarkPlanConfigManager;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.event.UserInfo;
import com.vikadata.social.feishu.event.app.AppOpenEvent;
import com.vikadata.social.feishu.event.app.AppStatusChangeEvent;
import com.vikadata.social.feishu.event.app.AppUninstalledEvent;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;
import com.vikadata.social.feishu.exception.ContactAccessDeniesException;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuAdminUserList;
import com.vikadata.social.feishu.model.FeishuAdminUserList.Admin;
import com.vikadata.social.feishu.model.FeishuTenantInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.system.config.billing.Price;

import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;
import static com.vikadata.social.feishu.constants.FeishuErrorCode.GET_TENANT_DENIED;
import static com.vikadata.social.feishu.constants.FeishuErrorCode.NO_DEPT_AUTHORITY_ERROR;
import static com.vikadata.social.feishu.event.bot.BaseMessageEvent.GROUP_CHAT_TYPE;
import static com.vikadata.social.feishu.event.bot.BaseMessageEvent.PRIVATE_CHAT_TYPE;

/**
 * 飞书事件处理服务 实现(2.0)
 * 异步处理飞书事件推送，对方要求1秒内响应200，业务代码执行时长有时无法满足
 * @author Shawn Deng
 * @date 2021-07-22 09:55:57
 */
@Service
@Slf4j
public class FeishuEventServiceImpl implements IFeishuEventService {

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
    private INodeService iNodeService;

    @Resource
    private ITemplateService iTemplateService;

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
    private IUnitService iUnitService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private IFeishuTenantContactService iFeishuTenantContactService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private ISocialFeishuOrderService iSocialFeishuOrderService;

    @Resource
    private IRoleMemberService iRoleMemberService;


    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleAppOpenEvent(AppOpenEvent event) {
        // 只有商店应用会使用，应用上下文必定有
        String appId = event.getAppId();
        String tenantKey = event.getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 保险起见，检查一下
                    boolean isTenantExist = iSocialTenantService.isTenantExist(tenantKey, appId);
                    if (!isTenantExist) {
                        // 租户不存在则创建
                        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, event.getAppId(), tenantKey, new JSONObject().toString());
                    }
                    else {
                        // 已存在则更新租户
                        iSocialTenantService.updateTenantStatus(appId, tenantKey, true);
                    }
                    iFeishuService.switchDefaultContext();
                    UserInfo installer = getAppInstaller(event);
                    // 同步通讯录
                    syncTenantContact(appId, tenantKey, installer);
                    // 处理未绑定空间的订阅信息
                    handleTenantOrders(tenantKey, appId);
                    // 同步完成后，发送通知
                    if (installer != null && StrUtil.isNotBlank(installer.getOpenId())) {
                        log.info("[飞书] 安装者：{}", installer.getOpenId());
                        // 发送消息卡片
                        sendEntryCardToUser(appId, event.getTenantKey(), event.getInstaller().getOpenId());
                    }
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getType()), e);
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

    private UserInfo getAppInstaller(AppOpenEvent event) {
        if (CollUtil.isNotEmpty(event.getApplicants())) {
            // 普通成员申请安装应用时，优先返回此申请者
            return CollUtil.getFirst(event.getApplicants());
        }
        else if (event.getInstaller() != null && StrUtil.isNotBlank(event.getInstaller().getOpenId())) {
            // 没有申请者安装时，管理员安装，安装者信息优先返回
            return event.getInstaller();
        }
        else if (event.getInstallerEmployee() != null && StrUtil.isNotBlank(event.getInstallerEmployee().getOpenId())) {
            // 没发现会出现此字段
            return event.getInstallerEmployee();
        }
        else {
            log.error("应用开通事件[{}]没有任何操作者", event.getMeta().getUuid());
            return null;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleAppStopEvent(AppStatusChangeEvent event) {
        // 停用不删已绑定的空间
        iSocialTenantService.stopByTenant(event.getAppId(), event.getTenantKey());
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleAppRestartEvent(AppStatusChangeEvent event) {
        // 只有商店应用会使用，应用上下文必定有
        String appId = event.getAppId();
        String tenantKey = event.getTenantKey();
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 重新开启 保险起见，检查一下
                    boolean isTenantExist = iSocialTenantService.isTenantExist(tenantKey, appId);
                    if (!isTenantExist) {
                        // 租户不存在则创建
                        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, event.getAppId(), tenantKey, new JSONObject().toString());
                    }
                    else {
                        // 已存在则更新租户
                        iSocialTenantService.updateTenantStatus(appId, tenantKey, true);
                    }
                    iFeishuService.switchDefaultContext();
                    // 处理授权变更范围,先同步部门,再同步员工
                    MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = fetchTenantContactIfFail(tenantKey, event.getOperator());
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    handleTenantContactData(appId, tenantKey, spaceId, contactMap);
                    if (StrUtil.isNotBlank(event.getOperator().getOpenId())) {
                        // 发送消息卡片
                        sendEntryCardToUser(appId, event.getTenantKey(), event.getOperator().getOpenId());
                    }
                    // 事件处理完成
                    iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
                }
                catch (Exception e) {
                    log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", tenantKey, event.getType()), e);
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
    public void handleAppUninstalledEvent(AppUninstalledEvent event) {
        // 卸载也需要移除
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getAppId(), event.getTenantKey());
        if (StrUtil.isNotBlank(spaceId)) {
            iSocialTenantService.removeTenant(event.getAppId(), event.getTenantKey(), spaceId);
        }
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleContactScopeChangeEvent(ContactScopeUpdateEvent event) {
        // 通讯录授权范围变更
        iFeishuService.switchDefaultContext();
        String tenantKey = event.getHeader().getTenantKey();
        String appId = event.getHeader().getAppId();
        boolean isTenantExist = iSocialTenantService.isTenantExist(tenantKey, appId);
        if (!isTenantExist) {
            // 租户由开通时创建，这里只会通讯录刷新,故跳过
            return;
        }
        String lockKey = StrUtil.join("-", appId, tenantKey);
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 远程拉取通讯录
                    MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(tenantKey);
                    String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
                    // 处理授权变更范围,先同步部门，再同步员工
                    handleTenantContactData(appId, tenantKey, spaceId, contactMap);
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

    private MultiValueMap<FeishuDeptObject, FeishuUserObject> fetchTenantContactIfFail(String tenantKey,
            UserInfo installer) {
        // 如果企业通讯录都没有权限，尝试获取安装者基本信息，并归入根部门下
        try {
            MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(tenantKey);
            if (contactMap.isEmpty()) {
                if (installer != null) {
                    contactMap.add(FeishuContactAuthScope.createRootDeptObject(), SocialFactory.createDefaultLarkUser(installer));
                }
            }
            return contactMap;
        }
        catch (ContactAccessDeniesException exception) {
            MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = new LinkedMultiValueMap<>();
            // 没有通讯录权限,返回默认安装者信息
            if (installer == null) {
                return contactMap;
            }
            if (StrUtil.isBlank(installer.getOpenId())) {
                return contactMap;
            }
            FeishuUserObject userObject;
            try {
                userObject = iFeishuService.getUser(tenantKey, installer.getOpenId());
            }
            catch (Exception ex) {
                log.error("飞书企业租户[{}]通讯录无权限，安装者[{}]也无法获取，返回默认的用户", tenantKey, installer.getOpenId());
                userObject = SocialFactory.createDefaultLarkUser(installer);
            }
            contactMap.add(FeishuContactAuthScope.createRootDeptObject(), userObject);
            return contactMap;
        }
    }

    /**
     * 同步企业通讯录并创建空间站
     * @param tenantKey 租户标识
     */
    private SpaceContext syncTenantContact(String appId, String tenantKey, UserInfo installer) {
        // 处理授权变更范围,先同步部门,再同步员工
        MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = fetchTenantContactIfFail(tenantKey, installer);
        // 远程拉取通讯录
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        return handleTenantContactData(appId, tenantKey, spaceId, contactMap);
    }

    /**
     * 同步和更新租户通讯录结构到空间站
     * 如果空间站不存在，则创建一个
     * @param appId 应用ID
     * @param tenantKey 租户标识
     * @param spaceId 空间ID
     * @param contactMap 租户通讯录结构
     * @return 创建好的空间上下文
     */
    @Override
    public SpaceContext handleTenantContactData(String appId, String tenantKey, String spaceId, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap) {
        // 查询部门以及部门
        SpaceContext spaceContext = new SpaceContext(spaceId);
        spaceContext.prepare(tenantKey);
        // 根部门
        Long rootTeamId = spaceContext.rootTeamId;
        // 已绑定的部门
        List<SocialTenantDepartmentBindEntity> tenantBindTeamList = iSocialTenantDepartmentBindService.getBindDepartmentList(tenantKey, spaceId);
        Map<String, Long> bindTeamMap = tenantBindTeamList.stream()
                .collect(Collectors.toMap(SocialTenantDepartmentBindEntity::getTenantDepartmentId, SocialTenantDepartmentBindEntity::getTeamId));
        Map<String, Long> deptIdGeneratorMap = generateDeptBindTeamIdIfAbsent(contactMap, bindTeamMap, rootTeamId);
        List<String> bindDepartmentIdRecords = new ArrayList<>(bindTeamMap.keySet());
        // 已存在的成员
        Map<String, Long> hasBindMemberMap = spaceContext.getMembers().stream()
                .filter(m -> StrUtil.isNotBlank(m.getOpenId()))
                .collect(Collectors.toMap(MemberEntity::getOpenId, MemberEntity::getId));
        Map<String, Long> tenantUserBindMemberIdMap = new HashMap<>(contactMap.values().size());
        contactMap.values().forEach(users ->
                users.forEach(user ->
                        tenantUserBindMemberIdMap.put(user.getOpenId(),
                                hasBindMemberMap.getOrDefault(user.getOpenId(), IdWorker.getId()))));
        List<String> bindOpenIdRecords = new ArrayList<>(hasBindMemberMap.keySet());
        // 租户的成员
        Map<String, List<String>> tenantUserOpenIds = iSocialTenantUserService.getOpenIdMapByTenantId(appId, tenantKey);
        // 租户的部门
        List<String> tenantDeptIds = iSocialTenantDepartmentService.getDepartmentIdsByTenantId(tenantKey, spaceId);

        ContactMeta meta = new ContactMeta();
        meta.spaceId = spaceContext.spaceId;

        // 空间的主管理员成员ID
        Long oldMainAdminMemberId = spaceContext.getMainAdmin();
        boolean isMainAdminContain = oldMainAdminMemberId != null && tenantUserBindMemberIdMap.containsValue(oldMainAdminMemberId);
        Long mainAdminMemberId = null;
        Long indexMemberId = null;
        int index = 0;
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
                        rootTeamId : deptIdGeneratorMap.getOrDefault(dept.getParentDepartmentId(), rootTeamId);
                if (bindTeamMap.containsKey(dept.getDepartmentId())) {
                    // 部门已绑定
                    Long bindId = iSocialTenantDepartmentService.getIdByDepartmentId(spaceId, tenantKey, dept.getDepartmentId());
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
                            .teamName(StrUtil.sub(dept.getName(), 0, 99))
                            .sequence(Integer.parseInt(dept.getOrder()))
                            .build());
                    // 删除部门下的成员
                    iTeamMemberRelService.removeByTeamId(teamId);
                    // 移除部门记录
                    bindDepartmentIdRecords.remove(dept.getDepartmentId());
                }
                else {
                    // 部门未绑定
                    if (!tenantDeptIds.contains(dept.getDepartmentId())) {
                        SocialTenantDepartmentEntity tenantDepartment = SocialFactory.createFeishuTenantDepartment(tenantKey, meta.spaceId, dept);
                        meta.tenantDepartmentEntities.add(tenantDepartment);
                        meta.teamEntities.add(OrganizationFactory.createTeam(meta.spaceId, teamId, parentTeamId, StrUtil.sub(dept.getName(), 0, 99), Integer.parseInt(dept.getOrder())));
                        meta.tenantDepartmentBindEntities.add(SocialFactory.createTenantDepartmentBind(meta.spaceId, teamId, tenantKey, dept.getDepartmentId(), dept.getOpenDepartmentId()));
                    }
                }
            }
            // 处理部门下的成员
            for (FeishuUserObject user : entry.getValue()) {
                if (!tenantUserOpenIds.containsKey(user.getOpenId())) {
                    meta.tenantUserEntities.add(SocialFactory.createTenantUser(appId, tenantKey, user.getOpenId(), user.getUnionId()));
                    // 员工可以有多部门，防止出现重复员工添加
                    tenantUserOpenIds.put(user.getOpenId(), ListUtil.toList(user.getUnionId()));
                }
                else {
                    List<String> unionIds = tenantUserOpenIds.get(user.getOpenId());
                    if (!unionIds.contains(user.getUnionId())) {
                        unionIds.add(user.getUnionId());
                        meta.tenantUserEntities.add(SocialFactory.createTenantUser(appId, tenantKey, user.getOpenId(), user.getUnionId()));
                        // 员工可以有多部门，防止出现重复员工添加
                        tenantUserOpenIds.put(user.getOpenId(), unionIds);
                    }
                }
                Long memberId = tenantUserBindMemberIdMap.get(user.getOpenId());
                if (index == 0) {
                    indexMemberId = memberId;
                }
                if (!isMainAdminContain) {
                    // 以前没有主管理员或者未包含在通讯录授权范围内,使用默认分配管理员规则
                    if (mainAdminMemberId == null) {
                        if (user.isTenantManager()) {
                            mainAdminMemberId = memberId;
                        }
                        else if (index == contactMap.size() - 1) {
                            // 已经遍历到最后了
                            mainAdminMemberId = indexMemberId;
                        }
                    }
                }
                else {
                    mainAdminMemberId = oldMainAdminMemberId;
                }
                if (hasBindMemberMap.containsKey(user.getOpenId())) {
                    // 修改成员
                    if (!updatedMemberIds.contains(memberId)) {
                        meta.updateMemberEntities.add(MemberEntity.builder()
                                .id(memberId)
                                .memberName(user.getName())
                                .mobile(StrUtil.subSuf(user.getMobile(), 3))
                                .email(user.getEmail())
                                .position(user.getJobTitle())
                                .openId(user.getOpenId())
                                .nameModified(true)
                                .isPoint(false)
                                .isActive(true)
                                .isAdmin(mainAdminMemberId != null && mainAdminMemberId.equals(memberId))
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
                                user.getName(), user.getMobile(), user.getEmail(), user.getJobTitle(),
                                user.getOpenId(), mainAdminMemberId != null && mainAdminMemberId.equals(memberId)));
                        createdOrUpdatedMemberIdMap.put(user.getOpenId(), memberId);
                    }
                }
                meta.teamMemberRelEntities.add(SocialFactory.createFeishuTeamMemberRel(teamId, memberId));
            }
            index++;
        }
        // 空间成员删除
        List<Long> removeMemberIds = new ArrayList<>();
        bindOpenIdRecords.forEach(openId -> removeMemberIds.add(hasBindMemberMap.get(openId)));
        iMemberService.batchDeleteMemberFromSpace(spaceId, removeMemberIds, false);
        // 租户下部门和员工记录删除
        iSocialTenantUserService.deleteByFeishuOpenIds(appId, tenantKey, new ArrayList<>(bindOpenIdRecords));
        iSocialTenantDepartmentService.deleteBatchByDepartmentId(spaceId, tenantKey, bindDepartmentIdRecords);
        // 保存变更
        meta.doSaveOrUpdate();
        // 新空间随机引用模板方法，包含GRPC调用，放置最后
        spaceContext.after(tenantKey, mainAdminMemberId);
        return spaceContext;
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleUserLeaveEvent(ContactUserDeleteEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchDefaultContext();
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

    private void handleUserLeave(String appId, String tenantKey, String userOpenId) {
        // 获取空间ID
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isBlank(spaceId)) {
            log.error("[用户离职事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userOpenId);
        if (member != null) {
            if (member.getIsAdmin()) {
                handleChangeMainAdminIfLeaveOrSuspend(tenantKey, userOpenId, spaceId, member.getId());
            }
            // 禁止使用飞书授权登录
            iSocialTenantUserService.deleteByTenantIdAndOpenId(appId, tenantKey, userOpenId);
            // 移除成员所在空间
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(member.getId()), false);
        }
    }

    private void handleChangeMainAdminIfLeaveOrSuspend(String tenantKey, String mainAdminOpenId, String spaceId, Long mainAdminMemberId) {
        // 离职的成员是主管理员，则顺序修改其他员工为主管理员
        FeishuAdminUserList adminList = iFeishuService.getAdminList(tenantKey);
        List<String> adminOpenIds = adminList.getUserList().stream().map(Admin::getOpenId).collect(Collectors.toList());
        if (CollUtil.isNotEmpty(adminOpenIds)) {
            adminOpenIds.removeIf(openId -> openId.equals(mainAdminOpenId));
            boolean change = false;
            for (String openId : adminOpenIds) {
                Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, openId);
                if (memberId != null) {
                    MemberEntity updateMember = new MemberEntity();
                    updateMember.setId(memberId);
                    updateMember.setIsAdmin(true);
                    iMemberService.updateById(updateMember);
                    spaceMapper.updateSpaceOwnerId(spaceId, memberId, null);
                    change = true;
                    break;
                }
            }

            if (!change) {
                // 按创建时间往下找新的成员作为管理员
                Long randomMemberId = iMemberService.getRandomMemberId(spaceId, mainAdminMemberId);
                if (randomMemberId != null) {
                    MemberEntity updateMember = new MemberEntity();
                    updateMember.setId(randomMemberId);
                    updateMember.setIsAdmin(true);
                    iMemberService.updateById(updateMember);
                    spaceMapper.updateSpaceOwnerId(spaceId, randomMemberId, null);
                }
            }
        }
        else {
            // 按创建时间往下找新的成员作为管理员
            Long randomMemberId = iMemberService.getRandomMemberId(spaceId, mainAdminMemberId);
            if (randomMemberId != null) {
                MemberEntity updateMember = new MemberEntity();
                updateMember.setId(randomMemberId);
                updateMember.setIsAdmin(true);
                iMemberService.updateById(updateMember);
                spaceMapper.updateSpaceOwnerId(spaceId, randomMemberId, null);
            }
        }
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleUserUpdateEvent(ContactUserUpdateEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchDefaultContext();
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
                // 需要其他状态都是false才能算是激活
                if (!userObject.getStatus().isFrozen() && !userObject.getStatus().isResigned()) {
                    log.info("[用户状态变更] - [员工激活企业]");
                    // 加入对应空间站,并且修改其他属性
                    handleUserActive(event.getHeader().getAppId(), tenantKey, spaceId, userObject);
                }
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
            else if (userObject.getStatus().isActivated() && !userObject.getStatus().isResigned() && !userObject.getStatus().isFrozen()) {
                // 用户加入空间站
                log.info("[用户修改信息] - [员工激活企业]");
                handleUserActive(event.getHeader().getAppId(), tenantKey, spaceId, userObject);
            }
        }
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getHeader().getEventId());
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
    public void handleDeptDeleteEvent(ContactDeptDeleteEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchDefaultContext();
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
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptUpdateEvent(ContactDeptUpdateEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchDefaultContext();
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
            team.setTeamName(StrUtil.sub(deptObject.getName(), 0, 99));
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
        team.setTeamName(StrUtil.sub(deptObject.getName(), 0, 99));
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

    @Override
    public void handleP2pChatCreateEvent(P2pChatCreateEvent event) {
        // 用户点击机器人进入时，发送<开始使用>消息卡片
        sendEntryCardToUser(event.getAppId(), event.getTenantKey(), event.getUser().getOpenId());
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public void handleAddBotEvent(AddBotEvent event) {
        // 发送消息到群里
        sendEntryCardToChatGroup(event.getAppId(), event.getTenantKey(), event.getOpenChatId());
        // 事件处理完成
        iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
    }

    @Override
    public <E extends BaseMessageEvent> void handleMessageEvent(E event) {
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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrderPaidEvent(OrderPaidEvent event) {
        Integer status = iSocialFeishuOrderService.getStatusByOrderId(event.getTenantKey(), event.getAppId(),
                event.getOrderId());
        if (SqlHelper.retBool(status)) {
            log.warn("飞书订单已经处理:{}", event.getOrderId());
            return;
        }
        // 写入飞书订单
        if (null == status) {
            iSocialFeishuOrderService.createOrder(event);
        }
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getAppId(), event.getTenantKey());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("飞书企业还未收到开通应用事件:{}", event.getTenantKey());
            return;
        }
        try {
            SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
            // 事件处理完成
            iSocialFeishuEventLogService.doneEvent(event.getMeta().getUuid());
        }
        catch (Exception e) {
            log.error("处理租户订单失败，请火速解决:{}:{}", spaceId, event.getOrderId(), e);
        }
        // 发送通知
        SubscribePlanInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        TaskManager.me().execute(() -> {
            Long toUserId = iSpaceService.getSpaceOwnerUserId(spaceId);
            Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
            if (price != null) {
                NotificationManager.me().sendSocialSubscribeNotify(spaceId, toUserId, planInfo.getDeadline(),
                        price.getGoodChTitle(), event.getOrderPayPrice());
            }
        });
    }

    private Long createTeamIfNotExist(String tenantKey, String spaceId, String parentDepartmentId, String newTeamName, String order) {
        // 是否一级部门
        if (parentDepartmentId.equals(FEISHU_ROOT_DEPT_ID)) {
            // 一级部门
            Long rootTeamId = iTeamService.getRootTeamId(spaceId);
            // 新建部门
            TeamEntity team = new TeamEntity();
            team.setId(IdWorker.getId());
            team.setParentId(rootTeamId);
            team.setSpaceId(spaceId);
            team.setTeamName(newTeamName);
            team.setSequence(Integer.parseInt(order));
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
            team.setParentId(parentTeamId);
            team.setSpaceId(spaceId);
            team.setTeamName(newTeamName);
            team.setSequence(Integer.parseInt(order));
            iTeamService.batchCreateTeam(spaceId, Collections.singletonList(team));
            return team.getId();
        }
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

    private void handleUserActive(String appId, String tenantKey, String spaceId, FeishuUserObject userObject) {
        // 员工被入职后点击客户端对应企业后激活
        // 只有同步通讯录时候才会创建租户用户记录，员工激活后应该是不存在空间站
        // 创建租户用户记录
        boolean isExistTenantUser = iSocialTenantUserService.isTenantUserUnionIdExist(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        if (!isExistTenantUser) {
            iSocialTenantUserService.create(appId, tenantKey, userObject.getOpenId(), userObject.getUnionId());
        }
        // 查询空间内是否有此成员，已删除的也要查出来
        Long memberId = iMemberService.getMemberIdByOpenIdIgnoreDelete(spaceId, userObject.getOpenId());
        if (memberId == null) {
            // 创建成员
            MemberEntity member = SocialFactory.createFeishuMember(IdWorker.getId(), spaceId, userObject.getName(),
                    userObject.getMobile(), userObject.getEmail(), userObject.getJobTitle(),
                    userObject.getOpenId(), false);
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
            memberId = member.getId();
        }
        else {
            // 恢复成员信息
            MemberEntity member = iMemberService.getByIdIgnoreDelete(memberId);
            if (member.getIsDeleted()) {
                // 已删除的恢复成员
                member.setMemberName(userObject.getName());
                member.setIsActive(true);
                member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
                member.setIsPoint(true);
                // 空间内的成员名称不同步用户名称
                member.setNameModified(true);
                // 恢复成员数据
                iMemberService.restoreMember(member);
                // 恢复组织单元数据
                iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(memberId));
            }
            else {
                // 更新成员信息
                MemberEntity updateMember = new MemberEntity();
                updateMember.setId(memberId);
                updateMember.setMemberName(userObject.getName());
                iMemberService.updateById(updateMember);
            }
        }
        // 创建部门关联
        handleUserDepartmentRelate(tenantKey, spaceId, memberId, userObject.getDepartmentIds());
    }

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Transactional(rollbackFor = Exception.class)
    public void handleDeptCreateEvent(ContactDeptCreateEvent event) {
        // 切换应用配置上下文
        iFeishuService.switchDefaultContext();
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
        Long toCreateTeamId = createTeamIfNotExist(tenantKey, spaceId, parentDeptObject.getDepartmentId(), StrUtil.sub(deptObject.getName(), 0, 99), deptObject.getOrder());

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

    private void handleUserSuspend(String tenantKey, String spaceId, String userOpenId) {
        // 管理员在后台暂停此员工账号在本企业使用
        // 暂停后，成员也无法登录该企业，所以禁止登录也无关紧要
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, userOpenId);
        if (member == null) {
            log.warn("飞书企业[{}]暂停的成员[{}]不存在", tenantKey, userOpenId);
            return;
        }
        if (member.getIsAdmin()) {
            // 如果暂停了主管理员，要动态更换其他管理员
            handleChangeMainAdminIfLeaveOrSuspend(tenantKey, userOpenId, spaceId, member.getId());
        }
        List<Long> memberIds = Collections.singletonList(member.getId());
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

    public void sendEntryCardToUser(String appId, String tenantKey, String userOpenId) {
        try {
            // 发送<开始使用>消息卡片给用户
            Message cardMessage = FeishuCardFactory.createV2EntryCardMsg(appId);
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
            Message cardMessage = FeishuCardFactory.createV2EntryCardMsg(appId);
            String messageId = iFeishuService.sendCardMessageToChatGroup(tenantKey, chatId, cardMessage);
            log.info("消息送达ID：{}", messageId);
        }
        catch (FeishuApiException exception) {
            // 发不出去不用理会,报个警查一下原因
            log.error("发送消息卡片到群里失败", exception);
        }
    }

    @Override
    public void handleTenantOrders(String tenantKey, String appId) {
        List<String> orderData = iSocialFeishuOrderService.getOrdersByTenantIdAndAppId(tenantKey, appId);
        log.warn("没有待处理的飞书订单:{}:{}", tenantKey, appId);
        orderData.forEach(data -> {
            OrderPaidEvent event = JSONUtil.toBean(data, OrderPaidEvent.class);
            try {
                handleOrderPaidEvent(event);
            }
            catch (Exception e) {
                log.error("处理租户订单失败，请火速解决:{}:{}", tenantKey, event.getOrderId(), e);
            }
        });
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

    public class SpaceContext {

        String spaceId;

        String spaceName;

        String spaceLogo;

        Long rootTeamId;

        String rootNodeId;

        private boolean isCreate;

        public SpaceContext(String spaceId) {
            this.spaceId = spaceId;
        }

        void prepare(String tenantId) {
            if (StrUtil.isBlank(spaceId)) {
                spaceId = IdUtil.createSpaceId();
                FeishuTenantInfo tenantInfo = null;
                try {
                    tenantInfo = iFeishuService.getFeishuTenantInfo(tenantId);
                }
                catch (FeishuApiException exception) {
                    if (exception.getCode() == GET_TENANT_DENIED) {
                        // 180天内企业未使用过此应用，不算错误，返回NULL即可
                        log.warn("飞书企业信息无法获取，对方超过180天没有使用过此应用");
                    }
                }
                spaceName = getTenantNameIfAbsent(tenantInfo);
                spaceLogo = getTenantAvatarIfAbsent(tenantInfo);
                rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
                iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
                // 创建根节点
                rootNodeId = iNodeService.createChildNode(-1L, CreateNodeDto.builder()
                        .spaceId(spaceId)
                        .newNodeId(IdUtil.createNodeId())
                        .type(NodeType.ROOT.getNodeType()).build());
                isCreate = true;
            }
            else {
                rootTeamId = iTeamService.getRootTeamId(spaceId);
            }
        }

        void after(String tenantId, Long owner) {
            if (isCreate) {
                String props = JSONUtil.parseObj(SpaceGlobalFeature.builder().nodeExportable(true)
                        .invitable(false).joinable(false).mobileShowable(false).build()).toString();
                SpaceEntity space = SpaceEntity.builder()
                        .spaceId(spaceId)
                        .name(spaceName)
                        .logo(spaceLogo)
                        .props(props)
                        .owner(owner)
                        .build();
                iSpaceService.save(space);
                // 绑定租户和此空间站
                iSocialTenantBindService.addTenantBind(iFeishuService.getIsvAppId(), tenantId, spaceId);
                // 更新应用市场状态
                iAppInstanceService.createInstanceByAppType(spaceId, AppType.LARK_STORE.name());

                // 随机引用模板中心 热门推荐 轮播图的模板
                String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
                if (StrUtil.isNotBlank(templateNodeId)) {
                    // 转存节点方法，包含GRPC调用，放置最后
                    iNodeService.copyNodeToSpace(-1L, spaceId, rootNodeId, templateNodeId, NodeCopyOptions.create());
                }
            }
            else {
                spaceMapper.updateSpaceOwnerId(spaceId, owner, null);
            }
        }

        private String getTenantNameIfAbsent(FeishuTenantInfo tenantInfo) {
            if (tenantInfo != null) {
                return tenantInfo.getName();
            }
            return "工作空间站";
        }

        private String getTenantAvatarIfAbsent(FeishuTenantInfo tenantInfo) {
            if (tenantInfo != null) {
                return iAssetService.downloadAndUploadUrl(tenantInfo.getAvatar().getAvatarOrigin());
            }
            return null;
        }

        Long getMainAdmin() {
            if (isCreate) {
                return null;
            }
            else {
                return iSpaceService.getSpaceMainAdminMemberId(spaceId);
            }
        }

        List<MemberEntity> getMembers() {
            if (isCreate) {
                return new ArrayList<>();
            }
            else {
                return iMemberService.getMembersBySpaceId(spaceId, true);
            }
        }
    }
}

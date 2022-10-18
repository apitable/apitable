package com.vikadata.api.modular.social.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.Privilege;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvUserServiceImpl;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComUserStatus;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用变更通讯录处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-11 18:31:43
 */
@Slf4j
@Service
public class SocialCpIsvContactChangeEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.CONTACT_CHANGE;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        WxCpTpXmlMessage xmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        String authCorpId = xmlMessage.getAuthCorpId();
        String suiteId = xmlMessage.getSuiteId();
        String cpUserId = xmlMessage.getUserID();
        List<String> existedSpaceIds = socialTenantBindService
                .getSpaceIdsByTenantIdAndAppId(authCorpId, suiteId);
        Assert.notEmpty(existedSpaceIds, () -> new IllegalStateException(String.
                format("没有找到对应的空间站信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        String spaceId = existedSpaceIds.get(0);
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 如果需要，先刷新 access_token
        socialCpIsvService.refreshAccessToken(suiteId, unprocessed.getAuthCorpId(), socialTenantEntity.getPermanentCode());
        // 1 处理不同的变更类型
        String changeType = xmlMessage.getChangeType();
        switch (changeType) {
            case "create_user":
                // 1.1 新增成员
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // 管理员授权才需要通过可见范围处理
                    createUser(authCorpId, suiteId, cpUserId, spaceId);
                }
                break;
            case "update_user":
                // 1.2 更新成员
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // 管理员授权才需要通过可见范围处理
                    updateUser(authCorpId, suiteId, cpUserId, spaceId, xmlMessage.getDepartment());
                }
                break;
            case "delete_user":
                // 1.3 移除成员
                deleteUser(cpUserId, spaceId);
                break;
            case "update_tag":
                // 1.4 更新标签
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // 管理员授权才需要通过可见范围处理
                    updateTag(authCorpId, suiteId, spaceId,
                            xmlMessage.getAddUserItems(), xmlMessage.getDelUserItems(),
                            xmlMessage.getAddPartyItems(), xmlMessage.getDelPartyItems());
                }
                break;
            default:
                // nothing to do
        }
        // 3 清空临时缓存
        socialCpIsvService.clearCache(authCorpId);
        // 4 接口许可处理
        try {
            socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
        }
        catch (Exception ex) {
            log.error("企微接口许可自动化处理失败", ex);
        }
        return true;
    }

    private void createUser(String tenantId, String appId, String cpUserId, String spaceId) throws WxErrorException {

        // 1 获取当前企业授权的可见范围
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(appId, tenantId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", tenantId, appId)));

        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
        Privilege privilege = agent.getPrivilege();
        List<String> allowUsers = privilege.getAllowUsers();
        List<Integer> allowParties = privilege.getAllowParties();
        List<Integer> allowTags = privilege.getAllowTags();
        boolean viewable = socialCpIsvService.judgeViewable(tenantId, cpUserId, appId,
                allowUsers, allowParties, allowTags);
        if (viewable) {
            // 2 添加的用户在应用可见范围内，则新增成员
            socialCpIsvService.syncSingleUser(tenantId, cpUserId, appId, spaceId, false);
            // 3 发送开始使用消息
            WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
            socialCpIsvService.sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage, Collections.singletonList(cpUserId), null, null);
        }

    }

    private void updateUser(String tenantId, String appId, String cpUserId, String spaceId, Integer[] cpDepartments)
            throws WxErrorException {

        // 企业微信第三方服务商无法获取到用户个人信息，不需要对个人信息进行处理
        // 成员变更后，需要重新判断该用户的所属部门是否在可见范围内

        // 1 获取用户的成员信息
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // 2 不存在，新增成员
            createUser(tenantId, appId, cpUserId, spaceId);
        }
        else {
            // 3 获取当前企业授权的可见范围
            SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(appId, tenantId);
            Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                    .format("没有找到可用的租户信息，tenantId：%s，appId：%s", tenantId, appId)));

            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Privilege privilege = agent.getPrivilege();
            List<String> allowUsers = privilege.getAllowUsers();
            List<Integer> allowParties = privilege.getAllowParties();
            List<Integer> allowTags = privilege.getAllowTags();
            boolean viewable = socialCpIsvService.judgeViewable(tenantId, cpUserId, appId,
                    allowUsers, allowParties, allowTags);
            if (!viewable) {
                // 4 成员变更后，不处于应用的可见范围内，则移除成员
                deleteUser(memberEntity, spaceId);
            }
        }

    }

    private void deleteUser(String cpUserId, String spaceId) {

        // 1 获取用户的成员信息
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            return;
        }

        // 2 移除成员
        deleteUser(memberEntity, spaceId);

    }

    private void deleteUser(MemberEntity memberEntity, String spaceId) {

        if (Objects.isNull(memberEntity)) {
            return;
        }

        // 1 移除成员信息
        memberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberEntity.getId()), false);
        // 2 如果是管理员，需要移除对应空间站的管理员
        if (Boolean.TRUE.equals(memberEntity.getIsAdmin())) {
            spaceService.removeMainAdmin(spaceId);
        }

    }

    private void updateTag(String tenantId, String appId, String spaceId,
            String[] addUserItems, String[] delUserItems, Integer[] addPartyItems, Integer[] delPartyItems)
            throws WxErrorException {

        // 只有在授权应用可见范围内的标签的变更，才会触发该事件回调

        if (ArrayUtil.isNotEmpty(addUserItems)) {
            // 1 将标签新增的用户加入成员
            for (String cpUserId : addUserItems) {
                createUser(tenantId, appId, cpUserId, spaceId);
            }

            return;
        }

        if (ArrayUtil.isNotEmpty(delUserItems)) {
            // 2 将标签删除的用户移除成员
            for (String cpUserId : delUserItems) {
                deleteUser(cpUserId, spaceId);
            }

            return;
        }

        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();

        if (ArrayUtil.isNotEmpty(addPartyItems)) {
            // 3 将标签新增的部门下的用户加入成员
            WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(appId)
                    .getWxCpTpUserService();
            // 使用缓存，防止通讯录大批量操作时频繁调用接口
            String userSimpleListKey = RedisConstants.getWecomIsvContactUserSimpleListKey(tenantId);
            for (Integer party : addPartyItems) {
                String userSimpleListHashKey = party.toString();
                List<WxCpUser> cpUsers = Optional.ofNullable(hashOperations.get(userSimpleListKey, userSimpleListHashKey))
                        .map(string -> JSONUtil.toList(string, WxCpUser.class))
                        .orElse(null);
                if (CollUtil.isEmpty(cpUsers)) {
                    cpUsers = wxCpTpUserService
                            .listSimpleByDepartment(party.longValue(), true, WeComUserStatus.ACTIVE.getCode(), tenantId);
                    hashOperations.put(userSimpleListKey, userSimpleListHashKey, JSONUtil.toJsonStr(cpUsers));
                }
                if (CollUtil.isEmpty(cpUsers)) {
                    continue;
                }

                for (WxCpUser cpUser : cpUsers) {
                    createUser(tenantId, appId, cpUser.getUserId(), spaceId);
                }
            }

            return;
        }

        if (ArrayUtil.isNotEmpty(delPartyItems)) {
            // 4 将标签删除的部门下的用户移除成员
            WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(appId)
                    .getWxCpTpUserService();
            // 使用缓存，防止通讯录大批量操作时频繁调用接口
            String userSimpleListKey = RedisConstants.getWecomIsvContactUserSimpleListKey(tenantId);
            for (Integer party : delPartyItems) {
                String userSimpleListHashKey = party.toString();
                List<WxCpUser> cpUsers = Optional.ofNullable(hashOperations.get(userSimpleListKey, userSimpleListHashKey))
                        .map(string -> JSONUtil.toList(string, WxCpUser.class))
                        .orElse(null);
                if (CollUtil.isEmpty(cpUsers)) {
                    cpUsers = wxCpTpUserService
                            .listSimpleByDepartment(party.longValue(), true, WeComUserStatus.ACTIVE.getCode(), tenantId);
                    hashOperations.put(userSimpleListKey, userSimpleListHashKey, JSONUtil.toJsonStr(cpUsers));
                }
                if (CollUtil.isEmpty(cpUsers)) {
                    continue;
                }

                for (WxCpUser cpUser : cpUsers) {
                    deleteUser(cpUser.getUserId(), spaceId);
                }
            }
        }

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}

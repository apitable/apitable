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
 * Third party platform integration - WeCom third-party service provider application change address book processing
 * </p>
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
                format("No corresponding space station information was found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        String spaceId = existedSpaceIds.get(0);
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("No available tenant information found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        // If necessary, refresh access first_ token
        socialCpIsvService.refreshAccessToken(suiteId, unprocessed.getAuthCorpId(), socialTenantEntity.getPermanentCode());
        // 1 Handling different change types
        String changeType = xmlMessage.getChangeType();
        switch (changeType) {
            case "create_user":
                // 1.1 New member
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // Only when the administrator authorizes, it needs to be processed through the visible range
                    createUser(authCorpId, suiteId, cpUserId, spaceId);
                }
                break;
            case "update_user":
                // 1.2 Update Members
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // Only when the administrator authorizes, it needs to be processed through the visible range
                    updateUser(authCorpId, suiteId, cpUserId, spaceId, xmlMessage.getDepartment());
                }
                break;
            case "delete_user":
                // 1.3 Remove Members
                deleteUser(cpUserId, spaceId);
                break;
            case "update_tag":
                // 1.4 Update Label
                if (SocialTenantAuthMode.ADMIN.getValue() == socialTenantEntity.getAuthMode()) {
                    // Only when the administrator authorizes, it needs to be processed through the visible range
                    updateTag(authCorpId, suiteId, spaceId,
                            xmlMessage.getAddUserItems(), xmlMessage.getDelUserItems(),
                            xmlMessage.getAddPartyItems(), xmlMessage.getDelPartyItems());
                }
                break;
            default:
                // nothing to do
        }
        // 3 Empty temporary cache
        socialCpIsvService.clearCache(authCorpId);
        // 4 Interface license processing
        try {
            socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
        }
        catch (Exception ex) {
            log.error("WeCom interface license automation processing failed", ex);
        }
        return true;
    }

    private void createUser(String tenantId, String appId, String cpUserId, String spaceId) throws WxErrorException {

        // 1 Obtain the visible range of current enterprise authorization
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(appId, tenantId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("No available tenant information found,tenantId：%s，appId：%s", tenantId, appId)));

        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
        Privilege privilege = agent.getPrivilege();
        List<String> allowUsers = privilege.getAllowUsers();
        List<Integer> allowParties = privilege.getAllowParties();
        List<Integer> allowTags = privilege.getAllowTags();
        boolean viewable = socialCpIsvService.judgeViewable(tenantId, cpUserId, appId,
                allowUsers, allowParties, allowTags);
        if (viewable) {
            // 2 If the added user is within the visible range of the application, add a new member
            socialCpIsvService.syncSingleUser(tenantId, cpUserId, appId, spaceId, false);
            // 3 Send Start Using Message
            WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
            socialCpIsvService.sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage, Collections.singletonList(cpUserId), null, null);
        }

    }

    private void updateUser(String tenantId, String appId, String cpUserId, String spaceId, Integer[] cpDepartments)
            throws WxErrorException {

        // WeCom third-party service providers cannot obtain the user's personal information, and do not need to process the personal information
        // After the member changes, it is necessary to re judge whether the user's department is within the visible range

        // 1 Get user's member information
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // 2 Does not exist, new member
            createUser(tenantId, appId, cpUserId, spaceId);
        }
        else {
            // 3 Obtain the visible range of current enterprise authorization
            SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(appId, tenantId);
            Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                    .format("No available tenant information found,tenantId：%s，appId：%s", tenantId, appId)));

            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Privilege privilege = agent.getPrivilege();
            List<String> allowUsers = privilege.getAllowUsers();
            List<Integer> allowParties = privilege.getAllowParties();
            List<Integer> allowTags = privilege.getAllowTags();
            boolean viewable = socialCpIsvService.judgeViewable(tenantId, cpUserId, appId,
                    allowUsers, allowParties, allowTags);
            if (!viewable) {
                // 4 After the member changes, if it is not within the visible range of the application, remove the member
                deleteUser(memberEntity, spaceId);
            }
        }

    }

    private void deleteUser(String cpUserId, String spaceId) {

        // 1 Get user's member information
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            return;
        }

        // 2 Remove Members
        deleteUser(memberEntity, spaceId);

    }

    private void deleteUser(MemberEntity memberEntity, String spaceId) {

        if (Objects.isNull(memberEntity)) {
            return;
        }

        // 1 Remove member information
        memberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberEntity.getId()), false);
        // 2 If you are an administrator, you need to remove the administrator of the corresponding space station
        if (Boolean.TRUE.equals(memberEntity.getIsAdmin())) {
            spaceService.removeMainAdmin(spaceId);
        }

    }

    private void updateTag(String tenantId, String appId, String spaceId,
            String[] addUserItems, String[] delUserItems, Integer[] addPartyItems, Integer[] delPartyItems)
            throws WxErrorException {

        // This event callback will only be triggered if the label changes within the visible range of the authorized application

        if (ArrayUtil.isNotEmpty(addUserItems)) {
            // 1 Add the user added to the tag to the member
            for (String cpUserId : addUserItems) {
                createUser(tenantId, appId, cpUserId, spaceId);
            }

            return;
        }

        if (ArrayUtil.isNotEmpty(delUserItems)) {
            // 2 Users who delete labels Remove members
            for (String cpUserId : delUserItems) {
                deleteUser(cpUserId, spaceId);
            }

            return;
        }

        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();

        if (ArrayUtil.isNotEmpty(addPartyItems)) {
            // 3 Add the user under the new department of the label to the member
            WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(appId)
                    .getWxCpTpUserService();
            // Use cache to prevent frequent calls to the interface during mass operation of the address book
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
            // 4 Remove members from users under the department whose labels are deleted
            WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(appId)
                    .getWxCpTpUserService();
            // Use cache to prevent frequent calls to the interface during mass operation of the address book
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

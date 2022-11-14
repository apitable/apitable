package com.vikadata.api.shared.component.notification;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;

import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties.IsvAppProperty;
import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.workspace.dto.NodeBaseInfoDTO;
import com.vikadata.api.player.dto.NotificationModelDTO;
import com.vikadata.api.player.dto.PlayerBaseDTO;
import com.vikadata.api.space.dto.BaseSpaceInfoDTO;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.vo.NotificationDetailVo;
import com.vikadata.api.player.vo.PlayerBaseVo;
import com.vikadata.api.enterprise.appstore.enums.AppType;
import com.vikadata.api.enterprise.appstore.model.LarkInstanceConfig;
import com.vikadata.api.enterprise.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.enterprise.appstore.service.IAppInstanceService;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.enterprise.social.constants.LarkConstants;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.event.wecom.WeComCardFactory;
import com.vikadata.api.enterprise.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.enterprise.social.mapper.SocialTenantBindMapper;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.api.enterprise.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.workspace.mapper.NodeMapper;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import static com.vikadata.api.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.shared.constants.NotificationConstants.INVOLVE_MEMBER_DETAIL;

@Component
@Slf4j
public class NotificationFactory implements INotificationFactory {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private UserMapper userMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private SocialTenantBindMapper socialTenantBindMapper;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Resource
    private IDingTalkService iDingTalkService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Override
    public NotificationTemplate getTemplateById(String templateId) {
        return SystemConfigManager.getConfig().getNotifications().getTemplates().get(templateId);
    }

    @Override
    public PlayerBaseVo formatFromUser(Long fromUserId, String spaceId, NotificationRenderMap renderMap) {
        Long fromMemberId = renderMap.getFromUser().get(fromUserId.toString() + spaceId);
        if (ObjectUtil.isNotNull(renderMap.getMembers())) {
            return renderMap.getMembers().get(fromMemberId);
        }
        return null;
    }

    @Override
    public NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node) {
        if (ObjectUtil.isNotNull(node)) {
            return NotificationDetailVo.Node.builder().nodeName(node.getNodeName()).nodeId(node.getNodeId())
                    .icon(node.getIcon()).build();
        }
        return null;
    }

    @Override
    public NotificationDetailVo.Space formatSpace(BaseSpaceInfoDTO space) {
        if (ObjectUtil.isNotNull(space)) {
            return NotificationDetailVo.Space.builder().spaceId(space.getSpaceId()).spaceName(space.getName())
                    .logo(space.getLogo()).build();
        }
        return null;
    }

    @Override
    public boolean delayLock(String key, Long notificationId) {
        return Boolean.TRUE.equals(redisTemplate.opsForValue().setIfAbsent(key, notificationId,
                constProperties.getMentionNotifyWaitTime(), TimeUnit.MILLISECONDS));
    }

    @Override
    public String getDelayLockKey(String toUserId, NotificationCreateRo ro) {
        String fromUserId = ro.getFromUserId();
        String nodeId = ro.getNodeId();
        String templateId = ro.getTemplateId();
        if (StrUtil.isNotBlank(fromUserId) && StrUtil.isNotBlank(toUserId) && StrUtil.isNotBlank(nodeId)) {
            Object extra = ro.getBody().getByPath(BODY_EXTRAS);
            JSONArray recordIds = NotificationHelper.getRecordIdsFromExtras(JSONUtil.parseObj(extra));
            if (recordIds != null && recordIds.size() == 1) {
                return RedisConstants.getNotificationLockedKey(templateId,
                        SecureUtil.md5(fromUserId + toUserId + nodeId + recordIds.get(0)));
            }
            return RedisConstants.getNotificationLockedKey(templateId, SecureUtil.md5(fromUserId + toUserId + nodeId));
        }
        return null;
    }

    @Override
    public Long getNotificationIdFromRedis(String key) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return Long.valueOf(value.toString());
        }
        return null;
    }

    @Override
    public List<Long> getSpaceAllUserId(String spaceId) {
        return memberMapper.selectUserIdBySpaceId(spaceId);
    }

    @Override
    public List<Long> getMemberUserId(List<Long> memberIds, String spaceId) {
        if (StrUtil.isNotBlank(spaceId) && ObjectUtil.isNotEmpty(memberIds)) {
            return memberMapper.selectUserIdBySpaceIdAndIds(spaceId, memberIds);
        }
        return null;
    }

    @SneakyThrows
    @Override
    public JSONObject getJsonObject(Object object) {
        if (ObjectUtil.isNotNull(object)) {
            return JSONUtil.parseObj(objectMapper.writeValueAsString(object));
        }
        return null;
    }

    @Override
    public JSONObject formatExtra(JSONObject extras, Map<Long, PlayerBaseVo> members) {
        JSONArray memberIds = NotificationHelper.getMemberIdsFromExtras(extras);
        if (ObjectUtil.isNotNull(memberIds) && !memberIds.isEmpty()) {
            List<JSONObject> involvedMembers = new ArrayList<>();
            memberIds.forEach(memberId -> involvedMembers.add(getJsonObject(members.get(Convert.toLong(memberId)))));
            extras.putOnce(INVOLVE_MEMBER_DETAIL, involvedMembers);
        }
        return extras;
    }

    @Override
    public NotificationRenderMap getRenderList(List<NotificationModelDTO> dtos) {
        NotificationRenderMap list = new NotificationRenderMap();
        List<String> nodeIds = new ArrayList<>();
        List<String> spaceIds = new ArrayList<>();
        List<Long> memberIds = new ArrayList<>();
        List<Long> userIds = new ArrayList<>();
        Map<String, Long> fromUser = MapUtil.newHashMap();
        dtos.forEach(dto -> {
            spaceIds.add(dto.getSpaceId());
            nodeIds.add(dto.getNodeId());
            if (dto.getFromUser() != 0) {
                Long memberId =
                        memberMapper.selectMemberIdByUserIdAndSpaceIdExcludeDelete(dto.getFromUser(), dto.getSpaceId());
                if (ObjectUtil.isNotNull(memberId)) {
                    memberIds.add(memberId);
                    fromUser.put(dto.getFromUser().toString() + dto.getSpaceId(), memberId);
                }
                else {
                    userIds.add(dto.getFromUser());
                    fromUser.put(dto.getFromUser().toString() + dto.getSpaceId(), dto.getFromUser());
                }
            }
            JSONArray memberIdArr = NotificationHelper
                    .getMemberIdsFromExtras(NotificationHelper.getExtrasFromNotifyBody(dto.getNotifyBody()));
            if (ObjectUtil.isNotNull(memberIdArr) && !memberIdArr.isEmpty()) {
                memberIds.addAll(ListUtil.toList(Convert.toLongArray(memberIdArr)));
            }
        });
        if (CollUtil.isNotEmpty(CollUtil.removeBlank(spaceIds))) {
            list.setSpaces(spaceMapper.selectBaseSpaceInfo(CollUtil.removeBlank(CollUtil.distinct(spaceIds))).stream()
                    .collect(Collectors.toMap(BaseSpaceInfoDTO::getSpaceId, a -> a, (k1, k2) -> k1)));
        }
        if (CollUtil.isNotEmpty(CollUtil.removeBlank(nodeIds))) {
            list.setNodes(
                    nodeMapper.selectBaseNodeInfoByNodeIdsIncludeDelete(CollUtil.removeBlank(CollUtil.distinct(nodeIds)))
                            .stream().collect(Collectors.toMap(NodeBaseInfoDTO::getNodeId, a -> a, (k1, k2) -> k1)));
        }
        list.setMembers(getPlayerBaseInfo(CollUtil.distinct(memberIds), CollUtil.distinct(userIds)));
        list.setFromUser(fromUser);
        return list;
    }

    @Override
    public List<Long> getMemberUserIdExcludeDeleted(List<Long> memberIds) {
        return memberMapper.selectUserIdsByMemberIds(memberIds);
    }

    @Override
    public Long getSpaceSuperAdmin(String spaceId) {
        return spaceMapper.selectSpaceMainAdmin(spaceId);
    }

    @Override
    public NotificationToTag getToUserTagByTemplateId(NotificationTemplateId templateId) {
        String toUserTag = getTemplateById(templateId.getValue()).getToTag();
        if (StrUtil.isNotBlank(toUserTag)) {
            return NotificationToTag.getValue(toUserTag);
        }
        return NotificationToTag.MEMBERS;
    }

    @Override
    public String getNodeParentId(String nodeId) {
        return nodeMapper.selectParentIdByNodeId(nodeId);
    }

    @Override
    public Map<Long, PlayerBaseVo> getPlayerBaseInfo(List<Long> memberIds, List<Long> userIds) {
        Map<Long, PlayerBaseVo> players = MapUtil.newHashMap();
        if (CollUtil.isNotEmpty(memberIds)) {
            List<PlayerBaseDTO> members = memberMapper.selectMemberInfoByMemberIdsIncludeDelete(memberIds);
            players.putAll(members.stream().collect(Collectors.toMap(PlayerBaseDTO::getMemberId, a -> PlayerBaseVo
                    .builder()
                    .playerType(a.getIsMemberDeleted() ? PlayerType.MEMBER_DELETED.getType() : PlayerType.MEMBER.getType())
                    .userName(a.getUserName()).uuid(a.getUuid()).avatar(a.getAvatar()).email(a.getEmail())
                    .memberId(a.getMemberId()).memberName(a.getMemberName()).team(a.getTeam())
                    .isNickNameModified(a.getIsNickNameModified())
                    .isMemberNameModified(a.getIsMemberNameModified())
                    .isDeleted(a.getIsMemberDeleted()).build(), (k1, k2) -> k1)));
        }
        if (CollUtil.isNotEmpty(userIds)) {
            List<UserEntity> users = userMapper.selectByIds(userIds);
            if (CollUtil.isNotEmpty(users)) {
                players.putAll(users.stream()
                        .collect(Collectors.toMap(UserEntity::getId,
                                a -> PlayerBaseVo.builder().playerType(PlayerType.VISITORS.getType()).userName(a.getNickName())
                                        .isNickNameModified(Objects.isNull(a.getIsSocialNameModified()) || a.getIsSocialNameModified() != 0)
                                        .uuid(a.getUuid()).avatar(a.getAvatar()).email(a.getEmail()).isDeleted(true).build(),
                                (k1, k2) -> k1)));
            }
        }
        return players;
    }

    @Override
    public List<Long> getSocialUserIds(SocialPlatformType platformType) {
        List<String> spaceIds = socialTenantBindMapper.selectSpaceIdByPlatformTypeAndAppType(platformType,
                SocialAppType.ISV);
        List<Long> userIds = new ArrayList<>();
        List<List<String>> split = CollUtil.split(spaceIds, 1000);
        for (List<String> spcIds : split) {
            List<Long> tmpUserIds = memberMapper.selectUserIdBySpaceIds(spcIds);
            if (!tmpUserIds.isEmpty()) {
                userIds.addAll(tmpUserIds);
            }
        }
        return userIds.stream().distinct().collect(Collectors.toList());
    }

    @Override
    public Boolean frequencyLimited(Long userId, NotificationTemplate template, String nonce) {
        if (template.getFrequency() != null) {
            String key = RedisConstants.getUserNotifyFrequencyKey(userId, template.getId(), nonce);
            if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
                Object frequency = redisTemplate.opsForValue().get(key);
                if (frequency != null && Long.parseLong(frequency.toString()) <= template.getFrequency()) {
                    return true;
                }
                else {
                    addUserNotifyFrequency(userId, template, nonce);
                }
            }
            else {
                addUserNotifyFrequency(userId, template, nonce);
            }
        }
        return false;
    }

    @Override
    public void addUserNotifyFrequency(Long userId, NotificationTemplate template, String nonce) {
        String key = RedisConstants.getUserNotifyFrequencyKey(userId, template.getId(), nonce);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.opsForValue().increment(key);
        }
        else {
            LocalDateTime now = DateUtil.toLocalDateTime(new Date());
            LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(now);
            long between = LocalDateTimeUtil.between(now, endOfDay, ChronoUnit.SECONDS);
            redisTemplate.opsForValue().set(key, Long.valueOf("1"), between, TimeUnit.SECONDS);
        }
    }

    @Override
    public SocialNotifyContext buildSocialNotifyContext(String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            log.warn("Lost space id");
            return null;
        }
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (bindInfo == null || StrUtil.isBlank(bindInfo.getAppId())) {
            log.warn("space no bind social:{}", spaceId);
            return null;
        }
        SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(bindInfo.getAppId(), bindInfo.getTenantId());
        if (tenantEntity == null || !tenantEntity.getStatus()) {
            return null;
        }
        SocialAppType appType = SocialAppType.of(tenantEntity.getAppType());
        if (appType == null) {
            return null;
        }
        SocialPlatformType platform = SocialPlatformType.toEnum(tenantEntity.getPlatform());
        SocialNotifyContext context = new SocialNotifyContext();
        context.setAppId(tenantEntity.getAppId());
        context.setAppType(appType);
        context.setPlatform(platform);
        context.setTenantId(tenantEntity.getTenantId());
        String entryUrl = getSocialAppEntryUrl(bindInfo, platform, appType);
        if (StrUtil.isBlank(entryUrl)) {
            return null;
        }
        context.setEntryUrl(entryUrl);
        String agentId = getSocialAppAgentId(tenantEntity);
        if (StrUtil.isBlank(agentId)) {
            return null;
        }
        context.setAgentId(agentId);
        return context;
    }

    @Override
    public String getSocialAppEntryUrl(TenantBindDTO bindInfo, SocialPlatformType platform, SocialAppType appType) {
        if (platform.equals(SocialPlatformType.WECOM)) {
            if (appType.equals(SocialAppType.INTERNAL)) {
                return WeComCardFactory.WECOM_CALLBACK_PATH;
            }
            if (appType.equals(SocialAppType.ISV)) {
                return WeComIsvCardFactory.WECOM_ISV_LOGIN_PATH;
            }
        }
        if (platform.equals(SocialPlatformType.DINGTALK)) {
            if (appType.equals(SocialAppType.INTERNAL)) {
                return NotificationHelper.DINGTALK_ENTRY_URL;
            }
            if (appType.equals(SocialAppType.ISV)) {
                return NotificationHelper.DINGTALK_ISV_ENTRY_URL;
            }
        }
        if (platform.equals(SocialPlatformType.FEISHU)) {
            if (appType.equals(SocialAppType.ISV)) {
                return LarkConstants.ISV_ENTRY_URL;
            }
            if (appType.equals(SocialAppType.INTERNAL)) {
                AppInstanceEntity instance = iAppInstanceService.getInstanceBySpaceIdAndAppType(bindInfo.getSpaceId(),
                        AppType.LARK);
                if (instance == null) {
                    return null;
                }
                LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instance.getConfig());
                LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
                if (StrUtil.isBlank(profile.getAppKey())) {
                    return null;
                }
                if (!profile.getAppKey().equals(bindInfo.getAppId())) {
                    return null;
                }
                return LarkConstants.formatInternalEntryUrl(instance.getAppInstanceId());
            }
        }
        return null;
    }

    private String getSocialAppAgentId(SocialTenantEntity entity) {
        SocialPlatformType platform = SocialPlatformType.toEnum(entity.getPlatform());
        SocialAppType appType = SocialAppType.of(entity.getAppType());
        if (platform.equals(SocialPlatformType.WECOM)) {
            if (SocialAppType.ISV.equals(appType)) {
                Agent agent = JSONUtil.toBean(entity.getContactAuthScope(), Agent.class);
                return agent.getAgentId().toString();
            }
            return entity.getAppId();
        }
        if (platform.equals(SocialPlatformType.DINGTALK)) {
            if (SocialAppType.ISV.equals(appType)) {
                IsvAppProperty bizApp = iDingTalkInternalIsvService.getIsvAppConfig(entity.getAppId());
                return bizApp.getAppId();
            }
            if (SocialAppType.INTERNAL.equals(appType)) {
                return iDingTalkService.getAgentIdByAppIdAndTenantId(entity.getAppId(), entity.getTenantId());
            }
        }
        if (platform.equals(SocialPlatformType.FEISHU)) {
            return entity.getAppId();
        }
        return null;
    }
}

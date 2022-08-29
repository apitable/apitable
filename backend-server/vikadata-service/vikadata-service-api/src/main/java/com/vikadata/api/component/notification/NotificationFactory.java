package com.vikadata.api.component.notification;

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

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.player.PlayerType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.dto.player.PlayerBaseDto;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.model.vo.player.PlayerBaseVo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.constants.LarkConstants;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.event.wecom.WeComCardFactory;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantBindMapper;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.constants.NotificationConstants.INVOLVE_MEMBER_DETAIL;

/**
 * <p>
 * 通知模版工厂类
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/13 10:55 上午
 */
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

    /**
     * 根据模版ID获取templateInfo
     *
     * @param templateId 消息的模版ID
     * @return 消息体
     * @author zoe zheng
     * @date 2020/5/13 10:52 上午
     */
    @Override
    public NotificationTemplate getTemplateById(String templateId) {
        return SystemConfigManager.getConfig().getNotifications().getTemplates().get(templateId);
    }

    /**
     * 组装消息来源fromUser的数据
     *
     * @param fromUserId 消息来源的用户ID
     * @param spaceId 空间ID
     * @param renderMap 查出的数据
     * @return 用户的基本数据
     * @author zoe zheng
     * @date 2020/5/26 4:36 下午
     */
    @Override
    public PlayerBaseVo formatFromUser(Long fromUserId, String spaceId, NotificationRenderMap renderMap) {
        Long fromMemberId = renderMap.getFromUser().get(fromUserId.toString() + spaceId);
        if (ObjectUtil.isNotNull(renderMap.getMembers())) {
            return renderMap.getMembers().get(fromMemberId);
        }
        return null;
    }

    /**
     * 组装node数据
     *
     * @param node 节点基本信息
     * @return 节点的基本信息
     * @author zoe zheng
     * @date 2020/5/26 4:37 下午
     */
    @Override
    public NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node) {
        if (ObjectUtil.isNotNull(node)) {
            return NotificationDetailVo.Node.builder().nodeName(node.getNodeName()).nodeId(node.getNodeId())
                    .icon(node.getIcon()).build();
        }
        return null;
    }

    /**
     * 组装space的数据
     *
     * @param space 空间基本信息
     * @return 空间的基本信息
     * @author zoe zheng
     * @date 2020/5/26 4:42 下午
     */
    @Override
    public NotificationDetailVo.Space formatSpace(BaseSpaceInfoDto space) {
        if (ObjectUtil.isNotNull(space)) {
            return NotificationDetailVo.Space.builder().spaceId(space.getSpaceId()).spaceName(space.getName())
                    .logo(space.getLogo()).build();
        }
        return null;
    }

    /**
     * 判断消息发送需要统计次数的锁是否存在
     *
     * @param key redis的key
     * @param notificationId 消息通知的ID
     * @return 是否成功
     *
     * @author zoe zheng
     * @date 2020/5/26 5:39 下午
     */
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
            // 只有一条记录，加上record的限制
            if (recordIds != null && recordIds.size() == 1) {
                return RedisConstants.getNotificationLockedKey(templateId,
                        SecureUtil.md5(fromUserId + toUserId + nodeId + recordIds.get(0)));
            }
            return RedisConstants.getNotificationLockedKey(templateId, SecureUtil.md5(fromUserId + toUserId + nodeId));
        }


        return null;
    }

    /**
     * 从redis中获取消息ID
     *
     * @param key redis的消息延时的key
     * @return 通知ID
     * @author zoe zheng
     * @date 2020/5/26 7:18 下午
     */
    @Override
    public Long getNotificationIdFromRedis(String key) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return Long.valueOf(value.toString());
        }
        return null;
    }

    /**
     * 查找用户ID
     *
     * @param toUserIds 消息触达用户uuid
     * @return 消息触达用户ID
     * @author zoe zheng
     * @date 2020/5/27 10:54 上午
     */
    @Override
    public List<Long> getUserId(List<String> toUserIds) {
        if (CollUtil.isNotEmpty(toUserIds)) {
            return userMapper.selectIdByUuidList(toUserIds);
        }
        return null;
    }

    /**
     * 获取空间所有用户
     *
     * @param spaceId 空间ID
     * @return 空间用户ID
     * @author zoe zheng
     * @date 2020/5/27 10:58 上午
     */
    @Override
    public List<Long> getSpaceAllUserId(String spaceId) {
        return memberMapper.selectUserIdBySpaceId(spaceId);
    }

    /**
     * 获取空间管理员
     *
     * @param spaceId 空间ID
     * @return 空间管理员用户ID
     * @author zoe zheng
     * @date 2020/5/27 11:00 上午
     */
    @Override
    public List<Long> getSpaceAdminUserId(String spaceId) {
        return memberMapper.selectAdminUserIdBySpaceId(spaceId);
    }

    /**
     * 获取memberIds和spaceID对应的userId
     *
     * @param memberIds 成员ID
     * @param spaceId 空间id
     * @return memberId对应的用户ID
     * @author zoe zheng
     * @date 2020/5/27 11:02 上午
     */
    @Override
    public List<Long> getMemberUserId(List<Long> memberIds, String spaceId) {
        // 如果有空间ID,需要过滤下是否是空间内的成员
        if (StrUtil.isNotBlank(spaceId) && ObjectUtil.isNotEmpty(memberIds)) {
            return memberMapper.selectUserIdBySpaceIdAndIds(spaceId, memberIds);
        }
        return null;
    }

    /**
     * 获取成员呢称
     *
     * @param memberId 成员ID
     * @return 成员呢称
     * @author zoe zheng
     * @date 2020/5/28 4:02 下午
     */
    @Override
    public String getMemberName(Long memberId) {
        return memberMapper.selectMemberNameById(memberId);
    }

    /**
     * 统一消息处理的json
     *
     * @param object 对象
     * @return JSONObject
     * @author zoe zheng
     * @date 2020/6/17 2:07 下午
     */
    @SneakyThrows
    @Override
    public JSONObject getJsonObject(Object object) {
        if (ObjectUtil.isNotNull(object)) {
            return JSONUtil.parseObj(objectMapper.writeValueAsString(object));
        }
        return null;
    }

    /**
     * 构造返回的extras的数据
     *
     * @param extras notifyBody中的extras数据
     * @param members 成员信息map
     * @return JSONObject
     * @author zoe zheng
     * @date 2020/6/17 2:52 下午
     */
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

    /**
     * 获取关键字的信息
     *
     * @param dtos 通知数据
     * @return NotificationRenderMap
     * @author zoe zheng
     * @date 2020/6/17 7:07 下午
     */
    @Override
    public NotificationRenderMap getRenderList(List<NotificationModelDto> dtos) {
        NotificationRenderMap list = new NotificationRenderMap();
        // 节点ID的数组
        List<String> nodeIds = new ArrayList<>();
        // spaceId的数组
        List<String> spaceIds = new ArrayList<>();
        // 通知中的memberId数组
        List<Long> memberIds = new ArrayList<>();
        // 通知中的userID的数组
        List<Long> userIds = new ArrayList<>();
        Map<String, Long> fromUser = MapUtil.newHashMap();
        dtos.forEach(dto -> {
            spaceIds.add(dto.getSpaceId());
            nodeIds.add(dto.getNodeId());
            // 系统用户返回null
            if (dto.getFromUser() != 0) {
                Long memberId =
                        memberMapper.selectMemberIdByUserIdAndSpaceIdExcludeDelete(dto.getFromUser(), dto.getSpaceId());
                if (ObjectUtil.isNotNull(memberId)) {
                    memberIds.add(memberId);
                    fromUser.put(dto.getFromUser().toString() + dto.getSpaceId(), memberId);
                }
                else {
                    // 用户从来没有加入过此空间
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
                    .collect(Collectors.toMap(BaseSpaceInfoDto::getSpaceId, a -> a, (k1, k2) -> k1)));
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

    /**
     * 获取memberIds和spaceID对应的userId去除被删除的成员
     *
     * @param memberIds 成员ID
     * @return memberId对应的用户ID
     * @author zoe zheng
     * @date 2020/6/18 9:00 下午
     */
    @Override
    public List<Long> getMemberUserIdExcludeDeleted(List<Long> memberIds) {
        return memberMapper.selectUserIdsByMemberIds(memberIds);
    }

    /**
     * 获取空间主管理员
     *
     * @param spaceId 空间ID
     * @return 主管理员memberID
     * @author zoe zheng
     * @date 2020/6/22 4:25 下午
     */
    @Override
    public Long getSpaceSuperAdmin(String spaceId) {
        return spaceMapper.selectSpaceMainAdmin(spaceId);
    }

    /**
     * 根据模版ID获取触达用户标识
     *
     * @param templateId 模版ID
     * @return toUserTag
     * @author zoe zheng
     * @date 2020/7/9 11:12 上午
     */
    @Override
    public NotificationToTag getToUserTagByTemplateId(NotificationTemplateId templateId) {
        String toUserTag = getTemplateById(templateId.getValue()).getToTag();
        if (StrUtil.isNotBlank(toUserTag)) {
            return NotificationToTag.getValue(toUserTag);
        }
        return NotificationToTag.MEMBERS;
    }

    /**
     * 获取节点的parentID
     *
     * @param nodeId
     * @return parentID
     * @author zoe zheng
     * @date 2020/7/14 3:10 下午
     */
    @Override
    public String getNodeParentId(String nodeId) {
        return nodeMapper.selectParentIdByNodeId(nodeId);
    }

    /**
     * 根据memberIDs或者userIds获取需要的用户信息
     *
     * @param memberIds 成员ID
     * @param userIds 用户ID
     * @return
     * @author zoe zheng
     * @date 2020/10/13 11:44 上午
     */
    @Override
    public Map<Long, PlayerBaseVo> getPlayerBaseInfo(List<Long> memberIds, List<Long> userIds) {
        Map<Long, PlayerBaseVo> players = MapUtil.newHashMap();
        if (CollUtil.isNotEmpty(memberIds)) {
            List<PlayerBaseDto> members = memberMapper.selectMemberInfoByMemberIdsIncludeDelete(memberIds);
            players.putAll(members.stream().collect(Collectors.toMap(PlayerBaseDto::getMemberId, a -> PlayerBaseVo
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
        // 分批查询
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
                    // 增加需要发送的次数
                    addUserNotifyFrequency(userId, template, nonce);
                }
            }
            else {
                // 需要记录发送次数
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
            log.warn("通知参数缺少空间ID,IM通知不发送");
            return null;
        }
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (bindInfo == null || StrUtil.isBlank(bindInfo.getAppId())) {
            log.warn("空间未绑定IM:{}", spaceId);
            return null;
        }
        SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(bindInfo.getAppId(), bindInfo.getTenantId());
        if (tenantEntity == null || !tenantEntity.getStatus()) {
            log.warn("IM不存在或者未激活:{}", spaceId);
            return null;
        }
        SocialAppType appType = SocialAppType.of(tenantEntity.getAppType());
        if (appType == null) {
            log.warn("IM应用类型不存在:{}", tenantEntity.getTenantId());
            return null;
        }
        // 这里有异常，需要catch
        SocialPlatformType platform = SocialPlatformType.toEnum(tenantEntity.getPlatform());
        SocialNotifyContext context = new SocialNotifyContext();
        context.setAppId(tenantEntity.getAppId());
        context.setAppType(appType);
        context.setPlatform(platform);
        context.setTenantId(tenantEntity.getTenantId());
        String entryUrl = getSocialAppEntryUrl(bindInfo, platform, appType);
        if (StrUtil.isBlank(entryUrl)) {
            log.warn("IM的入口地址不存在:{}", spaceId);
            return null;
        }
        context.setEntryUrl(entryUrl);
        // 设置agentId
        String agentId = getSocialAppAgentId(tenantEntity);
        if (StrUtil.isBlank(agentId)) {
            log.warn("IM的AgentId不存在:{}", spaceId);
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
                // 飞书自建应用，查询应用对应的实例ID
                AppInstanceEntity instance = iAppInstanceService.getInstanceBySpaceIdAndAppType(bindInfo.getSpaceId(),
                        AppType.LARK);
                if (instance == null) {
                    log.warn("空间的飞书自建应用实例不存在");
                    return null;
                }
                LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instance.getConfig());
                LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
                if (StrUtil.isBlank(profile.getAppKey())) {
                    log.warn("飞书自建应用配置为空，不发送");
                    return null;
                }
                if (!profile.getAppKey().equals(bindInfo.getAppId())) {
                    log.warn("飞书自建应用配置应用Key不匹配，不发送");
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

/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.component.notification;

import static com.apitable.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.apitable.shared.constants.NotificationConstants.INVOLVE_MEMBER_DETAIL;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.player.dto.NotificationModelDTO;
import com.apitable.player.dto.PlayerBaseDTO;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.player.vo.PlayerBaseVo;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.sysconfig.notification.NotificationConfigLoader;
import com.apitable.shared.sysconfig.notification.NotificationTemplate;
import com.apitable.space.dto.BaseSpaceInfoDTO;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.mapper.UserMapper;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.dto.NodeExtraDTO;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.mapper.NodeDescMapper;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * notification factory.
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
    private NodeDescMapper nodeDescMapper;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Override
    public NotificationTemplate getTemplateById(String templateId) {
        return NotificationConfigLoader.getConfig().getTemplates().get(templateId);
    }

    @Override
    public PlayerBaseVo formatFromUser(Long fromUserId, String spaceId,
                                       NotificationRenderMap renderMap) {
        Long fromMemberId = renderMap.getFromUser().get(fromUserId.toString() + spaceId);
        if (ObjectUtil.isNotNull(renderMap.getMembers())) {
            return renderMap.getMembers().get(fromMemberId);
        }
        return null;
    }

    @Override
    public NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node) {
        if (ObjectUtil.isNotNull(node)) {
            return NotificationDetailVo.Node.builder().nodeName(node.getNodeName())
                .nodeId(node.getNodeId())
                .icon(node.getIcon()).build();
        }
        return null;
    }

    @Override
    public NotificationDetailVo.Space formatSpace(BaseSpaceInfoDTO space) {
        if (ObjectUtil.isNotNull(space)) {
            return NotificationDetailVo.Space.builder().spaceId(space.getSpaceId())
                .spaceName(space.getName())
                .logo(StrUtil.nullToEmpty(space.getLogo())).build();
        }
        return null;
    }

    @Override
    public boolean delayLock(String key, Long notificationId) {
        return Boolean.TRUE.equals(redisTemplate.opsForValue().setIfAbsent(key, notificationId,
            15000, TimeUnit.MILLISECONDS));
    }

    @Override
    public String getDelayLockKey(String toUserId, NotificationCreateRo ro) {
        String fromUserId = ro.getFromUserId();
        String nodeId = ro.getNodeId();
        String templateId = ro.getTemplateId();
        if (StrUtil.isNotBlank(fromUserId) && StrUtil.isNotBlank(toUserId)
            && StrUtil.isNotBlank(nodeId)) {
            Object extra = ro.getBody().getByPath(BODY_EXTRAS);
            JSONArray recordIds =
                NotificationHelper.getRecordIdsFromExtras(JSONUtil.parseObj(extra));
            if (recordIds != null && recordIds.size() == 1) {
                return RedisConstants.getNotificationLockedKey(templateId,
                    SecureUtil.md5(fromUserId + toUserId + nodeId + recordIds.get(0)));
            }
            return RedisConstants.getNotificationLockedKey(templateId,
                SecureUtil.md5(fromUserId + toUserId + nodeId));
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

    @Override
    public JSONObject formatExtra(JSONObject extras, Map<Long, PlayerBaseVo> members) {
        JSONArray memberIds = NotificationHelper.getMemberIdsFromExtras(extras);
        if (ObjectUtil.isNotNull(memberIds) && !memberIds.isEmpty()) {
            List<JSONObject> involvedMembers = new ArrayList<>();
            memberIds.forEach(memberId -> involvedMembers.add(
                JSONUtil.parseObj(members.get(Convert.toLong(memberId)), false)
            ));
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
                    memberMapper.selectMemberIdByUserIdAndSpaceIdIncludeDeleted(dto.getFromUser(),
                        dto.getSpaceId());
                if (ObjectUtil.isNotNull(memberId)) {
                    memberIds.add(memberId);
                    fromUser.put(dto.getFromUser().toString() + dto.getSpaceId(), memberId);
                } else {
                    userIds.add(dto.getFromUser());
                    fromUser.put(dto.getFromUser().toString() + dto.getSpaceId(),
                        dto.getFromUser());
                }
            }
            JSONArray memberIdArr = NotificationHelper
                .getMemberIdsFromExtras(
                    NotificationHelper.getExtrasFromNotifyBody(dto.getNotifyBody()));
            if (ObjectUtil.isNotNull(memberIdArr) && !memberIdArr.isEmpty()) {
                memberIds.addAll(ListUtil.toList(Convert.toLongArray(memberIdArr)));
            }
        });
        if (CollUtil.isNotEmpty(CollUtil.removeBlank(spaceIds))) {
            list.setSpaces(
                spaceMapper.selectBaseSpaceInfo(CollUtil.removeBlank(CollUtil.distinct(spaceIds)))
                    .stream()
                    .collect(
                        Collectors.toMap(BaseSpaceInfoDTO::getSpaceId, a -> a, (k1, k2) -> k1)));
        }
        List<String> distinctNodeIds = CollUtil.removeBlank(CollUtil.distinct(nodeIds));
        if (CollUtil.isNotEmpty(distinctNodeIds)) {
            List<NodeBaseInfoDTO> baseInfoDtos =
                nodeMapper.selectNodeBaseInfosByNodeIds(distinctNodeIds, true);
            Map<String, NodeBaseInfoDTO> nodes = baseInfoDtos.stream()
                .collect(Collectors.toMap(NodeBaseInfoDTO::getNodeId, a -> a, (k1, k2) -> k1));
            list.setNodes(nodes);
        }
        list.setMembers(
            getPlayerBaseInfo(CollUtil.distinct(memberIds), CollUtil.distinct(userIds)));
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
    public NotificationToTag getToUserTagByTemplateId(BaseTemplateId templateId) {
        Optional<NotificationTemplate> template =
            Optional.ofNullable(getTemplateById(templateId.getValue()));
        if (template.isPresent() && StrUtil.isNotBlank(template.get().getToTag())) {
            return NotificationToTag.getValue(template.get().getToTag());
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
            List<PlayerBaseDTO> members =
                memberMapper.selectMemberInfoByMemberIdsIncludeDelete(memberIds);
            players.putAll(members.stream()
                .collect(Collectors.toMap(PlayerBaseDTO::getMemberId, a -> PlayerBaseVo.builder()
                    .playerType(a.getIsMemberDeleted() ? PlayerType.MEMBER_DELETED.getType() :
                        PlayerType.MEMBER.getType())
                    .userName(StrUtil.nullToDefault(a.getUserName(), CharSequenceUtil.EMPTY))
                    .uuid(StrUtil.nullToDefault(a.getUuid(), CharSequenceUtil.EMPTY))
                    .avatar(StrUtil.nullToDefault(a.getAvatar(), CharSequenceUtil.EMPTY))
                    .email(StrUtil.nullToDefault(a.getEmail(), CharSequenceUtil.EMPTY))
                    .memberId(a.getMemberId())
                    .memberName(StrUtil.nullToDefault(a.getMemberName(), CharSequenceUtil.EMPTY))
                    .team(StrUtil.nullToDefault(a.getTeam(), CharSequenceUtil.EMPTY))
                    .avatarColor(ObjectUtil.defaultIfNull(a.getColor(), 1))
                    .nickName(StrUtil.nullToDefault(a.getNickName(), CharSequenceUtil.EMPTY))
                    .isNickNameModified(a.getIsNickNameModified())
                    .isMemberNameModified(a.getIsMemberNameModified())
                    .isDeleted(a.getIsMemberDeleted()).build(), (k1, k2) -> k1)));
        }
        if (CollUtil.isNotEmpty(userIds)) {
            List<UserEntity> users = userMapper.selectByIds(userIds);
            if (CollUtil.isNotEmpty(users)) {
                players.putAll(users.stream()
                    .collect(Collectors.toMap(UserEntity::getId,
                        a -> PlayerBaseVo.builder().playerType(PlayerType.VISITORS.getType())
                            .userName(
                                StrUtil.nullToDefault(a.getNickName(), CharSequenceUtil.EMPTY))
                            .isNickNameModified(Objects.isNull(a.getIsSocialNameModified())
                                || a.getIsSocialNameModified() != 0)
                            .uuid(StrUtil.nullToDefault(a.getUuid(), CharSequenceUtil.EMPTY))
                            .avatar(StrUtil.nullToDefault(a.getAvatar(), CharSequenceUtil.EMPTY))
                            .email(StrUtil.nullToDefault(a.getEmail(), CharSequenceUtil.EMPTY))
                            .isDeleted(true).build(),
                        (k1, k2) -> k1)));
            }
        }
        return players;
    }

    @Override
    public Boolean frequencyLimited(Long userId, NotificationTemplate template, String nonce) {
        if (template.getFrequency() != null) {
            String key = RedisConstants.getUserNotifyFrequencyKey(userId, template.getId(), nonce);
            if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
                Object frequency = redisTemplate.opsForValue().get(key);
                if (frequency != null
                    && Long.parseLong(frequency.toString()) <= template.getFrequency()) {
                    return true;
                } else {
                    addUserNotifyFrequency(userId, template, nonce);
                }
            } else {
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
        } else {
            LocalDateTime now = ClockManager.me().getLocalDateTimeNow();
            LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(now);
            long between = LocalDateTimeUtil.between(now, endOfDay, ChronoUnit.SECONDS);
            redisTemplate.opsForValue().set(key, Long.valueOf("1"), between, TimeUnit.SECONDS);
        }
    }

    @Override
    public SpaceNotificationInfo.NodeInfo getNodeInfo(String nodeId) {
        SpaceNotificationInfo.NodeInfo nodeInfo = new SpaceNotificationInfo.NodeInfo();
        nodeInfo.setNodeId(nodeId);
        NodeEntity node = nodeMapper.selectByNodeId(nodeId);
        if (null == node) {
            return nodeInfo;
        }
        nodeInfo.setNodeName(node.getNodeName());
        nodeInfo.setIcon(node.getIcon());
        nodeInfo.setCover(node.getCover());
        nodeInfo.setParentId(node.getParentId());
        nodeInfo.setDescription(nodeDescMapper.selectDescriptionByNodeId(nodeId));
        nodeInfo.setPreNodeId(node.getPreNodeId());
        nodeInfo.setNodeShared(nodeShareSettingMapper.selectIsEnabledByNodeId(nodeId));
        NodeExtraDTO nodeExtraDTO = JSONUtil.toBean(node.getExtra(), NodeExtraDTO.class);
        if (nodeExtraDTO != null && nodeExtraDTO.getShowRecordHistory() != null) {
            nodeInfo.setShowRecordHistory(
                Integer.parseInt(nodeExtraDTO.getShowRecordHistory().toString()));
        }
        return nodeInfo;
    }
}

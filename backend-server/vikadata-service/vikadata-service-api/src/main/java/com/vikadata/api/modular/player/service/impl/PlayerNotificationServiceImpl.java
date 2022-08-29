package com.vikadata.api.modular.player.service.impl;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.comparator.CompareUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.net.url.UrlPath;
import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.cursor.Cursor;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.component.ClientEntryTemplateConfig;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationFactory;
import com.vikadata.api.component.notification.NotificationHelper;
import com.vikadata.api.component.notification.NotificationRenderMap;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.component.notification.NotificationToTag;
import com.vikadata.api.config.properties.ClientProperties;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.constants.NotificationConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.exception.NotificationException;
import com.vikadata.api.event.NotificationCreateEvent;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.ro.player.NotificationListRo;
import com.vikadata.api.model.ro.player.NotificationPageRo;
import com.vikadata.api.model.ro.player.NotificationRevokeRo;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.model.vo.player.NotificationStatisticsVo;
import com.vikadata.api.model.vo.player.PlayerBaseVo;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.player.mapper.PlayerNotificationMapper;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.api.modular.space.service.ISpaceMemberRoleRelService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.PlayerNotificationEntity;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static cn.hutool.core.date.DatePattern.NORM_DATETIME_MINUTE_PATTERN;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_CREATED_AT;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_DATASHEET_URL;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_MEMBER_NAME;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_NODE_NAME;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_RECORD_ID;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_RECORD_URL;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_SPACE_NAME;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_URL;
import static com.vikadata.api.constants.NotificationConstants.EMAIL_VIEW_ID;
import static com.vikadata.api.constants.NotificationConstants.EXPIRE_AT;
import static com.vikadata.api.constants.NotificationConstants.INVOLVE_RECORD_IDS;
import static com.vikadata.api.constants.NotificationConstants.VERSION;

/**
 * <p>
 * 通知Notification表 服务实现类
 * </p>
 *
 * @author Zoe Zheng
 * @since 2020-05-12
 */
@Service
@Slf4j
public class PlayerNotificationServiceImpl extends ServiceImpl<PlayerNotificationMapper, PlayerNotificationEntity>
        implements IPlayerNotificationService {

    public static final Integer NOTIFY_LIMIT = 100;

    @Resource
    private ClientEntryTemplateConfig clientTemplateConfig;

    @Resource
    private NotificationFactory notificationFactory;

    @Resource
    private ClientProperties clientProperties;

    @Resource
    private ISpaceMemberRoleRelService spaceMemberRoleRelService;

    @Resource
    private ISpaceRoleService spaceRoleService;

    @Resource
    private IClientReleaseVersionService clientReleaseVersionService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IUserService iUserService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IMemberService iMemberService;

    /**
     * 创建通知记录
     *
     * @param notificationCreateRoList 创建通知参数
     * @return 是否创建成功
     * @author zoe zheng
     * @date 2020/5/12 4:49 下午
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchCreateNotify(List<NotificationCreateRo> notificationCreateRoList) {
        try {
            notificationCreateRoList.forEach(this::createNotify);
            return true;
        }
        catch (Exception e) {
            log.error("批量创建通知异常：", e);
            return false;
        }
    }

    /**
     * 创建通知记录，发送通知
     *
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:27 下午
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createNotify(NotificationCreateRo ro) {
        NotificationTemplate template = notificationFactory.getTemplateById(ro.getTemplateId());
        NotificationToTag toTag = NotificationToTag.getValue(template.getToTag());
        ExceptionUtil.isNotNull(toTag, NotificationException.TMPL_TO_TAG_ERROR);
        if (NotificationToTag.toUserTag(toTag)) {
            return createUserNotify(template, ro);
        }
        if (NotificationToTag.toMemberTag(toTag)) {
            return createMemberNotify(template, ro, toTag);
        }
        if (NotificationToTag.toAllUserTag(toTag)) {
            return createAllUserNotify(template, ro);
        }
        return true;
    }

    @Override
    public boolean createUserNotify(NotificationTemplate template, NotificationCreateRo ro) {
        List<String> toUserIds = CollUtil.removeBlank(CollUtil.distinct(ro.getToUserId()));
        if (CollUtil.isEmpty(toUserIds)) {
            throw new BusinessException(NotificationException.USER_EMPTY_ERROR);
        }
        return createNotifyWithoutVerify(ListUtil.toList(Convert.toLongArray(toUserIds)), template, ro);
    }

    @Override
    public boolean createMemberNotify(NotificationTemplate template, NotificationCreateRo ro, NotificationToTag toTag) {
        List<Long> userIds;
        // 目前空间用户不多上限500
        if (NotificationTemplateId.spaceDeleteNotify(NotificationTemplateId.getValue(ro.getTemplateId()))) {
            userIds = CollUtil.toList(Convert.toLongArray(ro.getToUserId()));
        }
        else {
            List<Long> toMemberIds = CollUtil.newArrayList();
            if (CollUtil.isNotEmpty(ro.getToMemberId())) {
                toMemberIds.addAll(CollUtil.removeBlank(CollUtil.distinct(ro.getToMemberId())).stream().map(Long::valueOf).collect(Collectors.toList()));
            }
            if (CollUtil.isNotEmpty(ro.getToUnitId())) {
                List<Long> unitIds =
                        CollUtil.removeBlank(CollUtil.distinct(ro.getToUnitId())).stream().map(Long::valueOf).collect(Collectors.toList());
                toMemberIds.addAll(iUnitService.getMembersIdByUnitIds(unitIds));
            }
            userIds = getSpaceUserIdByMemberIdAndToTag(ro.getSpaceId(), toMemberIds, toTag);
        }
        ExceptionUtil.isNotEmpty(userIds, NotificationException.USER_EMPTY_ERROR);
        // 数表成员的通知
        if (NotificationTemplateId.recordNotify(NotificationTemplateId.getValue(ro.getTemplateId()))) {
            return createMemberMentionedNotify(userIds, template, ro);
        }
        return createNotifyWithoutVerify(userIds, template, ro);
    }

    /**
     * 创建系统通知
     * 用了curson游标查询，防止每次查询连接关闭，加上@Transactional控制
     * @param template 通知模版
     * @param ro 创建通知参数
     * @return boolean
     * @author zoe zheng
     * @date 2021/3/4 4:40 下午
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createAllUserNotify(NotificationTemplate template, NotificationCreateRo ro) {
        Cursor<Long> userIdCursor = null;
        try {
            userIdCursor = userMapper.selectAllUserIdByIgnoreDelete(false);
            List<Long> userIds = CollUtil.newArrayList();
            userIdCursor.forEach(userId -> {
                if (userIds.size() < NOTIFY_LIMIT) {
                    userIds.add(userId);
                }
                if (userIds.size() == NOTIFY_LIMIT) {
                    createNotifyWithoutVerify(userIds, template, ro);
                    userIds.clear();
                }
            });
            // 最终结果小于1000或者开始就小于1000
            if (CollUtil.isNotEmpty(userIds)) {
                createNotifyWithoutVerify(userIds, template, ro);
            }
        }
        catch (Exception e) {
            log.error("创建通知异常", e);
            return false;
        }
        finally {
            if (ObjectUtil.isNotNull(userIdCursor)) {
                try {
                    userIdCursor.close();
                }
                catch (IOException e) {
                    log.error("创建通知关闭游标异常", e);
                }
            }
        }
        return true;
    }

    @Override
    public boolean createNotifyWithoutVerify(List<Long> userIds, NotificationTemplate template, NotificationCreateRo ro) {
        // todo 消息中间键
        List<PlayerNotificationEntity> creatEntities = new ArrayList<>();
        List<PlayerNotificationEntity> notifyEntities = new ArrayList<>();
        List<Long> mailUserIds = new ArrayList<>();
        for (Long userId : userIds) {
            // 记录发送频率，并且判断，这里没有发送成功就记录了是因为数据可恢复--redis删除key
            String nonce = StrUtil.blankToDefault(ro.getSpaceId(), "") + StrUtil.blankToDefault(ro.getNodeId(), "");
            if (!notificationFactory.frequencyLimited(userId, template, DigestUtil.md5Hex(nonce))) {
                if (ObjectUtil.isNotNull(userId) && !userId.equals(Convert.toLong(ro.getFromUserId()))) {
                    PlayerNotificationEntity entity = getCreateEntity(userId, template, ro);
                    // 发送通知并且建立记录
                    if (template.isNotification()) {
                        creatEntities.add(entity);
                    }
                    // 需要发送邮件
                    if (template.isMail() && StrUtil.isNotBlank(template.getMailTemplateSubject())) {
                        mailUserIds.add(userId);
                    }
                    notifyEntities.add(entity);
                }
            }
        }
        // 异步发送邮件通知
        if (!mailUserIds.isEmpty()) {
            TaskManager.me().execute(() -> sendMailNotifyBatch(template, mailUserIds, formatEmailDetailVo(ro)));
        }
        return createBatch(notifyEntities, creatEntities);
    }

    @Override
    public boolean createMemberMentionedNotify(List<Long> toUserIds, NotificationTemplate template, NotificationCreateRo ro) {
        List<PlayerNotificationEntity> notifyEntities = new ArrayList<>();
        Map<Long, String> notifyIdMap = new HashMap<>(toUserIds.size());
        List<Long> mailUserIds = new ArrayList<>();
        for (Long userId : toUserIds) {
            String delayKey = notificationFactory.getDelayLockKey(userId.toString(), ro);
            ExceptionUtil.isNotNull(delayKey, NotificationException.MEMBER_MENTIONED_ERROR);
            // 满足延迟条件
            PlayerNotificationEntity entity = getCreateEntity(userId, template, ro);
            // 在15s之内，次数+1 不通知 update
            if (!notificationFactory.delayLock(delayKey, entity.getId())) {
                Long notifyId = notificationFactory.getNotificationIdFromRedis(delayKey);
                String notifyBody = NotificationHelper.getMentionBody(baseMapper.selectNotifyBodyById(notifyId), ro.getBody());
                baseMapper.updateNotifyBodyById(notifyId, notifyBody);
            }
            else {
                entity.setNotifyBody(NotificationHelper.getMentionBody(JSONUtil.toJsonStr(ro.getBody()), null));
                notifyEntities.add(entity);
                notifyIdMap.put(userId, entity.getId().toString());
                // 需要发送邮件
                if (template.isMail() && StrUtil.isNotBlank(template.getMailTemplateSubject())) {
                    mailUserIds.add(userId);
                }
            }
        }
        // 需要关联传入ID和数据库中的ID，放入redis中
        if (StrUtil.isNotBlank(ro.getNotifyId()) && !notifyIdMap.isEmpty()) {
            String key = RedisConstants.getNotifyTemporaryKey(ro.getNotifyId());
            redisTemplate.opsForHash().putAll(key, notifyIdMap);
            redisTemplate.expire(key, 7, TimeUnit.DAYS);
        }
        // 异步发送邮件通知
        if (!mailUserIds.isEmpty()) {
            TaskManager.me().execute(() -> sendMailNotifyBatch(template, mailUserIds, formatEmailDetailVo(ro)));
        }
        return createBatch(notifyEntities);
    }

    @Override
    public List<NotificationDetailVo> pageList(NotificationPageRo notificationPageRo, LoginUserDto toUser) {
        Integer totalCount = baseMapper.selectTotalCountByRoAndToUser(notificationPageRo, toUser.getUserId()) + 1;
        if (null == notificationPageRo.getRowNo()) {
            // 倒着排列
            notificationPageRo.setRowNo(totalCount);
        }
        List<NotificationModelDto> dtos =
                baseMapper.selectPlayerNotificationPage(notificationPageRo, toUser.getUserId(), totalCount);
        return formatDetailVos(dtos, toUser.getUuid());
    }

    @Override
    public List<NotificationDetailVo> list(NotificationListRo ro, LoginUserDto toUser) {
        List<NotificationDetailVo> notificationRecordList = new ArrayList<>();
        List<NotificationModelDto> dtos = getUserNotificationByTypeAndIsRead(toUser.getUserId(), ro.getIsRead());
        if (CollUtil.isEmpty(dtos)) {
            return notificationRecordList;
        }
        dtos = dtos.stream().filter(dto -> {
            if (ro.getIsRead() == 1) {
                return true;
            }
            // 检查过期
            JSONObject extraInfo =
                    NotificationHelper.getExtrasFromNotifyBody(dto.getNotifyBody());
            if (ObjectUtil.isNull(extraInfo)) {
                return false;
            }
            if (extraInfo.containsKey(VERSION) && ObjectUtil.isNotNull(extraInfo.get(VERSION))) {
                return clientReleaseVersionService.isMoreThanClientVersion(extraInfo.get(VERSION).toString());
            }
            if (extraInfo.containsKey(EXPIRE_AT) && ObjectUtil.isNotNull(extraInfo.get(EXPIRE_AT))) {
                return CompareUtil.compare(extraInfo.get(EXPIRE_AT).toString(), String.valueOf(System.currentTimeMillis())) > 0;
            }
            return false;
        }).collect(Collectors.toList());
        return formatDetailVos(dtos, toUser.getUuid());
    }

    @Override
    public List<NotificationModelDto> getUserNotificationByTypeAndIsRead(Long toUser, Integer isRead) {
        return baseMapper.selectDtoByTypeAndIsRead(toUser, isRead);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean revokeNotification(NotificationRevokeRo ro) {
        NotificationTemplate template = notificationFactory.getTemplateById(ro.getTemplateId());
        if (CollUtil.isNotEmpty(ro.getUuid())) {
            List<Long> userIds = userMapper.selectIdByUuidList(ro.getUuid());
            return SqlHelper.retBool(baseMapper.updateBatchByUserIdsAndTemplateId(userIds,
                    template.getNotificationsType(), ro.getTemplateId(), ro));
        }
        // 因为此操作为非并发性操作，所以采用游标查询,返回Cursor对象防止数据量大内存oom
        return revokeAllUserNotification(template, ro);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean revokeAllUserNotification(NotificationTemplate template,
            NotificationRevokeRo ro) {
        // 因为此操作为非并发性操作，所以采用游标查询,返回Cursor对象防止数据量大内存oom
        Cursor<Long> userIdCursor = null;
        try {
            userIdCursor = userMapper.selectAllUserIdByIgnoreDelete(true);
            List<Long> userIds = CollUtil.newArrayList();
            userIdCursor.forEach(userId -> {
                if (userIds.size() < NOTIFY_LIMIT) {
                    userIds.add(userId);
                }
                if (userIds.size() == NOTIFY_LIMIT) {
                    baseMapper.updateBatchByUserIdsAndTemplateId(userIds,
                            template.getNotificationsType(), ro.getTemplateId(), ro);
                    userIds.clear();
                }
            });
            // 最终结果小于1000或者开始就小于1000
            if (CollUtil.isNotEmpty(userIds)) {
                baseMapper.updateBatchByUserIdsAndTemplateId(userIds,
                        template.getNotificationsType(), ro.getTemplateId(), ro);
            }
        }
        catch (Exception e) {
            log.error("删除用户通知异常", e);
            return false;
        }
        finally {
            if (userIdCursor != null) {
                try {
                    userIdCursor.close();
                }
                catch (IOException e) {
                    log.error("撤销通知关闭游标异常", e);
                }
            }
        }
        return true;
    }

    @Override
    public void sendMailNotifyBatch(NotificationTemplate template, List<Long> userIds, Dict dict) {
        List<UserLangDTO> emailsWithLang = iUserService.getLangAndEmailByIds(userIds, LocaleContextHolder.getLocale().toLanguageTag());
        List<MailWithLang> tos = emailsWithLang.stream()
                .filter(i -> StrUtil.isNotBlank(i.getEmail()))
                .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                .collect(Collectors.toList());
        if (CollUtil.isNotEmpty(tos)) {
            NotifyMailFactory.me().sendMail(template.getMailTemplateSubject(), dict, dict, tos);
        }
    }

    /**
     * 组装返回给客户端的数据
     *
     * @param dtos 通知的基本内容
     * @param uuid 用户的uuid
     * @return 消息具体内容
     * @author zoe zheng
     * @date 2020/5/23 7:52 下午
     */
    @Override
    public List<NotificationDetailVo> formatDetailVos(List<NotificationModelDto> dtos, String uuid) {
        List<NotificationDetailVo> notificationRecordList = new ArrayList<>();
        NotificationRenderMap renderField = notificationFactory.getRenderList(dtos);
        dtos.forEach(dto -> {
            NotificationDetailVo detailVo = NotificationDetailVo.builder().id(dto.getId().toString())
                    .rowNo(dto.getRowNo()).toUserId(uuid).toUuid(uuid).createdAt(dto.getCreatedAt())
                    .updatedAt(dto.getUpdatedAt()).isRead(dto.getIsRead()).notifyType(dto.getNotifyType())
                    .templateId(dto.getTemplateId())
                    .fromUser(notificationFactory.formatFromUser(dto.getFromUser(), dto.getSpaceId(), renderField)).build();
            detailVo.setNotifyBody(formatNotificationDetailBodyVo(dto, renderField));
            notificationRecordList.add(detailVo);
        });
        return notificationRecordList;
    }

    /**
     * 设置通知已读
     *
     * @param ids 通知的ID
     * @param isAll 是否全部
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/25 3:52 下午
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean setNotificationIsRead(String[] ids, Integer isAll) {
        Long userId = SessionContext.getUserId();
        if (ArrayUtil.isNotEmpty(ids)) {
            // 可能是通过邮件跳转,需要在redis中找出具体的ID，再标记为已读
            String key = RedisConstants.getNotifyTemporaryKey(ids[0]);
            if (Boolean.TRUE.equals(redisTemplate.opsForHash().hasKey(key, userId)) && !NumberUtil.isLong(ids[0])) {
                Object notifyId = redisTemplate.opsForHash().get(key, userId);
                String[] realIds = { ObjectUtil.toString(notifyId) };
                redisTemplate.opsForHash().delete(key, userId);
                return baseMapper.updateReadIsTrueByIds(realIds);
            }
            if (NumberUtil.isLong(ids[0])) {
                return baseMapper.updateReadIsTrueByIds(ids);
            }
        }
        else if (isAll != 0) {
            return baseMapper.updateReadIsTrueByUserId(userId);
        }
        return true;
    }

    /**
     * 用户消息统计
     *
     * @param userId 当前登陆用户ID
     * @return 统计的信息
     * @author zoe zheng
     * @date 2020/5/25 4:52 下午
     */
    @Override
    public NotificationStatisticsVo statistic(Long userId) {
        Integer readCount = baseMapper.selectCountByUserIdAndIsRead(userId, 1);
        Integer totalCount = baseMapper.selectTotalCountByUserId(userId);
        return NotificationStatisticsVo.builder().readCount(readCount).totalCount(totalCount)
                .unReadCount(totalCount - readCount).build();
    }

    /**
     * 删除消息
     *
     * @param ids 消息通知的ID数组
     * @return 是否成功
     * @author zoe zheng
     * @date 2020/5/25 5:01 下午
     */
    @Override
    public boolean setDeletedIsTrue(String[] ids) {
        return baseMapper.deleteNotificationByIds(ids);
    }

    @Override
    public boolean createBatch(List<PlayerNotificationEntity> notifyEntities,
            List<PlayerNotificationEntity> createEntities) {
        if (CollUtil.isNotEmpty(notifyEntities)) {
            SpringContextHolder.getApplicationContext().publishEvent(new NotificationCreateEvent(this, notifyEntities));
            // 先发再存，如果有key就更新，会导致消息条数和总的条数不统一,所以如果有key就不发消息,只是增加条数
        }
        if (CollUtil.isNotEmpty(createEntities)) {
            return SqlHelper.retBool(baseMapper.insertBatch(createEntities));
        }
        return true;
    }

    @Override
    public boolean createBatch(List<PlayerNotificationEntity> notifyEntities) {
        return createBatch(notifyEntities, notifyEntities);
    }

    @Override
    public boolean modifyMentionTimes(Long id, String notifyBody, JSONObject body) {
        return baseMapper.updateNotifyBodyById(id, NotificationHelper.getMentionBody(notifyBody, body));
    }

    private List<Long> getSpaceUserIdByMemberIdAndToTag(String spaceId,
            List<Long> memberIds, NotificationToTag toTag) {
        if (toTag.equals(NotificationToTag.MEMBERS)) {
            ExceptionUtil.isNotEmpty(memberIds, NotificationException.MEMBER_EMPTY_ERROR);
            return notificationFactory.getMemberUserId(memberIds, spaceId);
        }
        if (toTag.equals(NotificationToTag.ALL_MEMBERS)) {
            return notificationFactory.getSpaceAllUserId(spaceId);
        }
        if (toTag.equals(NotificationToTag.SPACE_ADMINS)) {
            return notificationFactory.getMemberUserId(spaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId), spaceId);
        }
        if (toTag.equals(NotificationToTag.SPACE_MEMBER_ADMINS)) {
            List<Long> memberAdminIds = spaceMemberRoleRelService.getMemberId(spaceId,
                    ListUtil.toList(NotificationConstants.TO_MANAGE_MEMBER_RESOURCE_CODE));
            memberAdminIds.add(notificationFactory.getSpaceSuperAdmin(spaceId));
            if (CollUtil.isNotEmpty(memberAdminIds)) {
                return notificationFactory.getMemberUserIdExcludeDeleted(memberAdminIds);
            }
        }
        if (toTag.equals(NotificationToTag.SPACE_MAIN_ADMIN)) {
            Long mainMemberId = notificationFactory.getSpaceSuperAdmin(spaceId);
            return notificationFactory.getMemberUserId(Collections.singletonList(mainMemberId), spaceId);
        }
        return null;
    }


    private PlayerNotificationEntity getCreateEntity(Long toUserId,
            NotificationTemplate template, NotificationCreateRo ro) {
        return PlayerNotificationEntity.builder()
                .id(IdWorker.getId())
                .fromUser(Convert.toLong(ro.getFromUserId()))
                .toUser(toUserId)
                .templateId(template.getId())
                .notifyBody(JSONUtil.toJsonStr(ro.getBody()))
                .spaceId(ro.getSpaceId())
                .nodeId(ro.getNodeId())
                .notifyType(template.getNotificationsType())
                .build();
    }

    /**
     * 组装notifyBody的数据
     *
     * @param dto 消息的基本内容
     * @param renderMap 消息模版渲染的map
     * @return 通知具体内容的的body
     * @author zoe zheng
     * @date 2020/5/23 7:53 下午
     */
    private NotificationDetailVo.NotifyBody formatNotificationDetailBodyVo(NotificationModelDto dto,
            NotificationRenderMap renderMap) {
        JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(dto.getNotifyBody());
        NotificationDetailVo.NotifyBody notifyBody = NotificationDetailVo.NotifyBody.builder()
                .title(dto.getTemplateId()).extras(notificationFactory.formatExtra(extras, renderMap.getMembers())).build();
        if (ObjectUtil.isNotNull(dto.getNodeId())) {
            notifyBody.setNode(notificationFactory.formatNode(renderMap.getNodes().get(dto.getNodeId())));
        }
        if (ObjectUtil.isNotNull(dto.getSpaceId())) {
            notifyBody.setSpace(notificationFactory.formatSpace(renderMap.getSpaces().get(dto.getSpaceId())));
        }
        // 模版field
        NotificationTemplate template = notificationFactory.getTemplateById(dto.getTemplateId());
        if (template == null) {
            return notifyBody;
        }
        // 服务端渲染
        if (!template.isComponent()) {
            Map<String, Object> templateRenderMap = MapUtil.newHashMap();
            if (ObjectUtil.isNotNull(extras)) {
                templateRenderMap.putAll(NotificationHelper.addExtrasToRenderMap(extras));
            }
            if (ObjectUtil.isNotNull(notifyBody.getNode())) {
                templateRenderMap.putAll(BeanUtil.beanToMap(notifyBody.getNode()));
            }
            if (ObjectUtil.isNotNull(notifyBody.getSpace())) {
                templateRenderMap.putAll(BeanUtil.beanToMap(notifyBody.getSpace()));
            }
            PlayerBaseVo fromPlayer =
                    notificationFactory.formatFromUser(dto.getFromUser(), dto.getSpaceId(), renderMap);
            if (ObjectUtil.isNotNull(fromPlayer)) {
                templateRenderMap.putAll(BeanUtil.beanToMap(fromPlayer));
            }
            templateRenderMap.put(NotificationConstants.URL_HOST_TAG, clientProperties.getDatasheet().getHost());
            // 模版str
            String templateStr = NotificationHelper.getTemplateString(template.getFormatString(),
                    NotificationHelper.getUserLanguageType(dto.getToUser(), dto.getFromUser()));
            notifyBody.setTemplate(clientTemplateConfig.render(templateStr, templateRenderMap));
            // 渲染url
            if (template.getUrl() != null) {
                notifyBody.setIntent(NotificationDetailVo.Intent.builder()
                        .url(clientTemplateConfig.render(template.getUrl(), templateRenderMap)).build());
            }
        }
        return notifyBody;
    }

    private Dict formatEmailDetailVo(NotificationCreateRo ro) {
        NotificationTemplate template = notificationFactory.getTemplateById(ro.getTemplateId());
        Dict dict = Dict.create();
        dict.set("YEARS", LocalDate.now().getYear());
        if (ObjectUtil.isNotNull(ro.getSpaceId())) {
            dict.set(EMAIL_SPACE_NAME, StrUtil.blankToDefault(iSpaceService.getNameBySpaceId(ro.getSpaceId()), ""));
        }
        long fromUserId = Long.parseLong(ro.getFromUserId());
        if (fromUserId > 0) {
            String memberName = StrUtil.blankToDefault(iMemberService.getMemberNameByUserIdAndSpaceId(fromUserId,
                    ro.getSpaceId()), VikaStrings.t("unnamed"));
            dict.set(EMAIL_MEMBER_NAME, memberName);
        }
        if (ObjectUtil.isNotNull(ro.getBody())) {
            JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(ro.getBody());
            if (extras != null) {
                extras.forEach((k, v) -> {
                    // 处理时间戳
                    if (StrUtil.endWith(k, "At")) {
                        LocalDateTime dateTime = DateUtil.toLocalDateTime(Instant.ofEpochMilli(Long.parseLong(v.toString())));
                        dict.set(StrUtil.toUnderlineCase(k).toUpperCase(), DateUtil.format(dateTime,
                                NORM_DATETIME_MINUTE_PATTERN));
                    }
                    else if (Objects.equals(k, INVOLVE_RECORD_IDS)) {
                        dict.set(EMAIL_RECORD_ID, JSONUtil.parseArray(v).get(0));
                    }
                    else {
                        dict.set(StrUtil.toUnderlineCase(k).toUpperCase(), v);
                    }
                });
            }
        }
        if (ObjectUtil.isNotNull(ro.getNodeId())) {
            dict.set(EMAIL_NODE_NAME, StrUtil.blankToDefault(iNodeService.getNodeNameByNodeId(ro.getNodeId()), ""));
            if (StrUtil.isNotBlank(template.getUrl()) && template.isCanJump()) {
                StringBuilder notifyUr = new StringBuilder();
                notifyUr.append(constProperties.getServerDomain());
                // 路径
                UrlPath notifyPath = UrlPath.of(template.getUrl(), CharsetUtil.CHARSET_UTF_8);
                notifyPath.add(ro.getNodeId());
                if (dict.containsKey(EMAIL_RECORD_ID) && dict.containsKey(EMAIL_VIEW_ID)) {
                    notifyPath.add(dict.get(EMAIL_VIEW_ID).toString());
                    notifyPath.add(dict.get(EMAIL_RECORD_ID).toString());
                    notifyUr.append(notifyPath.build(CharsetUtil.CHARSET_UTF_8));
                    UrlQuery notifyQuery = new UrlQuery();
                    if (NotificationTemplateId.SINGLE_RECORD_COMMENT_MENTIONED.getValue().equals(ro.getTemplateId())) {
                        notifyQuery.add("comment", 1);
                    }
                    if (StrUtil.isNotBlank(ro.getNotifyId())) {
                        notifyQuery.add("notifyId", ro.getNotifyId());
                    }
                    notifyUr.append('?').append(notifyQuery.build(CharsetUtil.CHARSET_UTF_8));
                    dict.set(EMAIL_RECORD_URL, notifyUr.toString());
                    dict.set(EMAIL_URL, notifyUr.toString());
                    dict.set(EMAIL_CREATED_AT,
                            LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MINUTE_PATTERN)));
                }
                else {
                    dict.set(EMAIL_DATASHEET_URL, notifyUr.toString());
                }
            }
        }
        return dict;
    }
}

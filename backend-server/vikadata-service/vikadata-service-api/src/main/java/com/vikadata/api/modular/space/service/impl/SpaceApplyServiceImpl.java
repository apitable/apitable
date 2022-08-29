package com.vikadata.api.modular.space.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.space.SpaceApplyStatus;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.space.SpaceApplyDto;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.player.mapper.PlayerNotificationMapper;
import com.vikadata.api.modular.space.mapper.SpaceApplyMapper;
import com.vikadata.api.modular.space.service.ISpaceApplyService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SpaceApplyEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.component.notification.NotificationTemplateId.SPACE_JOIN_APPLY_APPROVED;
import static com.vikadata.api.component.notification.NotificationTemplateId.SPACE_JOIN_APPLY_REFUSED;
import static com.vikadata.api.constants.NotificationConstants.APPLY_ID;
import static com.vikadata.api.constants.NotificationConstants.APPLY_STATUS;
import static com.vikadata.api.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.enums.exception.SpaceApplyException.APPLY_DUPLICATE;
import static com.vikadata.api.enums.exception.SpaceApplyException.APPLY_EXPIRED_OR_PROCESSED;
import static com.vikadata.api.enums.exception.SpaceApplyException.APPLY_NOTIFICATION_ERROR;
import static com.vikadata.api.enums.exception.SpaceApplyException.APPLY_NOT_EXIST;
import static com.vikadata.api.enums.exception.SpaceApplyException.APPLY_SWITCH_CLOSE;
import static com.vikadata.api.enums.exception.SpaceApplyException.EXIST_MEMBER;
import static com.vikadata.api.enums.exception.SpacePermissionException.INSUFFICIENT_PERMISSIONS;

/**
 * <p>
 * 工作空间-申请表 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/10/29
 */
@Slf4j
@Service
public class SpaceApplyServiceImpl implements ISpaceApplyService {

    @Resource
    private SpaceApplyMapper spaceApplyMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private PlayerNotificationMapper playerNotificationMapper;

    @Override
    public Long create(Long userId, String spaceId) {
        log.info("创建申请记录，userId:{},spaceId:{}", userId, spaceId);
        // 校验空间是否存在
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(Boolean.TRUE.equals(feature.getJoinable()), APPLY_SWITCH_CLOSE);
        // 校验用户是否已申请
        int count = SqlTool.retCount(spaceApplyMapper.countBySpaceIdAndCreatedByAndStatus(userId, spaceId, SpaceApplyStatus.PENDING.getStatus()));
        ExceptionUtil.isTrue(count == 0, APPLY_DUPLICATE);
        // 校验用户是否已存在该空间中
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        ExceptionUtil.isNull(memberId, EXIST_MEMBER);
        SpaceApplyEntity entity = SpaceApplyEntity.builder()
                .id(IdWorker.getId())
                .spaceId(spaceId)
                .status(SpaceApplyStatus.PENDING.getStatus())
                .createdBy(userId)
                .build();
        boolean flag = SqlHelper.retBool(spaceApplyMapper.insertApply(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    @Override
    public void process(Long userId, Long notifyId, Boolean agree) {
        log.info("处理空间加入申请，userId:{},notifyId:{},agree:{}", userId, notifyId, agree);
        // 查询申请信息
        String applyStatusKey = StrUtil.join(".", BODY_EXTRAS, APPLY_STATUS);
        SpaceApplyDto apply = spaceApplyMapper.selectSpaceApplyDto(notifyId, userId, NotificationTemplateId.SPACE_JOIN_APPLY.getValue(),
                StrUtil.join(".", BODY_EXTRAS, APPLY_ID), applyStatusKey);
        // 校验申请通知消息
        ExceptionUtil.isNotNull(apply, APPLY_NOTIFICATION_ERROR);
        ExceptionUtil.isNotNull(apply.getNotifyApplyStatus(), APPLY_NOTIFICATION_ERROR);
        ExceptionUtil.isTrue(SpaceApplyStatus.PENDING.getStatus().equals(apply.getNotifyApplyStatus()), APPLY_EXPIRED_OR_PROCESSED);
        // 校验申请是否存在、以及用户权限
        ExceptionUtil.isNotNull(apply.getApplyId(), APPLY_NOT_EXIST);
        // 校验当前用户是否在该空间中、是否拥有成员管理权限
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, apply.getSpaceId());
        ExceptionUtil.isTrue(CollUtil.contains(userSpaceDto.getResourceCodes(), "INVITE_MEMBER"), INSUFFICIENT_PERMISSIONS);
        // 申请状态已非待审核，同步更新通知消息体的申请状态
        if (!SpaceApplyStatus.PENDING.getStatus().equals(apply.getStatus())) {
            playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, apply.getStatus());
            throw new BusinessException(APPLY_EXPIRED_OR_PROCESSED);
        }
        this.updateApplyStatus(userId, agree, apply, notifyId, applyStatusKey);
    }

    @Transactional(rollbackFor = Exception.class)
    void updateApplyStatus(Long userId, Boolean agree, SpaceApplyDto apply, Long notifyId, String applyStatusKey) {
        // 校验申请者是否已在空间中
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(apply.getCreatedBy(), apply.getSpaceId());
        if (memberId != null) {
            spaceApplyMapper.invalidateTheApply(Collections.singletonList(apply.getCreatedBy()), apply.getSpaceId(), null);
            playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, SpaceApplyStatus.INVALIDATION.getStatus());
            throw new BusinessException(APPLY_EXPIRED_OR_PROCESSED);
        }
        Integer status = SpaceApplyStatus.REFUSE.getStatus();
        if (BooleanUtil.isTrue(agree)) {
            status = SpaceApplyStatus.APPROVE.getStatus();
            // 同意申请，判断邀请空间的人数是否达到上限
            // iSubscriptionService.checkSeat(apply.getSpaceId());
            // 创建成员
            iMemberService.createMember(apply.getCreatedBy(), apply.getSpaceId(), null);
        }
        boolean flag = SqlHelper.retBool(spaceApplyMapper.updateStatusByApplyIdAndUpdatedBy(apply.getApplyId(), status, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        boolean bool = SqlHelper.retBool(playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, status));
        ExceptionUtil.isTrue(bool, DatabaseException.EDIT_ERROR);
        // 发送通知
        TaskManager.me().execute(() -> {
                    NotificationTemplateId templateId = BooleanUtil.isTrue(agree) ? SPACE_JOIN_APPLY_APPROVED : SPACE_JOIN_APPLY_REFUSED;
                    NotificationManager.me().playerNotify(templateId, Collections.singletonList(apply.getCreatedBy()),
                            userId, apply.getSpaceId(), null);
                }
        );
    }
}

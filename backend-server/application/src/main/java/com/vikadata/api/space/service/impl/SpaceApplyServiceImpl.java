package com.vikadata.api.space.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.shared.cache.bean.UserSpaceDto;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.space.enums.SpaceApplyStatus;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.space.dto.SpaceApplyDTO;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.player.mapper.PlayerNotificationMapper;
import com.vikadata.api.space.mapper.SpaceApplyMapper;
import com.vikadata.api.space.service.ISpaceApplyService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SpaceApplyEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.shared.component.notification.NotificationTemplateId.SPACE_JOIN_APPLY_APPROVED;
import static com.vikadata.api.shared.component.notification.NotificationTemplateId.SPACE_JOIN_APPLY_REFUSED;
import static com.vikadata.api.shared.constants.NotificationConstants.APPLY_ID;
import static com.vikadata.api.shared.constants.NotificationConstants.APPLY_STATUS;
import static com.vikadata.api.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.space.enums.SpaceApplyException.APPLY_DUPLICATE;
import static com.vikadata.api.space.enums.SpaceApplyException.APPLY_EXPIRED_OR_PROCESSED;
import static com.vikadata.api.space.enums.SpaceApplyException.APPLY_NOTIFICATION_ERROR;
import static com.vikadata.api.space.enums.SpaceApplyException.APPLY_NOT_EXIST;
import static com.vikadata.api.space.enums.SpaceApplyException.APPLY_SWITCH_CLOSE;
import static com.vikadata.api.space.enums.SpaceApplyException.EXIST_MEMBER;
import static com.vikadata.api.space.enums.SpacePermissionException.INSUFFICIENT_PERMISSIONS;

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
        log.info("Create apply，userId:{},spaceId:{}", userId, spaceId);
        // check whether the space exists
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(Boolean.TRUE.equals(feature.getJoinable()), APPLY_SWITCH_CLOSE);
        // Verify that the user has applied for an application
        int count = SqlTool.retCount(spaceApplyMapper.countBySpaceIdAndCreatedByAndStatus(userId, spaceId, SpaceApplyStatus.PENDING.getStatus()));
        ExceptionUtil.isTrue(count == 0, APPLY_DUPLICATE);
        // Check whether users already exist in the space
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
        log.info("process space join application，userId:{},notifyId:{},agree:{}", userId, notifyId, agree);
        // querying application information
        String applyStatusKey = StrUtil.join(".", BODY_EXTRAS, APPLY_STATUS);
        SpaceApplyDTO apply = spaceApplyMapper.selectSpaceApplyDto(notifyId, userId, NotificationTemplateId.SPACE_JOIN_APPLY.getValue(),
                StrUtil.join(".", BODY_EXTRAS, APPLY_ID), applyStatusKey);
        // verify application notification messages
        ExceptionUtil.isNotNull(apply, APPLY_NOTIFICATION_ERROR);
        ExceptionUtil.isNotNull(apply.getNotifyApplyStatus(), APPLY_NOTIFICATION_ERROR);
        ExceptionUtil.isTrue(SpaceApplyStatus.PENDING.getStatus().equals(apply.getNotifyApplyStatus()), APPLY_EXPIRED_OR_PROCESSED);
        // Verify the existence of the application and user rights
        ExceptionUtil.isNotNull(apply.getApplyId(), APPLY_NOT_EXIST);
        // check whether the current user is in the space and has permission to manage members
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, apply.getSpaceId());
        ExceptionUtil.isTrue(CollUtil.contains(userSpaceDto.getResourceCodes(), "INVITE_MEMBER"), INSUFFICIENT_PERMISSIONS);
        // the application status is not pending for review，synchronously updates the application status of the notification body.
        if (!SpaceApplyStatus.PENDING.getStatus().equals(apply.getStatus())) {
            playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, apply.getStatus());
            throw new BusinessException(APPLY_EXPIRED_OR_PROCESSED);
        }
        this.updateApplyStatus(userId, agree, apply, notifyId, applyStatusKey);
    }

    @Transactional(rollbackFor = Exception.class)
    void updateApplyStatus(Long userId, Boolean agree, SpaceApplyDTO apply, Long notifyId, String applyStatusKey) {
        // verify whether the applicant is already in space
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(apply.getCreatedBy(), apply.getSpaceId());
        if (memberId != null) {
            spaceApplyMapper.invalidateTheApply(Collections.singletonList(apply.getCreatedBy()), apply.getSpaceId(), null);
            playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, SpaceApplyStatus.INVALIDATION.getStatus());
            throw new BusinessException(APPLY_EXPIRED_OR_PROCESSED);
        }
        Integer status = SpaceApplyStatus.REFUSE.getStatus();
        if (BooleanUtil.isTrue(agree)) {
            status = SpaceApplyStatus.APPROVE.getStatus();
            // Agree to apply and determine whether the number of people invited to the space has reached the maximum
            // iSubscriptionService.checkSeat(apply.getSpaceId());
            // Create member
            iMemberService.createMember(apply.getCreatedBy(), apply.getSpaceId(), null);
        }
        boolean flag = SqlHelper.retBool(spaceApplyMapper.updateStatusByApplyIdAndUpdatedBy(apply.getApplyId(), status, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        boolean bool = SqlHelper.retBool(playerNotificationMapper.updateNotifyBodyByIdAndKey(notifyId, applyStatusKey, status));
        ExceptionUtil.isTrue(bool, DatabaseException.EDIT_ERROR);
        TaskManager.me().execute(() -> {
                    NotificationTemplateId templateId = BooleanUtil.isTrue(agree) ? SPACE_JOIN_APPLY_APPROVED : SPACE_JOIN_APPLY_REFUSED;
                    NotificationManager.me().playerNotify(templateId, Collections.singletonList(apply.getCreatedBy()),
                            userId, apply.getSpaceId(), null);
                }
        );
    }
}

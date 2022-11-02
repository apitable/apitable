package com.vikadata.api.modular.vcode.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.VCodeException;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.enums.vcode.VCodeUsageType;
import com.vikadata.api.model.dto.user.ThirdPartyMemberInfo;
import com.vikadata.api.model.ro.vcode.VCodeCreateRo;
import com.vikadata.api.model.ro.vcode.VCodeUpdateRo;
import com.vikadata.api.model.vo.vcode.VCodePageVo;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.api.modular.vcode.mapper.VCodeUsageMapper;
import com.vikadata.api.modular.vcode.service.IVCodeActivityService;
import com.vikadata.api.modular.vcode.service.IVCodeCouponService;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.modular.vcode.service.IVCodeUsageService;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.CodeEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.IntegralActionCodeConstants.REDEMPTION_CODE;
import static com.vikadata.api.enums.exception.VCodeException.ACCOUNT_NOT_REGISTER;
import static com.vikadata.api.enums.exception.VCodeException.CANNOT_ZERO;
import static com.vikadata.api.enums.exception.VCodeException.CODE_NOT_EXIST;
import static com.vikadata.api.enums.exception.VCodeException.EXPIRE_TIME_INCORRECT;
import static com.vikadata.api.enums.exception.VCodeException.INVITE_CODE_EXPIRE;
import static com.vikadata.api.enums.exception.VCodeException.INVITE_CODE_NOT_EXIST;
import static com.vikadata.api.enums.exception.VCodeException.INVITE_CODE_NOT_VALID;
import static com.vikadata.api.enums.exception.VCodeException.INVITE_CODE_USED;
import static com.vikadata.api.enums.exception.VCodeException.REDEMPTION_CODE_EXPIRE;
import static com.vikadata.api.enums.exception.VCodeException.REDEMPTION_CODE_NOT_EXIST;
import static com.vikadata.api.enums.exception.VCodeException.REDEMPTION_CODE_NOT_VALID;
import static com.vikadata.api.enums.exception.VCodeException.REDEMPTION_CODE_USED;
import static com.vikadata.api.enums.exception.VCodeException.TEMPLATE_EMPTY;
import static com.vikadata.api.enums.exception.VCodeException.TYPE_ERROR;
import static com.vikadata.api.enums.exception.VCodeException.TYPE_INFO_ERROR;

/**
 * <p>
 * VCode Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class VCodeServiceImpl implements IVCodeService {

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private VCodeMapper vCodeMapper;

    @Resource
    private VCodeUsageMapper vCodeUsageMapper;

    @Resource
    private IVCodeUsageService ivCodeUsageService;

    @Resource
    private IVCodeActivityService ivCodeActivityService;

    @Resource
    private IVCodeCouponService ivCodeCouponService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IIntegralService iIntegralService;

    @Override
    public String getUserInviteCode(Long userId) {
        return vCodeMapper.selectCodeByTypeAndRefId(VCodeType.PERSONAL_INVITATION_CODE.getType(), userId);
    }

    @Override
    public IPage<VCodePageVo> getVCodePageVo(Page<VCodePageVo> page, Integer type, Long activityId) {
        return vCodeMapper.selectDetailInfo(page, type, activityId);
    }

    @Override
    public String getOfficialInvitationCode(String appId, String unionId) {
        log.info("Get the official invitation code. UnionId：{}", unionId);
        // Query whether the WeChat user has obtained an invitation code, if so, there is no need to regenerate
        ThirdPartyMemberInfo info = thirdPartyMemberMapper.selectInfo(appId, unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        String code = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.OFFICIAL_INVITATION_CODE.getType(), info.getId());
        if (code == null) {
            code = this.getUniqueCodeBatch(VCodeType.OFFICIAL_INVITATION_CODE.getType());
            CodeEntity entity = CodeEntity.builder()
                    .type(VCodeType.OFFICIAL_INVITATION_CODE.getType())
                    .refId(info.getId())
                    .code(code)
                    .availableTimes(1)
                    .remainTimes(1)
                    .limitTimes(1)
                    .build();
            boolean flag = SqlHelper.retBool(vCodeMapper.insert(entity));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
            // Save pick up log
            ivCodeUsageService.createUsageRecord(info.getId(), info.getNickName(), VCodeUsageType.ACQUIRE.getType(), code);
        }
        return code;
    }

    @Override
    public String getActivityCode(Long activityId, String appId, String unionId) {
        log.info("Get active VCode，activityId：{}，unionId：{}", activityId, unionId);
        //Query whether the activity has a corresponding VCode
        int count = SqlTool.retCount(vCodeMapper.countByActivityId(activityId));
        if (count == 0) {
            return null;
        }
        // Query whether the operator has received, if yes, return directly
        ThirdPartyMemberInfo info = thirdPartyMemberMapper.selectInfo(appId, unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        String code = vCodeMapper.getAcquiredCode(activityId, info.getId());
        if (code != null) {
            return code;
        }
        // Get the VCode available for the specified activity
        List<String> availableCodes = vCodeMapper.getAvailableCode(activityId);
        if (CollUtil.isEmpty(availableCodes)) {
            return "finished";
        }
        code = availableCodes.get(RandomUtil.randomInt(0, availableCodes.size()));
        // Save pick up log
        ivCodeUsageService.createUsageRecord(info.getId(), info.getNickName(), VCodeUsageType.ACQUIRE.getType(), code);
        return code;
    }

    @Override
    public List<String> create(Long userId, VCodeCreateRo ro) {
        // Check expiration time
        ExceptionUtil.isTrue(ObjectUtil.isNull(ro.getExpireTime()) ||
                ro.getExpireTime().isAfter(LocalDateTime.now()), EXPIRE_TIME_INCORRECT);
        Long templateId = null;
        if (ro.getType().equals(VCodeType.REDEMPTION_CODE.getType())) {
            // The type is redemption code, and a redemption template must be selected
            ExceptionUtil.isNotNull(ro.getTemplateId(), TEMPLATE_EMPTY);
            // Check if the coupon template exists
            ivCodeCouponService.checkCouponIfExist(ro.getTemplateId());
            templateId = ro.getTemplateId();
        }
        else {
            // Type must be redemption code or official invitation code
            ExceptionUtil.isTrue(ro.getType().equals(VCodeType.OFFICIAL_INVITATION_CODE.getType()), TYPE_ERROR);
        }
        // Check if activity exists
        ivCodeActivityService.checkActivityIfExist(ro.getActivityId());
        // Check if the specified user exists
        Long assignUserId = null;
        if (StrUtil.isNotBlank(ro.getMobile())) {
            assignUserId = userMapper.selectIdByMobile(ro.getMobile());
            ExceptionUtil.isNotNull(assignUserId, ACCOUNT_NOT_REGISTER);
        }
        // Check the total number of VCode that can be used, and limit the number of uses by a single person
        ExceptionUtil.isTrue(ro.getAvailableTimes() != 0 && ro.getLimitTimes() != 0, CANNOT_ZERO);
        Integer remainTimes = ro.getAvailableTimes() > 0 ? ro.getAvailableTimes() : null;
        List<CodeEntity> entities = new ArrayList<>(ro.getCount());
        List<String> codes = new ArrayList<>(ro.getCount());
        List<String> allCode = new ArrayList<>();
        for (int i = 0; i < ro.getCount(); i++) {
            String code = this.getUniqueCodeBatch(allCode, ro.getType());
            CodeEntity entity = CodeEntity.builder()
                    .id(IdWorker.getId())
                    .type(ro.getType())
                    .activityId(ro.getActivityId())
                    .refId(templateId)
                    .code(code)
                    .availableTimes(ro.getAvailableTimes())
                    .remainTimes(remainTimes)
                    .limitTimes(ro.getLimitTimes())
                    .expiredAt(ro.getExpireTime())
                    .assignUserId(assignUserId)
                    .createdBy(userId)
                    .updatedBy(userId)
                    .build();
            entities.add(entity);
            codes.add(code);
        }
        boolean flag = SqlHelper.retBool(vCodeMapper.insertList(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return codes;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, String code, VCodeUpdateRo ro) {
        log.info("Edit VCode setting. UserId:{}. VCode:{}. RO:{}", userId, code, ro);
        // Verify that VCode exists and is not a personal invitation code type
        Integer type = vCodeMapper.selectTypeByCode(code);
        ExceptionUtil.isNotNull(type, CODE_NOT_EXIST);
        ExceptionUtil.isFalse(VCodeType.PERSONAL_INVITATION_CODE.getType() == type, TYPE_ERROR);
        // Modify redemption template ID
        if (ObjectUtil.isNotNull(ro.getTemplateId())) {
            // Check if VCode is a voucher
            ExceptionUtil.isTrue(VCodeType.REDEMPTION_CODE.getType() == type, TYPE_INFO_ERROR);
            // Check if the coupon template exists
            ivCodeCouponService.checkCouponIfExist(ro.getTemplateId());
            boolean flag = SqlHelper.retBool(vCodeMapper.updateRefIdByCode(userId, code, ro.getTemplateId()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // Modify the total available
        if (ObjectUtil.isNotNull(ro.getAvailableTimes())) {
            ExceptionUtil.isTrue(ro.getAvailableTimes() != 0, CANNOT_ZERO);
            Integer remainTimes = null;
            // If it is not set to infinite times, count the times used, and calculate the remaining times
            if (ro.getAvailableTimes() != -1) {
                int usageTimes = SqlTool.retCount(vCodeUsageMapper.countByCodeAndType(code, VCodeUsageType.USE.getType(), null));
                remainTimes = ro.getAvailableTimes() - usageTimes;
            }
            boolean flag = SqlHelper.retBool(vCodeMapper.updateAvailableTimesByCode(userId, code, ro.getAvailableTimes(), remainTimes));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // Modify the number of uses for a single person
        if (ObjectUtil.isNotNull(ro.getLimitTimes())) {
            ExceptionUtil.isTrue(ro.getLimitTimes() != 0, CANNOT_ZERO);
            boolean flag = SqlHelper.retBool(vCodeMapper.updateLimitTimesByCode(userId, code, ro.getLimitTimes()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // Modify expiration time
        if (ObjectUtil.isNotNull(ro.getExpireTime())) {
            boolean flag = SqlHelper.retBool(vCodeMapper.updateExpiredAtByCode(userId, code, ro.getExpireTime()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    @Override
    public void delete(Long userId, String code) {
        boolean flag = SqlHelper.retBool(vCodeMapper.removeByCode(userId, code));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public void checkInviteCode(String inviteCode) {
        ExceptionUtil.isNotBlank(inviteCode, INVITE_CODE_NOT_EXIST);
        CodeEntity entity = vCodeMapper.selectByCode(inviteCode);
        // Check the validity of the invitation code
        ExceptionUtil.isNotNull(entity, INVITE_CODE_NOT_VALID);
        ExceptionUtil.isNull(entity.getAssignUserId(), INVITE_CODE_NOT_VALID);
        ExceptionUtil.isFalse(entity.getType().equals(VCodeType.REDEMPTION_CODE.getType()), INVITE_CODE_NOT_VALID);
        ExceptionUtil.isTrue(entity.getExpiredAt() == null ||
                entity.getExpiredAt().isAfter(LocalDateTime.now()), INVITE_CODE_EXPIRE);
        // Satisfy the total number of available use is unlimited, or the remaining number of times is enough
        ExceptionUtil.isTrue(entity.getAvailableTimes() < 0 || entity.getRemainTimes() > 0, INVITE_CODE_USED);
        // Official invitation code
        if (entity.getType().equals(VCodeType.OFFICIAL_INVITATION_CODE.getType())) {
            return;
        }
        // Cancellation cooling-off period / Invitation code for cancelled accounts is unavailable
        UserEntity user = userMapper.selectById(entity.getCreatedBy());
        ExceptionUtil.isNotNull(user, INVITE_CODE_NOT_VALID);
        ExceptionUtil.isFalse(user.getIsDeleted() || user.getIsPaused(), INVITE_CODE_NOT_VALID);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void useInviteCode(Long useUserId, String useUserName, String inviteCode) {
        // Update remaining availability
        this.updateRemainTimes(inviteCode, INVITE_CODE_NOT_VALID);
        // Save usage logs
        ivCodeUsageService.createUsageRecord(useUserId, useUserName, VCodeUsageType.USE.getType(), inviteCode);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createPersonalInviteCode(Long userId) {
        String code = this.getUniqueCodeBatch(VCodeType.PERSONAL_INVITATION_CODE.getType());
        CodeEntity entity = CodeEntity.builder()
                .id(IdWorker.getId())
                .type(VCodeType.PERSONAL_INVITATION_CODE.getType())
                .refId(userId)
                .code(code)
                .availableTimes(-1)
                .remainTimes(1)
                .limitTimes(1)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        boolean flag = SqlHelper.retBool(vCodeMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void checkRedemptionCode(Long userId, String redemptionCode) {
        log.info("Check redemption code，userId:{}，redemption code:{}", userId, redemptionCode);
        ExceptionUtil.isNotBlank(redemptionCode, REDEMPTION_CODE_NOT_EXIST);
        // Verify the validity of the redemption code
        CodeEntity entity = vCodeMapper.selectByCode(redemptionCode);
        ExceptionUtil.isNotNull(entity, REDEMPTION_CODE_NOT_VALID);
        ExceptionUtil.isTrue(entity.getType().equals(VCodeType.REDEMPTION_CODE.getType()), REDEMPTION_CODE_NOT_VALID);
        // Verify that the redemption code has no designated user, or is being used by the designated user
        ExceptionUtil.isTrue(entity.getAssignUserId() == null ||
                entity.getAssignUserId().equals(userId), REDEMPTION_CODE_NOT_VALID);
        // Check valid time
        ExceptionUtil.isTrue(entity.getExpiredAt() == null ||
                entity.getExpiredAt().isAfter(LocalDateTime.now()), REDEMPTION_CODE_EXPIRE);
        // Satisfy the total number of available use is unlimited, or the remaining number of times is enough
        ExceptionUtil.isTrue(entity.getAvailableTimes() < 0 || entity.getRemainTimes() > 0, INVITE_CODE_USED);
        // When the number of times of limited use by a single person is limited,
        // determine whether the total number of redemption codes used by the current user does not exceed the number of times limited by a single person
        if (entity.getLimitTimes() > 0) {
            int useCount = SqlTool.retCount(vCodeUsageMapper.countByCodeAndType(redemptionCode, VCodeUsageType.USE.getType(), userId));
            ExceptionUtil.isTrue(entity.getLimitTimes() > useCount, REDEMPTION_CODE_USED);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Integer useRedemptionCode(Long userId, String redemptionCode) {
        log.info("Use redemption code. userId:{}. redemption code:{}", userId, redemptionCode);
        // Update remaining availability
        this.updateRemainTimes(redemptionCode, REDEMPTION_CODE_NOT_VALID);
        // Save usage logs
        ivCodeUsageService.createUsageRecord(userId, userMapper.selectUserNameById(userId), VCodeUsageType.USE.getType(), redemptionCode);
        // Query the number of V coins exchanged for the exchange code
        Integer integral = vCodeMapper.selectIntegral(redemptionCode);
        ExceptionUtil.isNotNull(integral, REDEMPTION_CODE_NOT_VALID);
        // Exchange VCode
        iIntegralService.alterIntegral(REDEMPTION_CODE, IntegralAlterType.INCOME, integral, userId, JSONUtil.createObj());
        return integral;
    }

    private void updateRemainTimes(String code, VCodeException exception) {
        Integer times = vCodeMapper.selectAvailableTimesByCode(code);
        ExceptionUtil.isNotNull(times, exception);
        // The total number of uses is unlimited, and the remaining times do not need to be changed
        if (times < 0) {
            return;
        }
        vCodeMapper.subRemainTimes(code);
    }

    private String getUniqueCodeBatch(List<String> codes, Integer type) {
        String code;
        do {
            code = this.getUniqueCodeBatch(type);
        } while (codes.contains(code));
        codes.add(code);
        return code;
    }

    /**
     * Get unique VCode
     */
    private String getUniqueCodeBatch(Integer type) {
        // Determine whether it is a redemption code. If it is, use uppercase and lowercase plus a digital random code,
        // otherwise use a pure digital random code.
        boolean isRedemptionCode = type.equals(VCodeType.REDEMPTION_CODE.getType());
        String code;
        boolean exit;
        Integer length = constProperties.getVCodeLength();
        do {
            code = isRedemptionCode ? RandomExtendUtil.randomStringLowerCase(length) :
                    RandomExtendUtil.randomNumbers(length);
            exit = SqlTool.retCount(vCodeMapper.countByCode(code)) > 0;
        } while (exit);
        return code;
    }
}

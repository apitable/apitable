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
import com.vikadata.api.modular.organization.mapper.MemberMapper;
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
 * V 码 接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/8/7
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
    private MemberMapper memberMapper;

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
        log.info("获取官方邀请码，unionId：{}", unionId);
        // 查询该微信用户是否已获取过邀请码，是则无需重新生成
        ThirdPartyMemberInfo info = thirdPartyMemberMapper.selectInfo(appId, unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        String code = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.OFFICIAL_INVITATION_CODE.getType(), info.getId());
        if (code == null) {
            code = this.getUniqueCodeBatch(VCodeType.OFFICIAL_INVITATION_CODE.getType());
            // 保存记录
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
            // 保存领取日志
            ivCodeUsageService.createUsageRecord(info.getId(), info.getNickName(), VCodeUsageType.ACQUIRE.getType(), code);
        }
        return code;
    }

    @Override
    public String getActivityCode(Long activityId, String appId, String unionId) {
        log.info("获取活动的 VCode，activityId：{}，unionId：{}", activityId, unionId);
        // 查询活动是否有对应的 VCode
        int count = SqlTool.retCount(vCodeMapper.countByActivityId(activityId));
        if (count == 0) {
            return null;
        }
        // 查询操作者是否已领取，是则直接返回
        ThirdPartyMemberInfo info = thirdPartyMemberMapper.selectInfo(appId, unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        String code = vCodeMapper.getAcquiredCode(activityId, info.getId());
        if (code != null) {
            return code;
        }
        // 获取指定活动可用的 VCode
        List<String> availableCodes = vCodeMapper.getAvailableCode(activityId);
        if (CollUtil.isEmpty(availableCodes)) {
            return "已领完";
        }
        code = availableCodes.get(RandomUtil.randomInt(0, availableCodes.size()));
        // 保存领取日志
        ivCodeUsageService.createUsageRecord(info.getId(), info.getNickName(), VCodeUsageType.ACQUIRE.getType(), code);
        return code;
    }

    @Override
    public List<String> create(Long userId, VCodeCreateRo ro) {
        log.info("创建 VCode");
        // 校验过期时间
        ExceptionUtil.isTrue(ObjectUtil.isNull(ro.getExpireTime()) ||
                ro.getExpireTime().isAfter(LocalDateTime.now()), EXPIRE_TIME_INCORRECT);
        Long templateId = null;
        if (ro.getType().equals(VCodeType.REDEMPTION_CODE.getType())) {
            // 类型为兑换码，必须选择兑换模板
            ExceptionUtil.isNotNull(ro.getTemplateId(), TEMPLATE_EMPTY);
            // 检查兑换券模板是否存在
            ivCodeCouponService.checkCouponIfExist(ro.getTemplateId());
            templateId = ro.getTemplateId();
        }
        else {
            // 类型需为兑换码或官方邀请码
            ExceptionUtil.isTrue(ro.getType().equals(VCodeType.OFFICIAL_INVITATION_CODE.getType()), TYPE_ERROR);
        }
        // 检查活动是否存在
        ivCodeActivityService.checkActivityIfExist(ro.getActivityId());
        // 校验指定用户是否存在
        Long assignUserId = null;
        if (StrUtil.isNotBlank(ro.getMobile())) {
            assignUserId = userMapper.selectIdByMobile(ro.getMobile());
            ExceptionUtil.isNotNull(assignUserId, ACCOUNT_NOT_REGISTER);
        }
        // 校验V码可使用总数，单人限制使用次数
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
        log.info("编辑 VCode 配置，userId:{}，code:{}，ro:{}", userId, code, ro);
        // 校验 VCode 是否存在，并且不是个人邀请码类型
        Integer type = vCodeMapper.selectTypeByCode(code);
        ExceptionUtil.isNotNull(type, CODE_NOT_EXIST);
        ExceptionUtil.isFalse(VCodeType.PERSONAL_INVITATION_CODE.getType() == type, TYPE_ERROR);
        // 修改兑换模板ID
        if (ObjectUtil.isNotNull(ro.getTemplateId())) {
            // 校验 VCode 是否是兑换券
            ExceptionUtil.isTrue(VCodeType.REDEMPTION_CODE.getType() == type, TYPE_INFO_ERROR);
            // 检查兑换券模板是否存在
            ivCodeCouponService.checkCouponIfExist(ro.getTemplateId());
            boolean flag = SqlHelper.retBool(vCodeMapper.updateRefIdByCode(userId, code, ro.getTemplateId()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // 修改可使用总数
        if (ObjectUtil.isNotNull(ro.getAvailableTimes())) {
            ExceptionUtil.isTrue(ro.getAvailableTimes() != 0, CANNOT_ZERO);
            Integer remainTimes = null;
            // 若不是设置了无限次，统计被使用的次数，计算出剩余次数
            if (ro.getAvailableTimes() != -1) {
                int usageTimes = SqlTool.retCount(vCodeUsageMapper.countByCodeAndType(code, VCodeUsageType.USE.getType(), null));
                remainTimes = ro.getAvailableTimes() - usageTimes;
            }
            boolean flag = SqlHelper.retBool(vCodeMapper.updateAvailableTimesByCode(userId, code, ro.getAvailableTimes(), remainTimes));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // 修改单人限制使用次数
        if (ObjectUtil.isNotNull(ro.getLimitTimes())) {
            ExceptionUtil.isTrue(ro.getLimitTimes() != 0, CANNOT_ZERO);
            boolean flag = SqlHelper.retBool(vCodeMapper.updateLimitTimesByCode(userId, code, ro.getLimitTimes()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        // 修改过期时间
        if (ObjectUtil.isNotNull(ro.getExpireTime())) {
            boolean flag = SqlHelper.retBool(vCodeMapper.updateExpiredAtByCode(userId, code, ro.getExpireTime()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    @Override
    public void delete(Long userId, String code) {
        // 逻辑删除
        boolean flag = SqlHelper.retBool(vCodeMapper.removeByCode(userId, code));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public void checkInviteCode(String inviteCode) {
        log.info("校验邀请码");
        ExceptionUtil.isNotBlank(inviteCode, INVITE_CODE_NOT_EXIST);
        CodeEntity entity = vCodeMapper.selectByCode(inviteCode);
        // 校验邀请码的有效性
        ExceptionUtil.isNotNull(entity, INVITE_CODE_NOT_VALID);
        ExceptionUtil.isNull(entity.getAssignUserId(), INVITE_CODE_NOT_VALID);
        ExceptionUtil.isFalse(entity.getType().equals(VCodeType.REDEMPTION_CODE.getType()), INVITE_CODE_NOT_VALID);
        ExceptionUtil.isTrue(entity.getExpiredAt() == null ||
                entity.getExpiredAt().isAfter(LocalDateTime.now()), INVITE_CODE_EXPIRE);
        // 满足可使用总数无限，或者剩余次数足够
        ExceptionUtil.isTrue(entity.getAvailableTimes() < 0 || entity.getRemainTimes() > 0, INVITE_CODE_USED);
        // 官方邀请码
        if (entity.getType().equals(VCodeType.OFFICIAL_INVITATION_CODE.getType())) {
            return;
        }
        // 注销冷静期/已注销账号邀请码不可用
        UserEntity user = userMapper.selectById(entity.getCreatedBy());
        ExceptionUtil.isNotNull(user, INVITE_CODE_NOT_VALID);
        ExceptionUtil.isFalse(user.getIsDeleted() || user.getIsPaused(), INVITE_CODE_NOT_VALID);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void useInviteCode(Long useUserId, String useUserName, String inviteCode) {
        log.info("使用邀请码");
        // 更新剩余可用次数
        this.updateRemainTimes(inviteCode, INVITE_CODE_NOT_VALID);
        // 保存使用日志
        ivCodeUsageService.createUsageRecord(useUserId, useUserName, VCodeUsageType.USE.getType(), inviteCode);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createPersonalInviteCode(Long userId) {
        log.info("创建个人邀请码");
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
        log.info("校验兑换码，userId:{}，redemption code:{}", userId, redemptionCode);
        ExceptionUtil.isNotBlank(redemptionCode, REDEMPTION_CODE_NOT_EXIST);
        // 校验兑换码的有效性
        CodeEntity entity = vCodeMapper.selectByCode(redemptionCode);
        ExceptionUtil.isNotNull(entity, REDEMPTION_CODE_NOT_VALID);
        ExceptionUtil.isTrue(entity.getType().equals(VCodeType.REDEMPTION_CODE.getType()), REDEMPTION_CODE_NOT_VALID);
        // 校验兑换码是否无指定用户，或正是指定用户在使用
        ExceptionUtil.isTrue(entity.getAssignUserId() == null ||
                entity.getAssignUserId().equals(userId), REDEMPTION_CODE_NOT_VALID);
        // 校验有效时间
        ExceptionUtil.isTrue(entity.getExpiredAt() == null ||
                entity.getExpiredAt().isAfter(LocalDateTime.now()), REDEMPTION_CODE_EXPIRE);
        // 满足可使用总数无限，或者剩余次数足够
        ExceptionUtil.isTrue(entity.getAvailableTimes() < 0 || entity.getRemainTimes() > 0, INVITE_CODE_USED);
        // 单人限制使用次数有限时，判断当前用户使用该兑换码的总数是否未超过单人限制次数
        if (entity.getLimitTimes() > 0) {
            int useCount = SqlTool.retCount(vCodeUsageMapper.countByCodeAndType(redemptionCode, VCodeUsageType.USE.getType(), userId));
            ExceptionUtil.isTrue(entity.getLimitTimes() > useCount, REDEMPTION_CODE_USED);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Integer useRedemptionCode(Long userId, String redemptionCode) {
        log.info("使用兑换码，userId:{}，redemption code:{}", userId, redemptionCode);
        // 更新剩余可用次数
        this.updateRemainTimes(redemptionCode, REDEMPTION_CODE_NOT_VALID);
        // 保存使用日志
        ivCodeUsageService.createUsageRecord(userId, userMapper.selectUserNameById(userId), VCodeUsageType.USE.getType(), redemptionCode);
        // 查询兑换码的V币兑换数
        Integer integral = vCodeMapper.selectIntegral(redemptionCode);
        ExceptionUtil.isNotNull(integral, REDEMPTION_CODE_NOT_VALID);
        // 兑换V币
        iIntegralService.alterIntegral(REDEMPTION_CODE, IntegralAlterType.INCOME, integral, userId, JSONUtil.createObj());
        return integral;
    }

    private void updateRemainTimes(String code, VCodeException exception) {
        Integer times = vCodeMapper.selectAvailableTimesByCode(code);
        ExceptionUtil.isNotNull(times, exception);
        // 可使用总数无限，剩余次数无需更改
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
     * 获取唯一 V码
     */
    private String getUniqueCodeBatch(Integer type) {
        // 判断是否是兑换码，是则使用大小写加数字随机码，否则使用纯数字随机码
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

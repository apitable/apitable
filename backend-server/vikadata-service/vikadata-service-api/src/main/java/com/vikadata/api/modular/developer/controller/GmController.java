package com.vikadata.api.modular.developer.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.component.notification.NotificationFactory;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.EmailCodeType;
import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.labs.LabsFeatureEnum;
import com.vikadata.api.enums.labs.LabsFeatureScopeEnum;
import com.vikadata.api.enums.labs.LabsFeatureTypeEnum;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.ro.labs.GmApplyFeatureRo;
import com.vikadata.api.model.ro.labs.GmLabsFeatureCreatorRo;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.ro.player.NotificationRevokeRo;
import com.vikadata.api.model.vo.labs.GmLabFeatureVo;
import com.vikadata.api.modular.developer.model.ConfigDatasheetRo;
import com.vikadata.api.modular.developer.model.HqAddUserRo;
import com.vikadata.api.modular.developer.model.HqAddUserVo;
import com.vikadata.api.modular.developer.model.QueryUserInfoRo;
import com.vikadata.api.modular.developer.model.SpaceBlacklistRo;
import com.vikadata.api.modular.developer.model.SpaceCertificationRo;
import com.vikadata.api.modular.developer.model.UnlockRo;
import com.vikadata.api.modular.developer.model.UserActivityAssignRo;
import com.vikadata.api.modular.developer.model.UserActivityRo;
import com.vikadata.api.modular.developer.model.WeComIsvEventRo;
import com.vikadata.api.modular.developer.model.WeComIsvNewSpaceRo;
import com.vikadata.api.modular.developer.model.WeComIsvOrderMigrateRo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitActivateRo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitEnsureAllRo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitNewOrderRo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitNewOrderVo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitRenewalRo;
import com.vikadata.api.modular.developer.model.WeComIsvPermitRenewalVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.idaas.model.IdaasAppBindRo;
import com.vikadata.api.modular.idaas.model.IdaasAppBindVo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateVo;
import com.vikadata.api.modular.idaas.service.IIdaasAppBindService;
import com.vikadata.api.modular.idaas.service.IIdaasTenantService;
import com.vikadata.api.modular.labs.service.ILabsApplicantService;
import com.vikadata.api.modular.labs.service.ILabsFeatureService;
import com.vikadata.api.modular.player.mapper.PlayerActivityMapper;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeRepository;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.clock.ClockUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.LabsApplicantEntity;
import com.vikadata.entity.LabsFeaturesEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialWecomPermitOrderEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.constants.NotificationConstants.EXPIRE_AT;
import static com.vikadata.api.constants.NotificationConstants.VERSION;
import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;
import static com.vikadata.api.enums.exception.DatabaseException.EDIT_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;
import static com.vikadata.api.enums.exception.LabsFeatureException.FEATURE_KEY_IS_NOT_EXIST;
import static com.vikadata.api.enums.exception.LabsFeatureException.FEATURE_SCOPE_IS_NOT_EXIST;
import static com.vikadata.api.enums.exception.LabsFeatureException.FEATURE_TYPE_IS_NOT_EXIST;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;
import static com.vikadata.api.enums.exception.SpaceException.UPDATE_SPACE_INFO_FAIL;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE;
import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.USER_LEVEL_FEATURE;
import static com.vikadata.api.enums.labs.LabsFeatureEnum.UNKNOWN_LAB_FEATURE;
import static com.vikadata.api.enums.labs.LabsFeatureEnum.ofLabsFeature;
import static com.vikadata.api.enums.labs.LabsFeatureScopeEnum.UNKNOWN_SCOPE;
import static com.vikadata.api.enums.labs.LabsFeatureScopeEnum.ofLabsFeatureScope;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.UNKNOWN_LABS_FEATURE_TYPE;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.ofLabsFeatureType;
import static com.vikadata.define.constants.RedisConstants.ERROR_PWD_NUM_DIR;

/**
 * <p>
 * 用于vika-cli命令行工具中的GM指令
 * </p>
 *
 * @author Kelly Chen
 */
@RestController
@Api(tags = "Cli 总部控制接口", hidden = true)
@ApiResource(path = "/gm")
@Slf4j
public class GmController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IUserService userService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ValidateCodeRepository validateCodeRepository;

    @Resource
    private NotificationFactory notificationFactory;

    @Resource
    private IIdaasTenantService idaasTenantService;

    @Resource
    private IIdaasAppBindService idaasAppBindService;

    @Resource
    private ILabsApplicantService iLabsApplicantService;

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialCpIsvService iSocialCpIsvService;

    @Resource
    private IBundleService iBundleService;

    @PostResource(path = "/permission/update", requiredPermission = false)
    @ApiOperation(value = "更新GM权限配置")
    public ResponseData<Void> updatePermission(@RequestBody ConfigDatasheetRo ro) {
        iGmService.updateGmPermissionConfig(SessionContext.getUserId(), ro.getDatasheetId());
        return ResponseData.success();
    }

    @PostResource(path = "/new/user", requiredPermission = false)
    @ApiOperation(value = "新建用户(不正规的马甲号，用于测试)", notes = "新建一个用户，传入username和password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<HqAddUserVo> createUser(@RequestBody @Valid HqAddUserRo ro) {
        // 限制邮箱范围
        if (!ro.getUsername().endsWith("@vikadata.com") || !ro.getUsername().startsWith("test")) {
            throw new BusinessException("请使用以【test】开头的【@vikadata.com】测试邮箱！如：test001@vikadata.com");
        }
        // 限制手机号范围
        if (StrUtil.isNotBlank(ro.getPhone()) && !ro.getPhone().startsWith(constProperties.getTestMobilePre())) {
            throw new BusinessException("测试手机号请以【" + constProperties.getTestMobilePre() + "】开头！");
        }
        // 创建用户
        userService.createUserByCli(ro.getUsername(), ro.getPassword(), ro.getPhone());
        HqAddUserVo vo = new HqAddUserVo();
        vo.setUsername(ro.getUsername());
        vo.setPassword(ro.getPassword());
        vo.setPhone(ro.getPhone());
        return ResponseData.success(vo);
    }

    @PostResource(path = "/new/users", requiredLogin = false)
    @ApiOperation(value = "批量新建用户(不正规的马甲号，用于测试)", notes = "新建一个用户，传入username和password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> createUsers() {
        //创建用户
        userService.createUsersByCli();
        return ResponseData.success();
    }

    @PostResource(path = "/lock", requiredPermission = false)
    @ApiOperation(value = "验证锁定")
    public ResponseData<Void> lock(@RequestBody @Valid UnlockRo ro) {
        log.info("操作者「{}」对目标「{}」进行类型「{}」的验证锁定", SessionContext.getUserId(), ro.getTarget(), ro.getType());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.VALIDATION_LOCK);
        Integer type = ro.getType();
        String lockedKey = this.getLockedKey(ro.getTarget(), type);
        redisTemplate.opsForValue().set(lockedKey, 5, type == 1 ? 1 : 20, TimeUnit.MINUTES);
        return ResponseData.success();
    }

    @PostResource(path = "/unlock", requiredPermission = false)
    @ApiOperation(value = "验证解锁")
    public ResponseData<Void> unlock(@RequestBody @Valid UnlockRo ro) {
        log.info("操作者「{}」对目标「{}」进行型「{}」的验证解锁", SessionContext.getUserId(), ro.getTarget(), ro.getType());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.VALIDATION_UNLOCK);
        String lockedKey = this.getLockedKey(ro.getTarget(), ro.getType());
        redisTemplate.delete(lockedKey);
        return ResponseData.success();
    }

    private String getLockedKey(String target, Integer type) {
        String lockedKey;
        switch (type) {
            case 0:
                Long userId = userMapper.selectIdByMobile(target);
                ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
                lockedKey = ERROR_PWD_NUM_DIR + userId;
                break;
            case 1:
                lockedKey = RedisConstants.getSendCaptchaRateKey(ValidateTarget.create(target).getIntactTarget());
                break;
            default:
                lockedKey = RedisConstants.getLockedKey(ValidateTarget.create(target).getIntactTarget());
                break;
        }
        return lockedKey;
    }

    @PostResource(path = "/reset/activity", requiredPermission = false)
    @ApiOperation(value = "重置用户的活动状态")
    public ResponseData<Void> resetActivity(@RequestBody(required = false) UserActivityRo ro) {
        Long userId = SessionContext.getUserId();
        if (ro != null && ro.getWizardId() != null) {
            // 删除指定的活动状态值
            String key = StrUtil.format("\"{}\"", ro.getWizardId());
            playerActivityMapper.updateActionsRemoveByUserId(userId, key);
        }
        else {
            // 重置全部的活动状态记录
            playerActivityMapper.updateActionsByUserId(userId, new JSONObject().toString());
        }
        // 删除缓存
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }

    @PostResource(path = "/assign/activity", requiredPermission = false)
    @ApiOperation(value = "指定用户的活动状态")
    public ResponseData<Void> assignActivity(@RequestBody UserActivityAssignRo ro) {
        log.info("操作者「{}」对用户「{}/{}」进行指定活动状态设置", SessionContext.getUserId(), ro.getTestMobile(), ro.getUserIds());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.USER_ACTIVITY_ASSIGN);
        // 参数校验
        ExceptionUtil.isTrue(ro.getWizardId() != null && ro.getValue() != null, ParameterException.INCORRECT_ARG);
        String key = StrUtil.format("\"{}\"", ro.getWizardId());
        // 优先取测试手机号
        if (ro.getTestMobile() != null) {
            Long userId = userMapper.selectIdByMobile(ro.getTestMobile());
            ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
            boolean flag = SqlHelper.retBool(playerActivityMapper.updateActionsByJsonSet(Collections.singletonList(userId), key, ro.getValue()));
            ExceptionUtil.isTrue(flag, EDIT_ERROR);
            // 删除缓存
            userLinkInfoService.delete(userId);
        }
        else {
            ExceptionUtil.isNotEmpty(ro.getUserIds(), ParameterException.INCORRECT_ARG);
            // 分批插入
            List<List<Long>> split = CollUtil.split(ro.getUserIds(), 100);
            for (List<Long> userIds : split) {
                playerActivityMapper.updateActionsByJsonSet(userIds, key, ro.getValue());
                // 删除缓存
                userIds.forEach(userId -> userLinkInfoService.delete(userId));
            }
        }
        return ResponseData.success();
    }

    @PostResource(path = "/new/player/notify", requiredPermission = false)
    @ApiOperation(value = "新建一条player通知", notes = "添加系统通知", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> addPlayerNotify(@RequestBody @Valid NotificationCreateRo ro) {
        log.info("操作者「{}」发布了一条系统通知", SessionContext.getUserId());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SYSTEM_NOTIFICATION_PUBLISH);
        NotificationTemplate template =
                notificationFactory.getTemplateById(ro.getTemplateId());
        if (ObjectUtil.isNull(template)) {
            throw new BusinessException("模版ID不存在");
        }
        // 目前只允许撤销系统通知
        if (!"system".equals(template.getNotificationsType())) {
            throw new BusinessException("目前不支持添加非系统消息");
        }
        String lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), "");
        Object extras = ro.getBody().get(BODY_EXTRAS);
        if (StrUtil.isNotBlank(ro.getVersion())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getVersion().replace(".", "_"));
            extras = JSONUtil.parseObj(JSONUtil.getByPath(ro.getBody(), BODY_EXTRAS)).putOnce(VERSION, ro.getVersion());
        }
        if (ObjectUtil.isNotNull(ro.getExpireAt())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getExpireAt());
            extras = JSONUtil.parseObj(JSONUtil.getByPath(ro.getBody(), BODY_EXTRAS)).putOnce(EXPIRE_AT, ro.getExpireAt());
        }
        Boolean lock = redisTemplate.opsForValue().setIfAbsent(lockedKey, 1);
        if (BooleanUtil.isFalse(lock)) {
            throw new BusinessException("不允许多次发布消息");
        }
        try {
            ro.setBody(JSONUtil.createObj().putOnce(BODY_EXTRAS, extras));
            boolean result;
            if (ObjectUtil.isNotNull(ro.getSocialPlatformType())) {
                result =
                        playerNotificationService.createNotifyWithoutVerify(notificationFactory.getSocialUserIds(SocialPlatformType.toEnum(ro.getSocialPlatformType())), template, ro);
            }
            else {
                result = playerNotificationService.batchCreateNotify(ListUtil.toList(ro));
            }
            if (result) {
                return ResponseData.success();
            }
        }
        catch (Exception e) {
            log.error("发送消息失败", e);
        }
        redisTemplate.delete(lockedKey);
        throw new BusinessException("发送消息失败");
    }

    @PostResource(path = "/revoke/player/notify", requiredPermission = false)
    @ApiOperation(value = "撤销一条player通知", notes = "撤销系统通知，从通知中心删除", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> revokePlayerNotify(@RequestBody @Valid NotificationRevokeRo ro) {
        log.info("操作者「{}」撤销了一条系统通知", SessionContext.getUserId());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SYSTEM_NOTIFICATION_REVOKE);
        NotificationTemplate template =
                notificationFactory.getTemplateById(ro.getTemplateId());
        if (ObjectUtil.isNull(template)) {
            throw new BusinessException("模版ID不存在");
        }
        // 目前只允许撤销系统通知
        if (!"system".equals(template.getNotificationsType())) {
            throw new BusinessException("目前不支持撤销非系统消息");
        }
        String lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), "");
        if (StrUtil.isNotBlank(ro.getVersion())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getVersion().replace(".", "_"));
        }
        if (ObjectUtil.isNotNull(ro.getExpireAt())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getExpireAt());
        }
        if (BooleanUtil.isFalse(redisTemplate.hasKey(lockedKey))) {
            throw new BusinessException("消息不存在,不支持撤销");
        }
        if (BooleanUtil.isTrue(redisTemplate.hasKey(lockedKey)) && redisTemplate.opsForValue().get(lockedKey) != null && Objects.equals(redisTemplate.opsForValue().get(lockedKey), ro.getRevokeType())) {
            throw new BusinessException("消息已经撤销, 请不要重复撤销");
        }
        boolean result = playerNotificationService.revokeNotification(ro);
        if (result) {
            redisTemplate.opsForValue().set(lockedKey, ro.getRevokeType());
            return ResponseData.success();
        }
        throw new BusinessException("撤销消息失败");
    }

    @GetResource(path = "/getCaptcha/{target}", requiredPermission = false)
    @ApiOperation(value = "获取验证码", hidden = true)
    public ResponseData<String> getCaptcha(@PathVariable("target") String target,
            @RequestParam(name = "type", required = false, defaultValue = "2") Integer type) {
        log.info("操作者「{}」获取目标「{}」类型「{}」的验证码", SessionContext.getUserId(), target, type);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.TEST_CAPTCHA);
        ValidateCodeType codeType;
        CodeValidateScope scope;
        if (Validator.isMobile(target)) {
            // 获取手机验证码
            if (!target.startsWith(constProperties.getTestMobilePre())) {
                throw new BusinessException("测试手机号请以【" + constProperties.getTestMobilePre() + "】开头！");
            }
            codeType = ValidateCodeType.SMS;
            scope = CodeValidateScope.fromName(SmsCodeType.fromName(type).name());
            target = StrUtil.addPrefixIfNot(target, "+86");
        }
        else if (Validator.isEmail(target)) {
            // 获取邮箱验证码
            if (!target.endsWith("@vikadata.com") || !target.startsWith("test")) {
                throw new BusinessException("请使用以【test】开头的【@vikadata.com】测试邮箱！如：test001@vikadata.com");
            }
            codeType = ValidateCodeType.EMAIL;
            scope = CodeValidateScope.fromName(EmailCodeType.fromName(type).name());
        }
        else {
            throw new BusinessException("请输出指定格式的手机号或邮箱！");
        }
        String randomCode = RandomUtil.randomNumbers(6);
        ValidateCode validateCode = new ValidateCode(randomCode, scope.name().toLowerCase(), 600);
        // 存储验证码
        validateCodeRepository.save(codeType.toString().toLowerCase(), validateCode, target, 600);
        // 存储验证码业务类型
        String scopeKey = RedisConstants.getCaptchaScopeKey(codeType.toString().toLowerCase(), target);
        redisTemplate.opsForValue().set(scopeKey, scope.name().toLowerCase(), 10, TimeUnit.MINUTES);
        return ResponseData.success(randomCode);
    }

    @PostResource(path = "/labs/features", requiredPermission = false)
    @ApiOperation(value = "创建实验性功能")
    public ResponseData<GmLabFeatureVo> createLabsFeature(@RequestBody @Valid GmLabsFeatureCreatorRo gmLabsFeatureCreatorRo) {
        log.info("操作者「{}」创建实验性功能「{}」", SessionContext.getUserId(), gmLabsFeatureCreatorRo.getKey());
        //校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_CREATE);
        // 校验实验性功能唯一标识
        LabsFeatureEnum featureEnum = ofLabsFeature(gmLabsFeatureCreatorRo.getKey());
        ExceptionUtil.isFalse(Objects.equals(featureEnum, UNKNOWN_LAB_FEATURE), FEATURE_KEY_IS_NOT_EXIST);
        // 校验实验性功能作用域
        LabsFeatureScopeEnum scopeEnum = ofLabsFeatureScope(gmLabsFeatureCreatorRo.getScope());
        ExceptionUtil.isFalse(Objects.equals(scopeEnum, UNKNOWN_SCOPE), FEATURE_SCOPE_IS_NOT_EXIST);
        // 校验实验性功能类型
        LabsFeatureTypeEnum labsFeatureTypeEnum = ofLabsFeatureType(gmLabsFeatureCreatorRo.getType());
        ExceptionUtil.isFalse(Objects.equals(labsFeatureTypeEnum, UNKNOWN_LABS_FEATURE_TYPE), FEATURE_TYPE_IS_NOT_EXIST);

        LabsFeaturesEntity currentLabsFeature = iLabsFeatureService.getCurrentLabsFeature(featureEnum.getFeatureName(), scopeEnum.getScopeName());
        if (Objects.isNull(currentLabsFeature)) {
            assert labsFeatureTypeEnum != null;
            boolean saved = iLabsFeatureService.save(LabsFeaturesEntity.builder()
                    .featureKey(featureEnum.name())
                    .featureScope(scopeEnum.getScopeCode())
                    .type(labsFeatureTypeEnum.getType())
                    .url(gmLabsFeatureCreatorRo.getUrl())
                    .build());
            ExceptionUtil.isTrue(saved, INSERT_ERROR);
            return ResponseData.success(GmLabFeatureVo.builder()
                    .featureKey(featureEnum.getFeatureName())
                    .featureScope(scopeEnum.getScopeName())
                    .type(labsFeatureTypeEnum.getFeatureKey())
                    .url(gmLabsFeatureCreatorRo.getUrl())
                    .open(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        return ResponseData.success(GmLabFeatureVo.builder()
                .featureKey(ofLabsFeature(currentLabsFeature.getFeatureKey()).getFeatureName())
                .featureScope(ofLabsFeatureScope(currentLabsFeature.getFeatureScope()).getScopeName())
                .type(ofLabsFeatureType(currentLabsFeature.getType()).getFeatureKey())
                .url(currentLabsFeature.getUrl())
                .open(!currentLabsFeature.getIsDeleted())
                .createdAt(currentLabsFeature.getCreatedAt())
                .updatedAt(currentLabsFeature.getUpdatedAt())
                .build());
    }

    @PostResource(path = "/labs/updateAttribute", requiredPermission = false)
    @ApiOperation(value = "修改实验室功能属性")
    public ResponseData<Void> updateLabsFeaturesAttribute(@RequestBody GmLabsFeatureCreatorRo gmLabsFeatureCreatorRo) {
        log.info("操作者「{}」修改实验性功能「{}」", SessionContext.getUserId(), gmLabsFeatureCreatorRo.getKey());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_EDIT);
        iLabsFeatureService.updateLabsFeatureAttribute(gmLabsFeatureCreatorRo);
        return ResponseData.success();
    }

    @PostResource(path = "/labs", requiredPermission = false)
    @ApiOperation(value = "为申请者开通实验室功能")
    public ResponseData<Void> applyLabsFeature(@RequestBody @Valid GmApplyFeatureRo applyFeatureRo) {
        Long applyUser = userMapper.selectIdByUuid(applyFeatureRo.getApplyUserId());
        ExceptionUtil.isNotNull(applyUser, USER_NOT_EXIST);
        String applicant = StrUtil.isNotBlank(applyFeatureRo.getSpaceId()) ?
                applyFeatureRo.getSpaceId() :
                String.valueOf(applyUser);
        // 校验spaceId，如果违法不允许开通
        SpaceEntity applyVikaSpace = spaceMapper.selectBySpaceId(applyFeatureRo.getSpaceId());
        ExceptionUtil.isNotNull(applyVikaSpace, SPACE_NOT_EXIST);
        // 如果featureKey错误，不允许申请开通；
        String featureKey = ofLabsFeature(applyFeatureRo.getFeatureKey()).name();
        ExceptionUtil.isFalse(featureKey.equals(UNKNOWN_LAB_FEATURE.name()), FEATURE_KEY_IS_NOT_EXIST);
        int applicantType = StrUtil.isNotBlank(applyFeatureRo.getSpaceId()) ?
                SPACE_LEVEL_FEATURE.getCode() : USER_LEVEL_FEATURE.getCode();
        LabsApplicantEntity existLabsApplicant = iLabsApplicantService.getApplicantByApplicantAndFeatureKey(applicant, featureKey);
        if (Objects.isNull(existLabsApplicant) && applyFeatureRo.getEnable()) {
            boolean saveOrUpdated = iLabsApplicantService.save(LabsApplicantEntity.builder()
                    .applicantType(applicantType)
                    .applicant(applicant)
                    .featureKey(featureKey)
                    .createdBy(applyUser)
                    .build());
            ExceptionUtil.isTrue(saveOrUpdated, INSERT_ERROR);
            // 开通成功后发送站内通知(除申请者以外的其他成员)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL,
                    Collections.singletonList(applyUser), applyUser, applyFeatureRo);
            // 开通成功后发送站内通知(申请者自己)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME,
                    Collections.singletonList(applyUser), 0L, applyFeatureRo);
            return ResponseData.success();
        }
        // 开启内测功能
        if (applyFeatureRo.getEnable()) {
            iLabsApplicantService.openApplicantFeature(existLabsApplicant.getId());
            // 开通成功后发送站内通知(除申请者以外的其他成员)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL,
                    Collections.singletonList(applyUser), applyUser, applyFeatureRo);
            // 开通成功后发送站内通知(申请者自己)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME,
                    Collections.singletonList(applyUser), 0L, applyFeatureRo);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/labs/features/{featureKey}/delete", requiredPermission = false)
    @ApiOperation(value = "删除实验性功能")
    @ApiImplicitParam(name = "featureKey", value = "实验性功能唯一标识", dataTypeClass = String.class, required = true, example = "render_prompt|async_compute|robot|widget_center")
    public ResponseData<Void> deleteLabsFeature(@PathVariable("featureKey") String featureKey) {
        log.info("操作者「{}」删除实验性功能「{}」", SessionContext.getUserId(), featureKey);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_DELETE);
        LabsFeaturesEntity existLabsFeature = iLabsFeatureService.getExistLabsFeature(ofLabsFeature(featureKey).name());
        if (Objects.isNull(existLabsFeature)) {
            return ResponseData.error(String.format("%s不存在，无法删除", featureKey));
        }
        int count = iLabsFeatureService.deleteLabsFeature(existLabsFeature.getId());
        return count > 0 ?
                ResponseData.success() :
                ResponseData.error("删除实验性功能失败...");
    }

    @PostResource(path = "/users/{uuid}/close", requiredPermission = false)
    @ApiOperation(value = "关闭注销冷静期账号")
    public ResponseData<Void> closeAccountDirectly(@PathVariable(name = "uuid") String userUuid) {
        log.info("操作者「{}」关闭注销冷静期账号「{}」", SessionContext.getUserId(), userUuid);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.PAUSED_ACCOUNT_CLOSE);
        // 查询当前用户
        Long logoutUserId = userMapper.selectIdByUuid(userUuid);
        UserEntity user = userMapper.selectById(logoutUserId);
        // 该账号不存在或已注销
        if (user == null) {
            return ResponseData.error("该帐号不存在或已注销");
        }
        // 账号没有处在注销冷静期, 返回异常.
        if (!user.getIsPaused()) {
            return ResponseData.error("该帐号未发起注销请求，无法删除账号");
        }
        // 关闭账号，清除账号数据
        userService.closeAccount(user);

        // 清除该用户的cookie信息
        iUserService.closeMultiSession(logoutUserId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/operateBlacklist", requiredPermission = false)
    @ApiOperation(value = "设置空间黑名单", hidden = true)
    public ResponseData<Void> setBlacklist(@RequestBody SpaceBlacklistRo ro) {
        log.info("操作者「{}」对空间「{}」进行黑名单设置", SessionContext.getUserId(), ro.getSpaceIds());
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.BLACK_SPACE_SET);
        List<BaseSpaceInfoDto> spaceInfos = spaceMapper.selectBaseSpaceInfo(ro.getSpaceIds());
        if (CollUtil.isEmpty(spaceInfos)) {
            throw new BusinessException("空间不存在");
        }

        for (BaseSpaceInfoDto info : spaceInfos) {
            SpaceGlobalFeature feature = SpaceGlobalFeature.builder().blackSpace(ro.getStatus()).build();
            iSpaceService.switchSpacePros(1L, info.getSpaceId(), feature);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/space/certification", requiredPermission = false)
    @ApiOperation(value = "空间站认证", hidden = true)
    public ResponseData<Void> spaceCertification(@RequestBody SpaceCertificationRo ro) {
        log.info("操作者「{}」对空间「{}」进行认证", SessionContext.getUserId(), ro.getSpaceId());
        SpaceCertification certification = SpaceCertification.toEnum(ro.getCertification());
        ExceptionUtil.isTrue(certification != null, UPDATE_SPACE_INFO_FAIL);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SPACE_CERTIFY);
        // 空间站认证
        iGmService.spaceCertification(ro.getSpaceId(), ro.getUuid(), certification);
        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/event", requiredPermission = false)
    @ApiOperation(value = "手动执行企微服务商事件", hidden = true)
    public ResponseData<String> postWecomIsvEvent(@RequestBody @Validated WeComIsvEventRo request) {
        log.info("操作者「{}」手动执行企微服务商事件「{}」", SessionContext.getUserId(), request.getEventId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_EVENT);

        SocialCpIsvMessageEntity messageEntity = socialCpIsvMessageService.getById(request.getEventId());
        if (Objects.nonNull(messageEntity)) {
            try {
                socialCpIsvMessageService.doUnprocessedInfo(messageEntity);
                socialCpIsvMessageService.updateStatusById(messageEntity.getId(), SocialCpIsvMessageProcessStatus.SUCCESS);
                return ResponseData.success(messageEntity.getMessage());
            }
            catch (WxErrorException ex) {
                socialCpIsvMessageService.updateStatusById(messageEntity.getId(), SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY);
                return ResponseData.success(ex.getError().getErrorMsg());
            }
        }

        return ResponseData.success("non");
    }

    @PostResource(path = "/wecom/isv/newSpace", requiredPermission = false)
    @ApiOperation(value = "为手动删除了空间站的企微服务商重新创建空间站", hidden = true)
    public ResponseData<Void> postWecomIsvNewSpace(@RequestBody @Validated WeComIsvNewSpaceRo request) {
        log.info("操作者「{}」手动为租户「{}」重新创建空间站", SessionContext.getUserId(), request.getAuthCorpId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_NEW_SPACE);

        socialCpIsvService.createNewSpace(request.getSuiteId(), request.getAuthCorpId());

        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/permit/newOrder", requiredPermission = false)
    @ApiOperation(value = "企微服务商下单购买接口许可", hidden = true)
    public ResponseData<WeComIsvPermitNewOrderVo> postWecomIsvPermitNewOrder(@RequestBody @Validated WeComIsvPermitNewOrderRo request) {
        log.info("操作者「{}」手动执行为空间站「{}」下单购买接口许可", SessionContext.getUserId(), request.getSpaceId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_NEW_ORDER);

        SocialWecomPermitOrderEntity orderWecomEntity = socialCpIsvPermitService.createNewOrder(request.getSpaceId(), request.getDurationMonths());
        WeComIsvPermitNewOrderVo newOrderVo = new WeComIsvPermitNewOrderVo();
        newOrderVo.setId(orderWecomEntity.getId());
        newOrderVo.setOrderId(orderWecomEntity.getOrderId());

        return ResponseData.success(newOrderVo);
    }

    /**
     * Migrate wecom isv orders to billing
     *
     * @param request Request body
     * @return Response body
     * @author Codeman
     * @date 2022-09-02 11:32:33
     */
    @PostResource(path = "/wecom/isv/order/migrate", requiredPermission = false)
    @ApiOperation(value = "Migrate wecom isv orders to billing", hidden = true)
    public ResponseData<Void> postWecomIsvOrderMigrate(@RequestBody @Validated WeComIsvOrderMigrateRo request) {
        String spaceId = request.getSpaceId();
        log.info("Operator「{}」migrate wecom orders for space「{}」", SessionContext.getUserId(), spaceId);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_ORDER_MIGRATE);
        String appId = request.getSuiteId();
        // cp order start at 2022-01-01
        LocalDateTime startTime = ClockUtil.milliToLocalDateTime(1640966400000L, DEFAULT_TIME_ZONE);
        // get tenant order list
        Map<String, List<WxCpIsvGetOrder>> allOrderMap =
                iSocialCpIsvService.getOrderList(appId, startTime).stream().collect(Collectors.groupingBy(WxCpIsvGetOrder::getPaidCorpId));
        Map<String, List<WxCpIsvGetOrder>> orderMap = new HashMap<>();
        Set<String> trailSpaceIds = new HashSet<>();
        // cp isv don't have any orders, just in trail for all spaces
        if (CharSequenceUtil.isNotBlank(spaceId)) {
            Bundle bundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
            if (bundle != null) {
                log.warn("space has already been subscribed:{}", spaceId);
                return ResponseData.success();
            }
            allOrderMap.keySet().forEach(i -> {
                SocialTenantBindEntity bindInfo = socialTenantBindService.getByTenantIdAndAppId(i, appId);
                if (null != bindInfo && spaceId.equals(bindInfo.getSpaceId())) {
                    orderMap.put(i, allOrderMap.get(i));
                }
            });
            if (orderMap.isEmpty()) {
                trailSpaceIds.add(spaceId);
            }
        }
        else {
            List<String> spaceIds = socialTenantBindService.getAllSpaceIdsByAppId(request.getSuiteId());
            for (String corpId : allOrderMap.keySet()) {
                SocialTenantBindEntity bindInfo = socialTenantBindService.getByTenantIdAndAppId(corpId, appId);
                if (null == bindInfo) {
                    log.warn("wecom isv not bind space:{}", corpId);
                    continue;
                }
                Bundle bundle = iBundleService.getActivatedBundleBySpaceId(bindInfo.getSpaceId());
                if (bundle != null) {
                    log.warn("space has already been subscribed:{}", bindInfo.getSpaceId());
                    continue;
                }
                if (spaceIds.contains(bindInfo.getSpaceId())) {
                    orderMap.put(corpId, allOrderMap.get(corpId));
                }
                else {
                    trailSpaceIds.add(bindInfo.getSpaceId());
                }
            }
        }
        if (!trailSpaceIds.isEmpty()) {
            trailSpaceIds.forEach(id -> SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).migrateEvent(id));
        }
        for (String corpId : orderMap.keySet()) {
            try {
                iSocialCpIsvService.migrateOrderEvent(CollectionUtil.sort(orderMap.get(corpId),
                        Comparator.comparing(WxCpIsvGetOrder::getOrderStatus).thenComparing(WxCpIsvGetOrder::getPaidTime)));
            }
            catch (Exception e) {
                log.error("wecom migrate order error:{}", corpId, e);
            }
        }
        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/permit/activate", requiredPermission = false)
    @ApiOperation(value = "企微服务商激活接口许可", hidden = true)
    public ResponseData<Void> postWecomIsvPermitActivate(@RequestBody @Validated WeComIsvPermitActivateRo request) {
        log.info("操作者「{}」手动执行为订单「{}」激活接口许可", SessionContext.getUserId(), request.getOrderId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_ACTIVATE);

        socialCpIsvPermitService.activateOrder(request.getOrderId());

        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/permit/renewal", requiredPermission = false)
    @ApiOperation(value = "企微服务商下单续期接口许可", hidden = true)
    public ResponseData<WeComIsvPermitRenewalVo> postWecomIsvPermitRenewal(@RequestBody @Validated WeComIsvPermitRenewalRo request) {
        log.info("操作者「{}」手动执行为空间站「{}」续期接口许可", SessionContext.getUserId(), request.getSpaceId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_RENEWAL);

        SocialWecomPermitOrderEntity orderWecomEntity = socialCpIsvPermitService.renewalCpUser(request.getSpaceId(), request.getCpUserIds(), request.getDurationMonths());
        WeComIsvPermitRenewalVo renewalVo = new WeComIsvPermitRenewalVo();
        renewalVo.setId(orderWecomEntity.getId());
        renewalVo.setOrderId(orderWecomEntity.getOrderId());

        return ResponseData.success(renewalVo);
    }

    @PostResource(path = "/wecom/isv/permit/ensureAll", requiredPermission = false)
    @ApiOperation(value = "企微服务商确认订单及其企业下所有账号的最新信息", hidden = true)
    public ResponseData<Void> postWecomIsvPermitEnsureAll(@RequestBody @Validated WeComIsvPermitEnsureAllRo request) {
        log.info("操作者「{}」手动执行为订单「{}」确认账号信息", SessionContext.getUserId(), request.getOrderId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_ENSURE_ALL);

        socialCpIsvPermitService.ensureOrderAndAllActiveCodes(request.getOrderId());

        return ResponseData.success();
    }

    @PostResource(path = "/social/tenant/{tenantId}/event", requiredPermission = false)
    @ApiOperation(value = "手动执行补偿飞书事件")
    public ResponseData<Void> feishuTenantEvent(@PathVariable("tenantId") String tenantId) {
        log.info("操作者「{}」手动执行补偿租户「{}」的飞书事件", SessionContext.getUserId(), tenantId);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.FEISHU_EVENT_COMPENSATE);
        iGmService.handleFeishuEvent(tenantId);
        return ResponseData.success();
    }

    @PostResource(path = "/idaas/tenant/create", requiredLogin = false)
    @ApiOperation(value = "玉符 IDaaS 私有化部署创建租户及管理员", hidden = true)
    public ResponseData<IdaasTenantCreateVo> idaasTenantCreate(@RequestBody IdaasTenantCreateRo request) {
        log.info("玉符 IDaaS 私有化部署创建租户及管理员：" + JSONUtil.toJsonStr(request));
        IdaasTenantCreateVo idaasTenantCreateVo = idaasTenantService.createTenant(request);
        return ResponseData.success(idaasTenantCreateVo);
    }

    @PostResource(path = "/idaas/app/bind", requiredLogin = false)
    @ApiOperation(value = "玉符 IDaaS 私有化部署绑定应用和空间站", hidden = true)
    public ResponseData<IdaasAppBindVo> idaasAppBind(@RequestBody IdaasAppBindRo request) {
        log.info("玉符 IDaaS 私有化部署绑定应用和空间站：" + JSONUtil.toJsonStr(request));
        IdaasAppBindVo idaasAppBindVo = idaasAppBindService.bindTenantApp(request);
        return ResponseData.success(idaasAppBindVo);
    }

    @PostResource(path = "/user/writeContactInfo", requiredPermission = false)
    @ApiOperation(value = "query user's mobile phone and email by user's id")
    public ResponseData<Void> userContactInfoQuery(@RequestBody QueryUserInfoRo ro) {
        log.info("Operator 「{}」 query user mobile phone and email", SessionContext.getUserId());
        // check permission
        iGmService.validPermission(SessionContext.getUserId(), GmAction.CONTACT_INFO_QUERY);
        // query and write back user's mobile phone and email
        iGmService.queryAndWriteBackUserContactInfo(ro.getHost(), ro.getDatasheetId(), ro.getViewId(), ro.getToken());
        return ResponseData.success();
    }
}

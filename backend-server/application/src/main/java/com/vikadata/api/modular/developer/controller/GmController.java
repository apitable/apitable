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
import com.vikadata.core.constants.RedisConstants;
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
import static com.vikadata.core.constants.RedisConstants.ERROR_PWD_NUM_DIR;

/**
 * <p>
 *  Used for GM command in vika-cli command line tool
 * </p>
 */
@RestController
@Api(tags = "Cli Office GM API", hidden = true)
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
    @ApiOperation(value = "Update GM permission config")
    public ResponseData<Void> updatePermission(@RequestBody ConfigDatasheetRo ro) {
        iGmService.updateGmPermissionConfig(SessionContext.getUserId(), ro.getDatasheetId());
        return ResponseData.success();
    }

    @PostResource(path = "/new/user", requiredPermission = false)
    @ApiOperation(value = "Create user(Irregular vest number, used for testing)", notes = "create a user by username and password.", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<HqAddUserVo> createUser(@RequestBody @Valid HqAddUserRo ro) {
        // Limit mailbox range.
        if (!ro.getUsername().endsWith("@vikadata.com") || !ro.getUsername().startsWith("test")) {
            throw new BusinessException("Please use the [@vikadata.com] test email starting with [test]! Such as: test001@vikadata.com");
        }
        // Limit phone number range.
        if (StrUtil.isNotBlank(ro.getPhone()) && !ro.getPhone().startsWith(constProperties.getTestMobilePre())) {
            throw new BusinessException("Test phone number please begin with " + constProperties.getTestMobilePre());
        }
        // Create a user.
        userService.createUserByCli(ro.getUsername(), ro.getPassword(), ro.getPhone());
        HqAddUserVo vo = new HqAddUserVo();
        vo.setUsername(ro.getUsername());
        vo.setPassword(ro.getPassword());
        vo.setPhone(ro.getPhone());
        return ResponseData.success(vo);
    }

    @PostResource(path = "/new/users", requiredLogin = false)
    @ApiOperation(value = "Batch Create user(Irregular vest number, used for testing)", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> createUsers() {
        // Create a user
        userService.createUsersByCli();
        return ResponseData.success();
    }

    @PostResource(path = "/lock", requiredPermission = false)
    @ApiOperation(value = "Lock verification")
    public ResponseData<Void> lock(@RequestBody @Valid UnlockRo ro) {
        log.info("The operator [{}] lock type [{}] verification for target [{}].", SessionContext.getUserId(), ro.getTarget(), ro.getType());
        // Verify permissions
        iGmService.validPermission(SessionContext.getUserId(), GmAction.VALIDATION_LOCK);
        Integer type = ro.getType();
        String lockedKey = this.getLockedKey(ro.getTarget(), type);
        redisTemplate.opsForValue().set(lockedKey, 5, type == 1 ? 1 : 20, TimeUnit.MINUTES);
        return ResponseData.success();
    }

    @PostResource(path = "/unlock", requiredPermission = false)
    @ApiOperation(value = "Unlock verification                                        ")
    public ResponseData<Void> unlock(@RequestBody @Valid UnlockRo ro) {
        log.info("The operator [{}] unlock type [{}] verification for target [{}]", SessionContext.getUserId(), ro.getTarget(), ro.getType());
        // Verify permissions
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
    @ApiOperation(value = "Reset the active state of the user")
    public ResponseData<Void> resetActivity(@RequestBody(required = false) UserActivityRo ro) {
        Long userId = SessionContext.getUserId();
        if (ro != null && ro.getWizardId() != null) {
            // Deletes the specified active state value
            String key = StrUtil.format("\"{}\"", ro.getWizardId());
            playerActivityMapper.updateActionsRemoveByUserId(userId, key);
        }
        else {
            // Reset all active state records
            playerActivityMapper.updateActionsByUserId(userId, new JSONObject().toString());
        }
        // Delete the cache
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }

    @PostResource(path = "/assign/activity", requiredPermission = false)
    @ApiOperation(value = "Specifies the active state of the user")
    public ResponseData<Void> assignActivity(@RequestBody UserActivityAssignRo ro) {
        log.info("The operator「{}」specifies the active state of the user [{}/{}].", SessionContext.getUserId(), ro.getTestMobile(), ro.getUserIds());
        // Verify permissions.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.USER_ACTIVITY_ASSIGN);
        // Verify parameters.
        ExceptionUtil.isTrue(ro.getWizardId() != null && ro.getValue() != null, ParameterException.INCORRECT_ARG);
        String key = StrUtil.format("\"{}\"", ro.getWizardId());
        // The test phone number is preferred.
        if (ro.getTestMobile() != null) {
            Long userId = userMapper.selectIdByMobile(ro.getTestMobile());
            ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
            boolean flag = SqlHelper.retBool(playerActivityMapper.updateActionsByJsonSet(Collections.singletonList(userId), key, ro.getValue()));
            ExceptionUtil.isTrue(flag, EDIT_ERROR);
            // Delete the cache
            userLinkInfoService.delete(userId);
        }
        else {
            ExceptionUtil.isNotEmpty(ro.getUserIds(), ParameterException.INCORRECT_ARG);
            // Partial insert
            List<List<Long>> split = CollUtil.split(ro.getUserIds(), 100);
            for (List<Long> userIds : split) {
                playerActivityMapper.updateActionsByJsonSet(userIds, key, ro.getValue());
                // Delete the cache
                userIds.forEach(userId -> userLinkInfoService.delete(userId));
            }
        }
        return ResponseData.success();
    }

    @PostResource(path = "/new/player/notify", requiredPermission = false)
    @ApiOperation(value = "Create a player notification", notes = "Adding system notification.", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> addPlayerNotify(@RequestBody @Valid NotificationCreateRo ro) {
        log.info("The operator「{}」issue a system notification ", SessionContext.getUserId());
        // Verify permissions.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SYSTEM_NOTIFICATION_PUBLISH);
        NotificationTemplate template =
                notificationFactory.getTemplateById(ro.getTemplateId());
        if (ObjectUtil.isNull(template)) {
            throw new BusinessException("The template id does not exist");
        }
        // Currently, only system notifications can be revoked
        if (!"system".equals(template.getNotificationsType())) {
            throw new BusinessException("Adding non-system messages is not currently supported");
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
            throw new BusinessException("Multiple messages are not allowed to be published");
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
            log.error("Sending a message failed.", e);
        }
        redisTemplate.delete(lockedKey);
        throw new BusinessException("Sending a message failed.");
    }

    @PostResource(path = "/revoke/player/notify", requiredPermission = false)
    @ApiOperation(value = "Cancel a player notification", notes = "Cancel a player notification, deleted from the notification center", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> revokePlayerNotify(@RequestBody @Valid NotificationRevokeRo ro) {
        log.info("The operator「{}」cancels a player notification", SessionContext.getUserId());
        // Verify permission.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SYSTEM_NOTIFICATION_REVOKE);
        NotificationTemplate template =
                notificationFactory.getTemplateById(ro.getTemplateId());
        if (ObjectUtil.isNull(template)) {
            throw new BusinessException("The template id does not exist");
        }
        // Currently, only system notifications can be revoked
        if (!"system".equals(template.getNotificationsType())) {
            throw new BusinessException("Undoing non-system messages is not currently supported.");
        }
        String lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), "");
        if (StrUtil.isNotBlank(ro.getVersion())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getVersion().replace(".", "_"));
        }
        if (ObjectUtil.isNotNull(ro.getExpireAt())) {
            lockedKey = RedisConstants.getNotificationLockedKey(ro.getTemplateId(), ro.getExpireAt());
        }
        if (BooleanUtil.isFalse(redisTemplate.hasKey(lockedKey))) {
            throw new BusinessException("The message does not exist. Undoing is not supported.");
        }
        if (BooleanUtil.isTrue(redisTemplate.hasKey(lockedKey)) && redisTemplate.opsForValue().get(lockedKey) != null && Objects.equals(redisTemplate.opsForValue().get(lockedKey), ro.getRevokeType())) {
            throw new BusinessException("The message has been revoked. Please do not undo it again.");
        }
        boolean result = playerNotificationService.revokeNotification(ro);
        if (result) {
            redisTemplate.opsForValue().set(lockedKey, ro.getRevokeType());
            return ResponseData.success();
        }
        throw new BusinessException("Failed to undo the message.");
    }

    @GetResource(path = "/getCaptcha/{target}", requiredPermission = false)
    @ApiOperation(value = "Get captcha", hidden = true)
    public ResponseData<String> getCaptcha(@PathVariable("target") String target,
            @RequestParam(name = "type", required = false, defaultValue = "2") Integer type) {
        log.info("The operator「{}」get type [{}]captcha for target [{}]", SessionContext.getUserId(), target, type);
        // Verify permission.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.TEST_CAPTCHA);
        ValidateCodeType codeType;
        CodeValidateScope scope;
        if (Validator.isMobile(target)) {
            // Obtain the mobile phone verification code
            if (!target.startsWith(constProperties.getTestMobilePre())) {
                throw new BusinessException("Please the test mobile phone number begin [" + constProperties.getTestMobilePre() + "]");
            }
            codeType = ValidateCodeType.SMS;
            scope = CodeValidateScope.fromName(SmsCodeType.fromName(type).name());
            target = StrUtil.addPrefixIfNot(target, "+86");
        }
        else if (Validator.isEmail(target)) {
            // Obtain the email verification code
            if (!target.endsWith("@vikadata.com") || !target.startsWith("test")) {
                throw new BusinessException("Please use the [@vikadata.com] test email starting with [test]!such as: test001@vikadata.com");
            }
            codeType = ValidateCodeType.EMAIL;
            scope = CodeValidateScope.fromName(EmailCodeType.fromName(type).name());
        }
        else {
            throw new BusinessException("Please output the specified format of mobile phone number or email!");
        }
        String randomCode = RandomUtil.randomNumbers(6);
        ValidateCode validateCode = new ValidateCode(randomCode, scope.name().toLowerCase(), 600);
        // storage verification code.
        validateCodeRepository.save(codeType.toString().toLowerCase(), validateCode, target, 600);
        // storage verification code service type.
        String scopeKey = RedisConstants.getCaptchaScopeKey(codeType.toString().toLowerCase(), target);
        redisTemplate.opsForValue().set(scopeKey, scope.name().toLowerCase(), 10, TimeUnit.MINUTES);
        return ResponseData.success(randomCode);
    }

    @PostResource(path = "/labs/features", requiredPermission = false)
    @ApiOperation(value = "Create laboratory feature")
    public ResponseData<GmLabFeatureVo> createLabsFeature(@RequestBody @Valid GmLabsFeatureCreatorRo gmLabsFeatureCreatorRo) {
        log.info("The operator「{}」laboratory feature「{}」", SessionContext.getUserId(), gmLabsFeatureCreatorRo.getKey());
        // Verify permissions
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_CREATE);
        // Verify the laboratory feature unique identifier.
        LabsFeatureEnum featureEnum = ofLabsFeature(gmLabsFeatureCreatorRo.getKey());
        ExceptionUtil.isFalse(Objects.equals(featureEnum, UNKNOWN_LAB_FEATURE), FEATURE_KEY_IS_NOT_EXIST);
        // Verify the laboratory feature scope.
        LabsFeatureScopeEnum scopeEnum = ofLabsFeatureScope(gmLabsFeatureCreatorRo.getScope());
        ExceptionUtil.isFalse(Objects.equals(scopeEnum, UNKNOWN_SCOPE), FEATURE_SCOPE_IS_NOT_EXIST);
        // Verify the laboratory feature type.
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
    @ApiOperation(value = "Modify laboratory feature attribute")
    public ResponseData<Void> updateLabsFeaturesAttribute(@RequestBody GmLabsFeatureCreatorRo gmLabsFeatureCreatorRo) {
        log.info("The operator「{}」Modify laboratory feature「{}」", SessionContext.getUserId(), gmLabsFeatureCreatorRo.getKey());
        // Verify permissions
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_EDIT);
        iLabsFeatureService.updateLabsFeatureAttribute(gmLabsFeatureCreatorRo);
        return ResponseData.success();
    }

    @PostResource(path = "/labs", requiredPermission = false)
    @ApiOperation(value = "Open laboratory feature for applicants")
    public ResponseData<Void> applyLabsFeature(@RequestBody @Valid GmApplyFeatureRo applyFeatureRo) {
        Long applyUser = userMapper.selectIdByUuid(applyFeatureRo.getApplyUserId());
        ExceptionUtil.isNotNull(applyUser, USER_NOT_EXIST);
        String applicant = StrUtil.isNotBlank(applyFeatureRo.getSpaceId()) ?
                applyFeatureRo.getSpaceId() :
                String.valueOf(applyUser);
        // Verify the space id. If the space id is illegal, it cannot be opened
        SpaceEntity applyVikaSpace = spaceMapper.selectBySpaceId(applyFeatureRo.getSpaceId());
        ExceptionUtil.isNotNull(applyVikaSpace, SPACE_NOT_EXIST);
        // If the feature Key is incorrect, the application for opening is not allowed.
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
            // Send space notification after successful opening.(members except applicant)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL,
                    Collections.singletonList(applyUser), applyUser, applyFeatureRo);
            // Send space notification after successful opening. (applicant)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME,
                    Collections.singletonList(applyUser), 0L, applyFeatureRo);
            return ResponseData.success();
        }
        // Enable the private test function
        if (applyFeatureRo.getEnable()) {
            iLabsApplicantService.openApplicantFeature(existLabsApplicant.getId());
            // Send space notification after successful opening.(members except applicant)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL,
                    Collections.singletonList(applyUser), applyUser, applyFeatureRo);
            // Send space notification after successful opening. (applicant)
            iLabsApplicantService.sendNotification(NotificationTemplateId.APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME,
                    Collections.singletonList(applyUser), 0L, applyFeatureRo);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/labs/features/{featureKey}/delete", requiredPermission = false)
    @ApiOperation(value = "Remove laboratory feature")
    @ApiImplicitParam(name = "featureKey", value = "laboratory feature unique identifier", dataTypeClass = String.class, required = true, example = "render_prompt|async_compute|robot|widget_center")
    public ResponseData<Void> deleteLabsFeature(@PathVariable("featureKey") String featureKey) {
        log.info("The operator「{}」delete laboratory feature「{}」", SessionContext.getUserId(), featureKey);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.LAB_FEATURE_DELETE);
        LabsFeaturesEntity existLabsFeature = iLabsFeatureService.getExistLabsFeature(ofLabsFeature(featureKey).name());
        if (Objects.isNull(existLabsFeature)) {
            return ResponseData.error(String.format("%s does not exist and cannot be deleted", featureKey));
        }
        int count = iLabsFeatureService.deleteLabsFeature(existLabsFeature.getId());
        return count > 0 ?
                ResponseData.success() :
                ResponseData.error("Failed to delete the laboratory feature...");
    }

    @PostResource(path = "/users/{uuid}/close", requiredPermission = false)
    @ApiOperation(value = "Close paused account")
    public ResponseData<Void> closeAccountDirectly(@PathVariable(name = "uuid") String userUuid) {
        log.info("The operator「{}」close paused account「{}」", SessionContext.getUserId(), userUuid);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.PAUSED_ACCOUNT_CLOSE);
        Long logoutUserId = userMapper.selectIdByUuid(userUuid);
        UserEntity user = userMapper.selectById(logoutUserId);
        // The account does not exist or has been logged out
        if (user == null) {
            return ResponseData.error("The account does not exist or has been logged out.");
        }
        // An exception is displayed if the account is not in the logout cooling-off period.
        if (!user.getIsPaused()) {
            return ResponseData.error("The account cannot be deleted because it does not send a logout request.");
        }
        // Close the account and clear the account data
        userService.closeAccount(user);

        // Clear the cookie information of the user
        iUserService.closeMultiSession(logoutUserId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/operateBlacklist", requiredPermission = false)
    @ApiOperation(value = "Set blacklist", hidden = true)
    public ResponseData<Void> setBlacklist(@RequestBody SpaceBlacklistRo ro) {
        log.info("The operator「{}」add space「{}」into blacklist", SessionContext.getUserId(), ro.getSpaceIds());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.BLACK_SPACE_SET);
        List<BaseSpaceInfoDto> spaceInfos = spaceMapper.selectBaseSpaceInfo(ro.getSpaceIds());
        if (CollUtil.isEmpty(spaceInfos)) {
            throw new BusinessException("Space not exist.");
        }

        for (BaseSpaceInfoDto info : spaceInfos) {
            SpaceGlobalFeature feature = SpaceGlobalFeature.builder().blackSpace(ro.getStatus()).build();
            iSpaceService.switchSpacePros(1L, info.getSpaceId(), feature);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/space/certification", requiredPermission = false)
    @ApiOperation(value = "Authenticate space", hidden = true)
    public ResponseData<Void> spaceCertification(@RequestBody SpaceCertificationRo ro) {
        log.info("Operator [{}] authenticates the space [{}]", SessionContext.getUserId(), ro.getSpaceId());
        SpaceCertification certification = SpaceCertification.toEnum(ro.getCertification());
        ExceptionUtil.isTrue(certification != null, UPDATE_SPACE_INFO_FAIL);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SPACE_CERTIFY);
        iGmService.spaceCertification(ro.getSpaceId(), ro.getUuid(), certification);
        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/event", requiredPermission = false)
    @ApiOperation(value = "Manually execute wecom isv event", hidden = true)
    public ResponseData<String> postWecomIsvEvent(@RequestBody @Validated WeComIsvEventRo request) {
        log.info("The operator「{}」manually execute wecom isv event「{}」", SessionContext.getUserId(), request.getEventId());
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
    @ApiOperation(value = "Recreate wecom isv space", hidden = true)
    public ResponseData<Void> postWecomIsvNewSpace(@RequestBody @Validated WeComIsvNewSpaceRo request) {
        log.info("The operator「{}」manually recreate space for tenant「{}」.", SessionContext.getUserId(), request.getAuthCorpId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_NEW_SPACE);

        socialCpIsvService.createNewSpace(request.getSuiteId(), request.getAuthCorpId());

        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/permit/newOrder", requiredPermission = false)
    @ApiOperation(value = "Permit wecom isv new order", hidden = true)
    public ResponseData<WeComIsvPermitNewOrderVo> postWecomIsvPermitNewOrder(@RequestBody @Validated WeComIsvPermitNewOrderRo request) {
        log.info("The operator「{}」manually permits wecom isv new order for space「{}」.", SessionContext.getUserId(), request.getSpaceId());
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
    @ApiOperation(value = "Permit wecom isv activate", hidden = true)
    public ResponseData<Void> postWecomIsvPermitActivate(@RequestBody @Validated WeComIsvPermitActivateRo request) {
        log.info("Operator「{}」manually permit wecom isv activate for order「{}」", SessionContext.getUserId(), request.getOrderId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_ACTIVATE);

        socialCpIsvPermitService.activateOrder(request.getOrderId());

        return ResponseData.success();
    }

    @PostResource(path = "/wecom/isv/permit/renewal", requiredPermission = false)
    @ApiOperation(value = "Permit wecom isv renewal", hidden = true)
    public ResponseData<WeComIsvPermitRenewalVo> postWecomIsvPermitRenewal(@RequestBody @Validated WeComIsvPermitRenewalRo request) {
        log.info("Operator「{}」manually permit wecom isv renewal for space「{}」.", SessionContext.getUserId(), request.getSpaceId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_RENEWAL);

        SocialWecomPermitOrderEntity orderWecomEntity = socialCpIsvPermitService.renewalCpUser(request.getSpaceId(), request.getCpUserIds(), request.getDurationMonths());
        WeComIsvPermitRenewalVo renewalVo = new WeComIsvPermitRenewalVo();
        renewalVo.setId(orderWecomEntity.getId());
        renewalVo.setOrderId(orderWecomEntity.getOrderId());

        return ResponseData.success(renewalVo);
    }

    @PostResource(path = "/wecom/isv/permit/ensureAll", requiredPermission = false)
    @ApiOperation(value = "Ensure wecom isv account info", hidden = true)
    public ResponseData<Void> postWecomIsvPermitEnsureAll(@RequestBody @Validated WeComIsvPermitEnsureAllRo request) {
        log.info("Operator「{}」manually ensure wecom isv account info for order「{}」", SessionContext.getUserId(), request.getOrderId());
        iGmService.validPermission(SessionContext.getUserId(), GmAction.WECOM_ISV_PERMIT_ENSURE_ALL);

        socialCpIsvPermitService.ensureOrderAndAllActiveCodes(request.getOrderId());

        return ResponseData.success();
    }

    @PostResource(path = "/social/tenant/{tenantId}/event", requiredPermission = false)
    @ApiOperation(value = "Manually execute compensation of feishu event")
    public ResponseData<Void> feishuTenantEvent(@PathVariable("tenantId") String tenantId) {
        log.info("Operator「{}」Manually execute compensation of feishu event for tenant[{}].", SessionContext.getUserId(), tenantId);
        iGmService.validPermission(SessionContext.getUserId(), GmAction.FEISHU_EVENT_COMPENSATE);
        iGmService.handleFeishuEvent(tenantId);
        return ResponseData.success();
    }

    @PostResource(path = "/idaas/tenant/create", requiredLogin = false)
    @ApiOperation(value = "IDaaS privatization deployment create tenant", hidden = true)
    public ResponseData<IdaasTenantCreateVo> idaasTenantCreate(@RequestBody IdaasTenantCreateRo request) {
        log.info("IDaaS privatization deployment create tenant:" + JSONUtil.toJsonStr(request));
        IdaasTenantCreateVo idaasTenantCreateVo = idaasTenantService.createTenant(request);
        return ResponseData.success(idaasTenantCreateVo);
    }

    @PostResource(path = "/idaas/app/bind", requiredLogin = false)
    @ApiOperation(value = "IDaaS privatization deployment bind app", hidden = true)
    public ResponseData<IdaasAppBindVo> idaasAppBind(@RequestBody IdaasAppBindRo request) {
        log.info("IDaaS privatization deployment bind app: " + JSONUtil.toJsonStr(request));
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

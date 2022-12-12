package com.vikadata.api.user.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.base.enums.ValidateType;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.captcha.CodeValidateScope;
import com.vikadata.api.shared.captcha.ValidateCodeProcessorManage;
import com.vikadata.api.shared.captcha.ValidateCodeType;
import com.vikadata.api.shared.captcha.ValidateTarget;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.enums.UserException;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.api.user.ro.RefreshApiKeyRo;
import com.vikadata.api.user.service.IDeveloperService;
import com.vikadata.api.user.vo.DeveloperInfoVo;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.user.enums.DeveloperException.GENERATE_API_KEY_ERROR;
import static com.vikadata.api.user.enums.DeveloperException.HAS_CREATE;
import static com.vikadata.api.user.enums.DeveloperException.USER_DEVELOPER_NOT_FOUND;

/**
 * <p>
 *  Api for the developer configuration interface.
 * </p>
 */
@RestController
@Api(tags = "Developer Config API")
@ApiResource(path = "/user")
public class DeveloperController {

    @Resource
    private IDeveloperService iDeveloperService;

    @Resource
    private UserMapper userMapper;

    @GetResource(path = "/valid/{apiKey}", requiredLogin = false)
    @ApiOperation(value = "Verify the access token", notes = "Provides a mid-tier validation access token.")
    public ResponseData<Boolean> validateApiKey(@PathVariable("apiKey") String apiKey) {
        boolean valid = iDeveloperService.validateApiKey(apiKey);
        return ResponseData.success(valid);
    }

    @PostResource(path = "/createApiKey", requiredPermission = false)
    @ApiOperation(value = "Create the developer access token", notes = "Create developer access tokens to access open platform functionality.")
    public ResponseData<DeveloperInfoVo> createApiKey() {
        Long userId = SessionContext.getUserId();
        boolean hasCreate = iDeveloperService.checkHasCreate(userId);
        ExceptionUtil.isFalse(hasCreate, HAS_CREATE);
        String apiKey = iDeveloperService.createApiKey(userId);
        DeveloperInfoVo developerInfoVo = new DeveloperInfoVo();
        developerInfoVo.setApiKey(apiKey);
        return ResponseData.success(developerInfoVo);
    }

    @PostResource(path = "/refreshApiKey", requiredPermission = false)
    @ApiOperation(value = "Refresh the developer access token", notes = "Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.")
    public ResponseData<DeveloperInfoVo> refreshApiKey(@RequestBody @Valid RefreshApiKeyRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity userEntity = userMapper.selectById(userId);
        ExceptionUtil.isNotNull(userEntity, UserException.USER_NOT_EXIST);
        if (data.getType() == ValidateType.EMAIL_CODE) {
            // Verify the email verification code.
            ValidateTarget target = ValidateTarget.create(userEntity.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, data.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        }
        else if (data.getType() == ValidateType.SMS_CODE) {
            // Verify the sms verification code.
            ValidateTarget target = ValidateTarget.create(userEntity.getMobilePhone(), userEntity.getCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, data.getCode(), true, CodeValidateScope.RESET_API_KEY);
        }
        else {
            // Verification code verification can be skipped only when the account is not bound to a mobile phone or email address.
            ExceptionUtil.isTrue(StrUtil.isBlank(userEntity.getEmail())
                    && StrUtil.isBlank(userEntity.getMobilePhone()), GENERATE_API_KEY_ERROR);
        }
        boolean hasCreate = iDeveloperService.checkHasCreate(userId);
        ExceptionUtil.isTrue(hasCreate, USER_DEVELOPER_NOT_FOUND);
        String apiKey = iDeveloperService.refreshApiKey(userId);
        DeveloperInfoVo developerInfoVo = new DeveloperInfoVo();
        developerInfoVo.setApiKey(apiKey);
        return ResponseData.success(developerInfoVo);
    }
}

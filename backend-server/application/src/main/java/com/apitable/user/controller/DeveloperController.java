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

package com.apitable.user.controller;

import static com.apitable.user.enums.DeveloperException.GENERATE_API_KEY_ERROR;
import static com.apitable.user.enums.DeveloperException.HAS_CREATE;
import static com.apitable.user.enums.DeveloperException.USER_DEVELOPER_NOT_FOUND;

import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ValidateType;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.captcha.CodeValidateScope;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.enums.UserException;
import com.apitable.user.mapper.UserMapper;
import com.apitable.user.ro.RefreshApiKeyRo;
import com.apitable.user.service.IDeveloperService;
import com.apitable.user.vo.DeveloperInfoVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Api for the developer configuration interface.
 */
@RestController
@Tag(name = "Developer Config API")
@ApiResource(path = "/user")
public class DeveloperController {

    @Resource
    private IDeveloperService iDeveloperService;

    @Resource
    private UserMapper userMapper;

    /**
     * Verify the access token.
     */
    @GetResource(path = "/valid/{apiKey}", requiredLogin = false)
    @Operation(summary = "Verify the access token",
        description = "Provides a mid-tier validation access token.")
    public ResponseData<Boolean> validateApiKey(@PathVariable("apiKey") String apiKey) {
        boolean valid = iDeveloperService.validateApiKey(apiKey);
        return ResponseData.success(valid);
    }

    /**
     * Create the developer access token.
     */
    @PostResource(path = "/createApiKey", requiredPermission = false)
    @Operation(summary = "Create the developer access token",
        description = "Create developer access tokens to access open platform functionality.")
    public ResponseData<DeveloperInfoVo> createApiKey() {
        Long userId = SessionContext.getUserId();
        boolean hasCreate = iDeveloperService.checkHasCreate(userId);
        ExceptionUtil.isFalse(hasCreate, HAS_CREATE);
        String apiKey = iDeveloperService.createApiKey(userId);
        DeveloperInfoVo developerInfoVo = new DeveloperInfoVo();
        developerInfoVo.setApiKey(apiKey);
        return ResponseData.success(developerInfoVo);
    }

    /**
     * Refresh the developer access token.
     */
    @PostResource(path = "/refreshApiKey", requiredPermission = false)
    @Operation(summary = "Refresh the developer access token",
        description = "Refresh developer access token before verifying phone number."
            + "If there is no verification mailbox, skip verification.")
    public ResponseData<DeveloperInfoVo> refreshApiKey(@RequestBody @Valid RefreshApiKeyRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity userEntity = userMapper.selectById(userId);
        ExceptionUtil.isNotNull(userEntity, UserException.USER_NOT_EXIST);
        if (data.getType() == ValidateType.EMAIL_CODE) {
            // Verify the email verification code.
            ValidateTarget target = ValidateTarget.create(userEntity.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                .validate(target, data.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        } else if (data.getType() == ValidateType.SMS_CODE) {
            // Verify the sms verification code.
            ValidateTarget target =
                ValidateTarget.create(userEntity.getMobilePhone(), userEntity.getCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                .validate(target, data.getCode(), true, CodeValidateScope.RESET_API_KEY);
        } else {
            // Verification code verification can be skipped only when the account is not bound
            // to a mobile phone or email address.
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

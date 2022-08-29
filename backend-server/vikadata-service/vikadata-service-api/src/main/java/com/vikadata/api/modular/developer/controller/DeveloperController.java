package com.vikadata.api.modular.developer.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.ValidateType;
import com.vikadata.api.enums.exception.UserException;
import com.vikadata.api.model.ro.developer.RefreshApiKeyRo;
import com.vikadata.api.model.vo.developer.DeveloperInfoVo;
import com.vikadata.api.modular.developer.service.IDeveloperService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.UserEntity;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.DeveloperException.GENERATE_API_KEY_ERROR;
import static com.vikadata.api.enums.exception.DeveloperException.HAS_CREATE;
import static com.vikadata.api.enums.exception.DeveloperException.USER_DEVELOPER_NOT_FOUND;

/**
 * <p>
 * 开发者配置中心Web界面的接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:19
 */
@RestController
@Api(tags = "开发者配置接口")
@ApiResource(path = "/user")
public class DeveloperController {

    @Resource
    private IDeveloperService iDeveloperService;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @Resource
    private UserMapper userMapper;

    @GetResource(path = "/valid/{apiKey}", requiredLogin = false)
    @ApiOperation(value = "校验访问令牌", notes = "提供中间层校验访问令牌")
    public ResponseData<Boolean> validateApiKey(@PathVariable("apiKey") String apiKey) {
        boolean valid = iDeveloperService.validateApiKey(apiKey);
        return ResponseData.success(valid);
    }

    @PostResource(path = "/createApiKey", requiredPermission = false)
    @ApiOperation(value = "创建开发者访问令牌", notes = "创建开发者访问令牌，访问开放平台功能")
    public ResponseData<DeveloperInfoVo> createApiKey() {
        Long userId = SessionContext.getUserId();
        boolean hasCreate = iDeveloperService.checkHasCreate(userId);
        ExceptionUtil.isFalse(hasCreate, HAS_CREATE);
        String apiKey = iDeveloperService.createApiKey(userId);
        DeveloperInfoVo developerInfoVo = new DeveloperInfoVo();
        developerInfoVo.setApiKey(apiKey);
        // 删除缓存
        userLinkInfoService.delete(userId);
        return ResponseData.success(developerInfoVo);
    }

    @PostResource(path = "/refreshApiKey", requiredPermission = false)
    @ApiOperation(value = "刷新开发者访问令牌", notes = "刷新开发者访问令牌，验证手机号，若无验证邮箱，再无免校验")
    public ResponseData<DeveloperInfoVo> refreshApiKey(@RequestBody @Valid RefreshApiKeyRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity userEntity = userMapper.selectById(userId);
        ExceptionUtil.isNotNull(userEntity, UserException.USER_NOT_EXIST);
        if (data.getType() == ValidateType.EMAIL_CODE) {
            // 校验邮件验证码
            ValidateTarget target = ValidateTarget.create(userEntity.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, data.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        } else if (data.getType() == ValidateType.SMS_CODE) {
            // 校验短信验证码
            ValidateTarget target = ValidateTarget.create(userEntity.getMobilePhone(), userEntity.getCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, data.getCode(), true, CodeValidateScope.RESET_API_KEY);
        } else {
            // 帐号同时未绑定手机、邮箱，才允许跳过验证码校验
            ExceptionUtil.isTrue(StrUtil.isBlank(userEntity.getEmail())
                    && StrUtil.isBlank(userEntity.getMobilePhone()), GENERATE_API_KEY_ERROR);
        }
        boolean hasCreate = iDeveloperService.checkHasCreate(userId);
        ExceptionUtil.isTrue(hasCreate, USER_DEVELOPER_NOT_FOUND);
        String apiKey = iDeveloperService.refreshApiKey(userId);
        // 删除缓存
        userLinkInfoService.delete(userId);
        DeveloperInfoVo developerInfoVo = new DeveloperInfoVo();
        developerInfoVo.setApiKey(apiKey);
        return ResponseData.success(developerInfoVo);
    }
}

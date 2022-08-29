package com.vikadata.api.modular.base.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.action.EmailCodeType;
import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.organization.InviteValidRo;
import com.vikadata.api.model.ro.user.EmailCodeValidateRo;
import com.vikadata.api.model.ro.user.SmsCodeValidateRo;
import com.vikadata.api.model.ro.verification.EmailOpRo;
import com.vikadata.api.model.ro.verification.SmsOpRo;
import com.vikadata.api.model.vo.organization.InviteInfoVo;
import com.vikadata.api.modular.base.service.IActionService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCodeProcessor;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.support.ResponseData;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * ActionController
 *
 * @author Chambers
 * @since 2019/10/7
 */
@RestController
@Api(tags = "基础模块_验证动作模块接口")
@ApiResource(path = "/base/action")
@Slf4j
public class ActionController {

    @Resource
    private IActionService iActionService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private IUserService userService;

    @PostResource(name = "发送短信验证码", path = "/sms/code", requiredLogin = false)
    @ApiOperation(value = "发送短信验证码", notes = "短信类型：1【注册】2【登录】3【修改登录密码】4【钉钉绑定】5【绑定手机】6【(解除/更换)手机绑定】" +
        "7【修改邮箱绑定】8【删除空间】9【更换主管理员】10【普通验证】11【更改开发者配置】12【绑定第三方平台账号】")
    public ResponseData<Void> send(@RequestBody @Valid SmsOpRo smsOpRo) {
        log.info("发送短信验证码");
        //阿里人机验证
        afsCheckService.noTraceCheck(smsOpRo.getData());
        //代码优化，这里只负责发送短信，验证重复机制交予自动判断，包括验证码的生成随机位数都可以
        CodeValidateScope scope = CodeValidateScope.fromName(SmsCodeType.fromName(smsOpRo.getType()).name());
        ValidateTarget target = ValidateTarget.create(smsOpRo.getPhone(), smsOpRo.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).createAndSend(target, scope);
        //神策埋点 - 注册/登录获取验证码
        if (smsOpRo.getType().equals(SmsCodeType.REGISTER.getValue()) || smsOpRo.getType().equals(SmsCodeType.LOGIN.getValue())) {
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(null, TrackEventType.GET_SMC_CODE, null, origin));
        }
        return ResponseData.success();
    }

    @PostResource(name = "发送邮件验证码", path = "/mail/code", requiredLogin = false)
    @ApiOperation(value = "发送邮件验证码", notes = "邮件验证码：1【邮箱绑定】2【邮箱注册】3【通用校验】")
    public ResponseData<Void> mail(@RequestBody @Valid EmailOpRo opRo) {
        CodeValidateScope scope = CodeValidateScope.fromName(EmailCodeType.fromName(opRo.getType()).name());
        ValidateTarget target = ValidateTarget.create(opRo.getEmail());
        String defaultLocale = LocaleContextHolder.getLocale().toLanguageTag();
        String lang = userService.getLangByEmail(defaultLocale, opRo.getEmail());
        target.setLang(lang);
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).createAndSend(target, scope);
        return ResponseData.success();
    }

    @PostResource(name = "手机验证码校验", path = "/sms/code/validate", requiredLogin = false)
    @ApiOperation(value = "手机验证码校验", notes = "使用场景：钉钉绑定、更换手机/邮箱前验证身份、更换主管理员", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> verifyPhone(@RequestBody @Valid SmsCodeValidateRo param) {
        //验证交予组件验证，具体业务验证码只验证一次
        //根据手机获取对应手机验证码的业务
        ValidateCodeProcessor validateCodeProcessor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(param.getPhone(), param.getAreaCode());
        validateCodeProcessor.validate(target, param.getCode(), true, null);
        validateCodeProcessor.savePassRecord(target.getRealTarget());
        return ResponseData.success();
    }

    @PostResource(name = "邮箱验证码校验", path = "/email/code/validate", requiredLogin = false)
    @ApiOperation(value = "邮箱验证码校验", notes = "使用场景：无手机时更换邮箱前验证身份、更换主管理员", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> validateEmail(@RequestBody @Valid EmailCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getEmail());
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(target, param.getCode(), true, null);
        processor.savePassRecord(target.getRealTarget());
        return ResponseData.success();
    }

    @PostResource(name = "邀请临时码校验", path = "/invite/valid", requiredLogin = false)
    @ApiOperation(value = "邀请临时码校验", notes = "邀请链接令牌校验，校验成功后即可获取相关邀请信息", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<InviteInfoVo> inviteTokenValid(@RequestBody @Valid InviteValidRo data) {
        //邀请码校验
        InviteInfoVo inviteInfoVo = iActionService.inviteValidate(data.getToken());
        return ResponseData.success(inviteInfoVo);
    }
}

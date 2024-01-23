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

package com.apitable.base.controller;

import com.apitable.base.enums.EmailCodeType;
import com.apitable.base.enums.SmsCodeType;
import com.apitable.base.ro.EmailOpRo;
import com.apitable.base.ro.SmsOpRo;
import com.apitable.core.support.ResponseData;
import com.apitable.interfaces.eventbus.facade.EventBusFacade;
import com.apitable.interfaces.eventbus.model.CaptchaEvent;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.organization.ro.InviteValidRo;
import com.apitable.shared.captcha.CodeValidateScope;
import com.apitable.shared.captcha.ValidateCodeProcessor;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.service.ISpaceInvitationService;
import com.apitable.space.vo.EmailInvitationValidateVO;
import com.apitable.user.ro.EmailCodeValidateRo;
import com.apitable.user.ro.SmsCodeValidateRo;
import com.apitable.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * ActionController.
 */
@RestController
@Tag(name = "Basic module - verify action module interface")
@ApiResource(path = "/base/action")
public class ActionController {

    @Resource
    private ISpaceInvitationService iSpaceInvitationService;

    @Resource
    private IUserService userService;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private EventBusFacade eventBusFacade;

    /**
     * Send SMS verification code.
     */
    @PostResource(path = "/sms/code", requiredLogin = false)
    @Operation(summary = "Send SMS verification code",
        description = "SMS type; 1: Registration, 2:Login, "
            + "3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, "
            + "6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,"
            + "8: Delete space, "
            + "9: Replace main administrator 10: General verification, 11: Change developer "
            + "configuration, "
            + "12: Bind third-party platform account")
    public ResponseData<Void> send(@RequestBody @Valid SmsOpRo smsOpRo) {
        // Ali man-machine verification
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(smsOpRo.getData()));
        // Code optimization, here is only responsible for sending short messages, and the
        // verification repetition
        // mechanism is handed over to automatic judgment, including the generation of random
        // digits of verification code.
        CodeValidateScope scope =
            CodeValidateScope.fromName(SmsCodeType.fromName(smsOpRo.getType()).name());
        ValidateTarget target = ValidateTarget.create(smsOpRo.getPhone(), smsOpRo.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
            .createAndSend(target, scope);
        // Whence Buried Point - Register and log in to get verification code
        if (smsOpRo.getType().equals(SmsCodeType.REGISTER.getValue()) || smsOpRo.getType()
            .equals(SmsCodeType.LOGIN.getValue())) {
            ClientOriginInfo origin =
                InformationUtil.getClientOriginInfoInCurrentHttpContext(false, true);
            eventBusFacade.onEvent(new CaptchaEvent(origin));
        }
        return ResponseData.success();
    }

    /**
     * Send email verification code.
     */
    @PostResource(path = "/mail/code", requiredLogin = false)
    @Operation(summary = "Send email verification code",
        description = "Email verification code; 1:Email binding, "
            + "2: Email registration, 3: General verification")
    public ResponseData<Void> mail(@RequestBody @Valid EmailOpRo opRo) {
        CodeValidateScope scope =
            CodeValidateScope.fromName(EmailCodeType.fromName(opRo.getType()).name());
        ValidateTarget target = ValidateTarget.create(opRo.getEmail());
        String defaultLocale = LocaleContextHolder.getLocale().toLanguageTag();
        String lang = userService.getLangByEmail(defaultLocale, opRo.getEmail());
        target.setLang(lang);
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
            .createAndSend(target, scope);
        return ResponseData.success();
    }

    /**
     * Mobile verification code verification.
     */
    @PostResource(path = "/sms/code/validate", requiredLogin = false)
    @Operation(summary = "Mobile verification code verification",
        description = "Usage scenarios: DingTalk binding, "
            + "identity verification before changing the mobile phone mailbox,"
            + " changing the main administrator")
    public ResponseData<Void> verifyPhone(@RequestBody @Valid SmsCodeValidateRo param) {
        // The verification is handed over to the component verification, and the specific
        // business verification code is only verified once
        // The business of obtaining the corresponding mobile phone verification code according
        // to the mobile phone
        ValidateCodeProcessor validateCodeProcessor =
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(param.getPhone(), param.getAreaCode());
        validateCodeProcessor.validate(target, param.getCode(), true, null);
        validateCodeProcessor.savePassRecord(target.getRealTarget());
        return ResponseData.success();
    }

    /**
     * Email verification code verification.
     */
    @PostResource(path = "/email/code/validate", requiredLogin = false)
    @Operation(summary = "Email verification code verification",
        description = "Usage scenario: Verify identity before changing email address"
            + " when no mobile phone, change the main administrator")
    public ResponseData<Void> validateEmail(@RequestBody @Valid EmailCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getEmail());
        ValidateCodeProcessor processor =
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(target, param.getCode(), true, null);
        processor.savePassRecord(target.getRealTarget());
        return ResponseData.success();
    }

    /**
     * Invitation temporary code verification.
     */
    @Deprecated(since = "v1.10.0")
    @PostResource(path = "/invite/valid", requiredLogin = false)
    @Operation(summary = "Invitation temporary code verification",
        description = "Invitation link token verification, the relevant invitation"
            + " information can be obtained after the verification is successful")
    public ResponseData<EmailInvitationValidateVO> inviteTokenValid(
        @RequestBody @Valid InviteValidRo data
    ) {
        // Invitation code verification
        EmailInvitationValidateVO inviteInfoVo =
            iSpaceInvitationService.validEmailInvitation(data.getToken());
        return ResponseData.success(inviteInfoVo);
    }
}

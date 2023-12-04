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

package com.apitable.client.controller;

import cn.hutool.core.util.StrUtil;
import com.apitable.base.service.ISystemConfigService;
import com.apitable.client.model.ClientInfoVO;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.sysconfig.i18n.I18nTypes;
import com.apitable.space.service.ISpaceService;
import com.apitable.user.service.IUserService;
import com.apitable.user.vo.UserInfoVo;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Client Version Controller.
 * </p>
 */
@RestController
@Tag(name = "Client interface")
@ApiResource(path = "/client")
@Slf4j
public class ClientController {

    @Resource
    private IUserService iUserService;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISystemConfigService iSystemConfigService;

    /**
     * Get application version information.
     */
    @GetResource(path = "/info", requiredLogin = false)
    @Operation(summary = "Get application version information",
        description = "Get the application client version rendering information")
    @Parameter(name = "pipeline", description = "Construction serial number",
        schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "4818")
    public ClientInfoVO getTemplateInfo(
        @RequestParam(name = "spaceId", required = false) String spaceId) {
        // If the Request Param is not empty, it will actively switch to the space
        this.userSwitchSpace(SessionContext.getUserIdWithoutException(), spaceId);
        ClientInfoVO info = new ClientInfoVO();
        UserInfoVo userInfoVo = this.getUserInfoFromSession();
        if (null != userInfoVo) {
            try {
                info.setUserInfo(objectMapper.writeValueAsString(userInfoVo));
            } catch (JsonProcessingException e) {
                log.error("Serialization of user information of application client failed", e);
                info.setUserInfo(StrUtil.NULL);
            }
        } else {
            info.setUserInfo(StrUtil.NULL);
        }
        info.setLocale(LocaleContextHolder.getLocale().toLanguageTag());
        info.setWizards(
            StrUtil.toString(iSystemConfigService.getWizardConfig(I18nTypes.ZH_CN.getName())));
        return info;
    }

    private UserInfoVo getUserInfoFromSession() {
        if (!HttpContextUtil.hasSession()) {
            return null;
        }
        UserInfoVo userInfoVo;
        try {
            userInfoVo = iUserService.getCurrentUserInfo(SessionContext.getUserId(), null, false);
        } catch (Exception e) {
            log.warn("Failed to get UserInfo from Session.", e);
            return null;
        }
        return userInfoVo;
    }

    /**
     * User switching space station.
     */
    private void userSwitchSpace(Long userId, String spaceId) {
        try {
            // User id is not equal to null, space id is not equal to null and not equal to
            // 'undefined', space id must start with 'spc'
            boolean isPass =
                null != userId && StrUtil.isNotBlank(spaceId) && !StrUtil.isNullOrUndefined(spaceId)
                    && StrUtil.startWithIgnoreEquals(spaceId,
                    IdRulePrefixEnum.SPC.getIdRulePrefixEnum());
            if (isPass) {
                iSpaceService.switchSpace(userId, spaceId);
            }
        } catch (Exception e) {
            log.error("When rendering the template, the user switches the space station abnormally",
                e);
            // Do not cause the template to fail to render normally due to the abnormal switching
            // of the space station
        }
    }
}

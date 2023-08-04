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

package com.apitable.space.controller;

import static com.apitable.space.enums.SpaceException.DELETE_SPACE_ERROR;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.base.enums.ValidateType;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceOpenedSheetCacheService;
import com.apitable.shared.captcha.CodeValidateScope;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.HttpServletUtil;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.dto.GetSpaceListFilterCondition;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.enums.SpaceUpdateOperate;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.ro.SpaceDeleteRo;
import com.apitable.space.ro.SpaceMemberSettingRo;
import com.apitable.space.ro.SpaceOpRo;
import com.apitable.space.ro.SpaceSecuritySettingRo;
import com.apitable.space.ro.SpaceUpdateOpRo;
import com.apitable.space.ro.SpaceWorkbenchSettingRo;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.CreateSpaceResultVo;
import com.apitable.space.vo.SpaceCapacityVO;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceInfoVO;
import com.apitable.space.vo.SpaceSubscribeVo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.space.vo.UserSpaceVo;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Space - Space Api.
 */
@RestController
@Tag(name = "Space - Space Api")
@ApiResource(path = "/space")
@Slf4j
public class SpaceController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserSpaceOpenedSheetCacheService userSpaceOpenedSheetCacheService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    @Resource
    private IUserService iUserService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    /**
     * Get space capacity info.
     */
    @GetResource(path = "/capacity", requiredLogin = false)
    @Operation(summary = "Get space capacity info")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<SpaceCapacityVO> capacity() {
        String spaceId = LoginContext.me().getSpaceId();
        InternalSpaceCapacityVo view = iSpaceService.getSpaceCapacityVo(spaceId);
        return ResponseData.success(
            new SpaceCapacityVO(view.getUsedCapacity(), view.getCurrentBundleCapacity()));
    }

    /**
     * Get user space resource.
     */
    @GetResource(path = "/resource", requiredPermission = false)
    @Operation(summary = "Get user space resource")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<UserSpaceVo> getSpaceResource() {
        String spaceId = LoginContext.me().getSpaceId();
        // gets permission resources in the specified space
        Long userId = SessionContext.getUserId();
        UserSpaceVo userSpaceVo = iSpaceService.getUserSpaceResource(userId, spaceId);
        return ResponseData.success(userSpaceVo);
    }

    /**
     * Get space feature.
     */
    @GetResource(path = "/features", requiredPermission = false)
    @Operation(summary = "Get space feature")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<SpaceGlobalFeature> feature() {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        return ResponseData.success(spaceGlobalFeature);
    }

    /**
     * Get space list.
     */
    @GetResource(path = "/list", requiredPermission = false)
    @Operation(summary = "Get space list")
    @Parameter(name = "onlyManageable", in = ParameterIn.QUERY,
        description = "Whether to query only the managed space list. By default, not include",
        schema = @Schema(type = "boolean"), example = "true")
    public ResponseData<List<SpaceVO>> list(
        @RequestParam(name = "onlyManageable", required = false, defaultValue = "false")
        Boolean onlyManageable) {
        Long userId = SessionContext.getUserId();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(onlyManageable);
        return ResponseData.success(iSpaceService.getSpaceListByUserId(userId, condition));
    }

    /**
     * Create space.
     */
    @PostResource(path = "/create", requiredPermission = false)
    @Operation(summary = "Create Space")
    public ResponseData<CreateSpaceResultVo> create(@RequestBody @Valid SpaceOpRo spaceOpRo,
                                                    HttpServletRequest request) {
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        String spaceId = iSpaceService.createSpace(user, spaceOpRo.getName());
        Map<String, String> externalProperty = HttpServletUtil.getCookiesAsMap(request);
        entitlementServiceFacade.createSubscription(spaceId, userId, externalProperty);
        // release space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_SPACE).userId(userId)
                .spaceId(spaceId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .info(JSONUtil.createObj().set(AuditConstants.SPACE_NAME, spaceOpRo.getName()))
                .build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // Cache the space where the user's last action was active
        TaskManager.me().execute(() -> userActiveSpaceCacheService.save(userId, spaceId));
        return ResponseData.success(CreateSpaceResultVo.builder().spaceId(spaceId).build());
    }

    /**
     * Update space.
     */
    @PostResource(path = "/update", tags = "UPDATE_SPACE")
    @Operation(summary = "Update space", description = "at least one item is name and logo")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid SpaceUpdateOpRo spaceOpRo) {
        String spaceId = LoginContext.me().getSpaceId();
        ExceptionUtil.isTrue(
            StrUtil.isNotBlank(spaceOpRo.getName()) || StrUtil.isNotBlank(spaceOpRo.getLogo()),
            ParameterException.NO_ARG);
        iSpaceService.updateSpace(SessionContext.getUserId(), spaceId, spaceOpRo);
        return ResponseData.success();
    }

    /**
     * Delete space.
     */
    @Notification(templateId = NotificationTemplateId.SPACE_DELETED)
    @PostResource(path = "/delete/{spaceId}",
        method = { RequestMethod.DELETE}, tags = "DELETE_SPACE")
    @Operation(summary = "Delete space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<Void> delete(@PathVariable("spaceId") String spaceId,
                                     @RequestBody @Valid SpaceDeleteRo param) {
        // This operation cannot be performed when binding to a third party
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.DELETE_SPACE);
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        if (param.getType() == ValidateType.EMAIL_CODE) {
            ValidateTarget target = ValidateTarget.create(loginUserDto.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                .validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        } else if (param.getType() == ValidateType.SMS_CODE) {
            ValidateTarget target =
                ValidateTarget.create(loginUserDto.getMobile(), loginUserDto.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                .validate(target, param.getCode(), true, CodeValidateScope.DEL_SPACE);
        } else {
            // Verification code can be skipped only when the account is not bound to a mobile
            // phone or email.
            ExceptionUtil.isTrue(StrUtil.isBlank(loginUserDto.getEmail())
                && StrUtil.isBlank(loginUserDto.getMobile()), DELETE_SPACE_ERROR);
        }
        Long userId = loginUserDto.getUserId();
        // pre delete
        iSpaceService.preDeleteById(userId, spaceId);
        // delete cache
        userSpaceCacheService.delete(userId, spaceId);
        // release space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_SPACE).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Delete space immediately.
     */
    @PostResource(path = "/del", method = {RequestMethod.DELETE}, tags = "DELETE_SPACE")
    @Operation(summary = "Delete space immediately")
    public ResponseData<Void> del() {
        String spaceId = LoginContext.me().getSpaceId();
        // This operation cannot be performed when binding to a third party
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.DELETE_SPACE);
        // Check whether the space is in the pre-deleted state
        int count = SqlTool.retCount(spaceMapper.countBySpaceId(spaceId, true));
        ExceptionUtil.isTrue(count > 0, SpaceException.NOT_DELETED);
        // delete the space
        Long userId = SessionContext.getUserId();
        iSpaceService.deleteSpace(userId, Collections.singletonList(spaceId));
        // release space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.ACTUAL_DELETE_SPACE).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Undo delete space.
     */
    @Notification(templateId = NotificationTemplateId.SPACE_RECOVER)
    @PostResource(path = "/cancel/{spaceId}", tags = "DELETE_SPACE")
    @Operation(summary = "Undo delete space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<Void> cancel(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // This operation cannot be performed when binding to a third party
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        iSpaceService.cancelDelByIds(userId, spaceId);
        // delete the cache
        userSpaceCacheService.delete(userId, spaceId);
        // noitfy holder
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().fromUserId(userId).build());
        // release space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.CANCEL_DELETE_SPACE).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Quit space.
     */
    @Notification(templateId = NotificationTemplateId.QUIT_SPACE)
    @PostResource(path = "/quit/{spaceId}", requiredPermission = false)
    @Operation(summary = "Quit space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<Void> quit(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // This operation cannot be performed when binding to a third party
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // don't user LoginContext.me()
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        iSpaceService.quit(spaceId, memberId);
        // delete the relevant cache
        userSpaceOpenedSheetCacheService.delete(userId, spaceId);
        userActiveSpaceCacheService.delete(userId);
        userSpaceCacheService.delete(userId, spaceId);
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().spaceId(spaceId).fromUserId(userId).build());
        return ResponseData.success();
    }

    /**
     * Get space info.
     */
    @GetResource(path = "/info/{spaceId}", requiredPermission = false)
    @Operation(summary = "Get space info")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<SpaceInfoVO> info(@PathVariable("spaceId") String spaceId) {
        SpaceInfoVO vo = iSpaceService.getSpaceInfo(spaceId);
        return ResponseData.success(vo);
    }

    /**
     * Remove hot point in space.
     */
    @Deprecated
    @PostResource(path = "/remove/{spaceId}", requiredPermission = false)
    @Operation(summary = "Remove hot point in space",
        description = "Scenario: Remove the red dot in the inactive space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<Void> remove(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // don't use LoginContext.me()
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // remove hot point
        memberMapper.updateIsPointById(memberId);
        return ResponseData.success();
    }

    /**
     * Switch space.
     */
    @PostResource(path = "/{spaceId}/switch", requiredPermission = false)
    @Operation(summary = "switch space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<Void> switchSpace(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        iSpaceService.switchSpace(userId, spaceId);
        return ResponseData.success();
    }

    /**
     * Update workbench setting.
     */
    @Deprecated
    @PostResource(path = "/updateWorkbenchSetting", tags = "MANAGE_WORKBENCH_SETTING")
    @Operation(summary = "Update workbench setting")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<Void> updateWorkbenchSetting(
        @RequestBody @Valid SpaceWorkbenchSettingRo data) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        BeanUtil.copyProperties(data, feature);
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        return ResponseData.success();
    }

    /**
     * Update member setting.
     */
    @Deprecated
    @PostResource(path = "/updateMemberSetting", tags = "MANAGE_MEMBER_SETTING")
    @Operation(summary = "Update member setting")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<Void> updateMemberSetting(@RequestBody @Valid SpaceMemberSettingRo data) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        if (data.getInvitable() != null || data.getJoinable() != null) {
            // This operation cannot be performed when binding to a third party
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        }
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        BeanUtil.copyProperties(data, feature);
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        return ResponseData.success();
    }

    /**
     * Update security setting.
     */
    @PostResource(path = "/updateSecuritySetting",
        tags = {"MANAGE_SHARE_SETTING", "MANAGE_FILE_SETTING", "MANAGE_ADVANCE_SETTING"})
    @Operation(summary = "Update security setting")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<Void> updateSecuritySetting(
        @RequestBody @Valid SpaceSecuritySettingRo data) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        if (data.getInvitable() != null || data.getJoinable() != null) {
            // This operation cannot be performed when binding to a third party
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        }
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        BeanUtil.copyProperties(data, feature);
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        return ResponseData.success();
    }

    /**
     * Gets subscription information for the space.
     */
    @GetResource(path = "/subscribe/{spaceId}", requiredPermission = false)
    @Operation(summary = "Gets subscription information for the space")
    @Parameter(name = "spaceId", description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spc8mXUeiXyVo")
    public ResponseData<SpaceSubscribeVo> subscribe(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceService.getSpaceSubscriptionInfo(spaceId));
    }
}

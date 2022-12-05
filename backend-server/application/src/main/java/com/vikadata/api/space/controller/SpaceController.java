package com.vikadata.api.space.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.ParameterException;
import com.vikadata.api.base.enums.ValidateType;
import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;
import com.vikadata.api.internal.model.InternalSpaceCapacityVo;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.service.UserActiveSpaceService;
import com.vikadata.api.shared.cache.service.UserSpaceOpenedSheetService;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationRenderField;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.component.notification.annotation.Notification;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.constants.AuditConstants;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.holder.NotificationRenderFieldHolder;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.shared.security.CodeValidateScope;
import com.vikadata.api.shared.security.ValidateCodeProcessorManage;
import com.vikadata.api.shared.security.ValidateCodeType;
import com.vikadata.api.shared.security.ValidateTarget;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.enums.SpaceException;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.dto.GetSpaceListFilterCondition;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.space.enums.SpaceUpdateOperate;
import com.vikadata.api.space.vo.SpaceSubscribeVo;
import com.vikadata.api.space.ro.SpaceDeleteRo;
import com.vikadata.api.space.ro.SpaceMemberSettingRo;
import com.vikadata.api.space.ro.SpaceOpRo;
import com.vikadata.api.space.ro.SpaceSecuritySettingRo;
import com.vikadata.api.space.ro.SpaceUpdateOpRo;
import com.vikadata.api.space.ro.SpaceWorkbenchSettingRo;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.space.vo.CreateSpaceResultVo;
import com.vikadata.api.space.vo.SpaceCapacityVO;
import com.vikadata.api.space.vo.SpaceInfoVO;
import com.vikadata.api.space.vo.SpaceVO;
import com.vikadata.api.space.vo.UserSpaceVo;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.util.SqlTool;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.space.enums.SpaceException.DELETE_SPACE_ERROR;

@RestController
@Api(tags = "Space - Space Api")
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
    private UserSpaceOpenedSheetService userSpaceOpenedSheetService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private IUserService iUserService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @GetResource(path = "/capacity", requiredLogin = false)
    @ApiOperation(value = "Get space capacity info")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<SpaceCapacityVO> capacity() {
        String spaceId = LoginContext.me().getSpaceId();
        InternalSpaceCapacityVo view = iSpaceService.getSpaceCapacityVo(spaceId);
        return ResponseData.success(new SpaceCapacityVO(view.getUsedCapacity(), view.getCurrentBundleCapacity()));
    }

    @GetResource(path = "/resource", requiredPermission = false)
    @ApiOperation(value = "Get user space resource")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<UserSpaceVo> getSpaceResource() {
        String spaceId = LoginContext.me().getSpaceId();
        // gets permission resources in the specified space
        Long userId = SessionContext.getUserId();
        UserSpaceVo userSpaceVo = iSpaceService.getUserSpaceResource(userId, spaceId);
        return ResponseData.success(userSpaceVo);
    }

    @GetResource(path = "/features", requiredPermission = false)
    @ApiOperation(value = "Get space feature")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<SpaceGlobalFeature> feature() {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        return ResponseData.success(spaceGlobalFeature);
    }

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "Get space list")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "onlyManageable", value = "Whether to query only the managed space list. By default, not include", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
    })
    public ResponseData<List<SpaceVO>> list(@RequestParam(name = "onlyManageable", required = false, defaultValue = "false") Boolean onlyManageable) {
        Long userId = SessionContext.getUserId();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(onlyManageable);
        return ResponseData.success(iSpaceService.getSpaceListByUserId(userId, condition));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create space")
    public ResponseData<CreateSpaceResultVo> create(@RequestBody @Valid SpaceOpRo spaceOpRo) {
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        String spaceId = iSpaceService.createSpace(user, spaceOpRo.getName());
        // release space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_SPACE).userId(userId).spaceId(spaceId)
                .info(JSONUtil.createObj().set(AuditConstants.SPACE_NAME, spaceOpRo.getName())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // Cache the space where the user's last action was active
        TaskManager.me().execute(() -> userActiveSpaceService.save(userId, spaceId));
        return ResponseData.success(CreateSpaceResultVo.builder().spaceId(spaceId).build());
    }

    @PostResource(path = "/update", tags = "UPDATE_SPACE")
    @ApiOperation(value = "Update space", notes = "at least one item is name and logo")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid SpaceUpdateOpRo spaceOpRo) {
        String spaceId = LoginContext.me().getSpaceId();
        ExceptionUtil.isTrue(StrUtil.isNotBlank(spaceOpRo.getName()) || StrUtil.isNotBlank(spaceOpRo.getLogo()), ParameterException.NO_ARG);
        iSpaceService.updateSpace(SessionContext.getUserId(), spaceId, spaceOpRo);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.SPACE_DELETED)
    @PostResource(path = "/delete/{spaceId}", method = { RequestMethod.DELETE }, tags = "DELETE_SPACE")
    @ApiOperation(value = "Delete space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<Void> delete(@PathVariable("spaceId") String spaceId, @RequestBody @Valid SpaceDeleteRo param) {
        // This operation cannot be performed when binding to a third party
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.DELETE_SPACE);
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        if (param.getType() == ValidateType.EMAIL_CODE) {
            ValidateTarget target = ValidateTarget.create(loginUserDto.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        }
        else if (param.getType() == ValidateType.SMS_CODE) {
            ValidateTarget target = ValidateTarget.create(loginUserDto.getMobile(), loginUserDto.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, param.getCode(), true, CodeValidateScope.DEL_SPACE);
        }
        else {
            // Verification code can be skipped only when the account is not bound to a mobile phone or email.
            ExceptionUtil.isTrue(StrUtil.isBlank(loginUserDto.getEmail())
                    && StrUtil.isBlank(loginUserDto.getMobile()), DELETE_SPACE_ERROR);
        }
        Long userId = loginUserDto.getUserId();
        // pre delete
        iSpaceService.preDeleteById(userId, spaceId);
        // delete cache
        userSpaceService.delete(userId, spaceId);
        // release space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_SPACE).userId(userId).spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/del", method = { RequestMethod.DELETE }, tags = "DELETE_SPACE")
    @ApiOperation(value = "Delete space immediately")
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
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.ACTUAL_DELETE_SPACE).userId(userId).spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.SPACE_RECOVER)
    @PostResource(path = "/cancel/{spaceId}", tags = "DELETE_SPACE")
    @ApiOperation(value = "Undo delete space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<Void> cancel(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // This operation cannot be performed when binding to a third party
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        iSpaceService.cancelDelByIds(userId, spaceId);
        // delete the cache
        userSpaceService.delete(userId, spaceId);
        // noitfy holder
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().fromUserId(userId).build());
        // release space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.CANCEL_DELETE_SPACE).userId(userId).spaceId(spaceId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.QUIT_SPACE)
    @PostResource(path = "/quit/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "Quit space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<Void> quit(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // This operation cannot be performed when binding to a third party
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // don't user LoginContext.me()
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        iSpaceService.quit(spaceId, memberId);
        // delete the relevant cache
        userSpaceOpenedSheetService.delete(userId, spaceId);
        userActiveSpaceService.delete(userId);
        userSpaceService.delete(userId, spaceId);
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().spaceId(spaceId).fromUserId(userId).build());
        return ResponseData.success();
    }

    @GetResource(path = "/info/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "Get space info")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<SpaceInfoVO> info(@PathVariable("spaceId") String spaceId) {
        SpaceInfoVO vo = iSpaceService.getSpaceInfo(spaceId);
        return ResponseData.success(vo);
    }

    @Deprecated
    @PostResource(path = "/remove/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "Remove hot point in space", notes = "Scenario: Remove the red dot in the inactive space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<Void> remove(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        // don't use LoginContext.me()
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // remove hot point
        memberMapper.updateIsPointById(memberId);
        return ResponseData.success();
    }

    @PostResource(path = "/{spaceId}/switch", requiredPermission = false)
    @ApiOperation(value = "switch space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<Void> switchSpace(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        iSpaceService.switchSpace(userId, spaceId);
        return ResponseData.success();
    }

    /**
     * @see #updateSecuritySetting(SpaceSecuritySettingRo)
     * */
    @Deprecated
    @PostResource(path = "/updateWorkbenchSetting", tags = "MANAGE_WORKBENCH_SETTING")
    @ApiOperation(value = "Update workbench setting")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> updateWorkbenchSetting(@RequestBody @Valid SpaceWorkbenchSettingRo data) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        BeanUtil.copyProperties(data, feature);
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        return ResponseData.success();
    }

    /**
     * @see #updateSecuritySetting(SpaceSecuritySettingRo)
     * */
    @Deprecated
    @PostResource(path = "/updateMemberSetting", tags = "MANAGE_MEMBER_SETTING")
    @ApiOperation(value = "Update member setting")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
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

    @PostResource(path = "/updateSecuritySetting", tags = { "MANAGE_SHARE_SETTING", "MANAGE_FILE_SETTING", "MANAGE_ADVANCE_SETTING" })
    @ApiOperation(value = "Update security setting")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> updateSecuritySetting(@RequestBody @Valid SpaceSecuritySettingRo data) {
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

    @GetResource(path = "/subscribe/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "Gets subscription information for the space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo")
    public ResponseData<SpaceSubscribeVo> subscribe(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceService.getSpaceSubscriptionInfo(spaceId));
    }
}

package com.vikadata.api.modular.developer.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.base.service.ISystemConfigService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.internal.service.IPermissionService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.service.IFeishuEventService;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.IFeishuTenantContactService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.GmPermissionInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import static com.vikadata.api.constants.NotificationConstants.SPECIFICATION;
import static com.vikadata.api.enums.exception.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.SpaceException.NOT_SPACE_ADMIN;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_ALREADY_CERTIFIED;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;

/**
 * <p>
 * GM 接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/7/27
 */
@Slf4j
@Service
public class GmServiceImpl implements IGmService {

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private ISystemConfigService iSystemConfigService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IPermissionService iPermissionService;

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private IFeishuEventService iFeishuEventService;

    @Resource
    private IFeishuTenantContactService iFeishuTenantContactService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;


    @Override
    public void validPermission(Long userId, GmAction action) {
        log.info("校验用户「{}」的「{}」GM权限", userId, action.name());
        this.getGmConfigAfterCheckUserPermission(userId, action);
    }

    @Override
    public void updateGmPermissionConfig(Long userId, String dstId) {
        log.info("「{}」更新GM权限配置", userId);
        // 获取现有的权限配置
        String config = this.getGmConfigAfterCheckUserPermission(userId, GmAction.PERMISSION_CONFIG);
        // 获取更新的权限配置信息
        List<GmPermissionInfo> gmPermissionInfos = vikaOperations.getGmPermissionConfiguration(dstId);
        if (gmPermissionInfos.isEmpty()) {
            throw new BusinessException("NO UPDATES!");
        }
        JSONObject configVal = config != null ? JSONUtil.parseObj(config) : JSONUtil.createObj();
        for (GmPermissionInfo info : gmPermissionInfos) {
            if (info.getUnitIds().isEmpty()) {
                configVal.remove(info.getAction());
            }
            else {
                configVal.set(info.getAction(), info.getUnitIds());
            }
        }
        iSystemConfigService.saveOrUpdate(userId, SystemConfigType.GM_PERMISSION_CONFIG, null, configVal.toString());
    }

    private String getGmConfigAfterCheckUserPermission(Long userId, GmAction action) {
        List<Long> unitIds = new ArrayList<>();
        // 环境变量的GM配置组织单元
        if (constProperties.getGmConfigUnit() != null) {
            unitIds.add(constProperties.getGmConfigUnit());
        }
        // 系统配置的授权组织单元
        String config = iSystemConfigService.findConfig(SystemConfigType.GM_PERMISSION_CONFIG, null);
        if (config != null && JSONUtil.parseObj(config).containsKey(action.name())) {
            unitIds.addAll(JSONUtil.parseObj(config).getJSONArray(action.name()).toList(Long.class));
        }
        if (unitIds.isEmpty()) {
            throw new BusinessException("PERMISSION CONFIG UNIT IS NULL.");
        }
        // 获取组织单元相关联的所有用户ID
        List<Long> userIds = iUnitService.getRelUserIdsByUnitIds(unitIds);
        if (CollUtil.isEmpty(userIds) || !userIds.contains(userId)) {
            throw new BusinessException("INSUFFICIENT PERMISSIONS!");
        }
        return config;
    }

    @Override
    public void spaceCertification(String spaceId, String operatorUserUuid, SpaceCertification certification) {
        // 验证提交人是否存在
        Long userId = iUserService.getUserIdByUuid(operatorUserUuid);
        ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
        // 空间是否存在
        String spaceName = iSpaceService.getNameBySpaceId(spaceId);
        if (StrUtil.isBlank(spaceName)) {
            sendSpaceCertifyFailedNotice(userId, spaceId);
            throw new BusinessException(SPACE_NOT_EXIST);
        }
        // 空间站是否可以认证
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // 验证空间是否已经开通认证
        ExceptionUtil.isFalse(iSpaceService.isCertified(spaceId), SPACE_ALREADY_CERTIFIED);
        // 验证成员
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        if (null == memberId) {
            sendSpaceCertifyFailedNotice(userId, spaceId);
            throw new BusinessException(MEMBER_NOT_IN_SPACE);
        }
        boolean isAdmin = iPermissionService.checkMemberIsAdmin(spaceId, memberId, null);
        if (!isAdmin) {
            sendSpaceCertifyFailedNotice(userId, spaceId);
            throw new BusinessException(NOT_SPACE_ADMIN);
        }
        // 开通企业认证
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().certification(certification.getLevel()).build();
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        // 发送认证成功通知
        sendSpaceCertifiedNotice(userId, spaceId, certification);
    }

    private void sendSpaceCertifiedNotice(Long userId, String spaceId, SpaceCertification certification) {
        // 发送通知
        TaskManager.me().execute(() -> {
            Dict extra = new Dict();
            if (SpaceCertification.BASIC.equals(certification)) {
                extra.set(SPECIFICATION, constProperties.getSpaceBasicCertificationCapacity());
            }
            if (SpaceCertification.SENIOR.equals(certification)) {
                extra.set(SPECIFICATION, constProperties.getSpaceSeniorCertificationCapacity());
            }
            NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_CERTIFICATION_NOTIFY,
                    ListUtil.toList(userId), 0L, spaceId, extra);
        });
    }

    private void sendSpaceCertifyFailedNotice(Long userId, String spaceId) {
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_CERTIFICATION_FAIL_NOTIFY,
                ListUtil.toList(userId), 0L, spaceId, new Dict()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleFeishuEvent(String tenantId) {
        UserHolder.set(-1L);
        iFeishuService.switchDefaultContext();
        MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap = iFeishuTenantContactService.fetchTenantContact(tenantId);
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(iFeishuService.getIsvAppId(), tenantId);
        // 处理授权变更范围,先同步部门，再同步员工
        iFeishuEventService.handleTenantContactData(iFeishuService.getIsvAppId(), tenantId, spaceId, contactMap);
        // 处理未绑定空间的订阅信息
        iFeishuEventService.handleTenantOrders(tenantId, iFeishuService.getIsvAppId());
    }
}

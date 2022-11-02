package com.vikadata.api.modular.developer.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
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
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.UserEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.GmPermissionInfo;
import com.vikadata.integration.vika.model.UserContactInfo;
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

    @Resource
    private UserMapper userMapper;

    @Override
    public void validPermission(Long userId, GmAction action) {
        log.info("valid user「{}」 「{}」GM permission.", userId, action.name());
        this.getGmConfigAfterCheckUserPermission(userId, action);
    }

    @Override
    public void updateGmPermissionConfig(Long userId, String dstId) {
        log.info("「{}」update gm permission config", userId);
        // gets the existing permission configuration
        String config = this.getGmConfigAfterCheckUserPermission(userId, GmAction.PERMISSION_CONFIG);
        // gets the updated permission configuration
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
        // the environment variable's GM config unit
        if (constProperties.getGmConfigUnit() != null) {
            unitIds.add(constProperties.getGmConfigUnit());
        }
        // Authorized organization unit configured by the system
        String config = iSystemConfigService.findConfig(SystemConfigType.GM_PERMISSION_CONFIG, null);
        if (config != null && JSONUtil.parseObj(config).containsKey(action.name())) {
            unitIds.addAll(JSONUtil.parseObj(config).getJSONArray(action.name()).toList(Long.class));
        }
        if (unitIds.isEmpty()) {
            throw new BusinessException("PERMISSION CONFIG UNIT IS NULL.");
        }
        // Gets all the user ids associated with the organization unit
        List<Long> userIds = iUnitService.getRelUserIdsByUnitIds(unitIds);
        if (CollUtil.isEmpty(userIds) || !userIds.contains(userId)) {
            throw new BusinessException("INSUFFICIENT PERMISSIONS!");
        }
        return config;
    }

    @Override
    public void spaceCertification(String spaceId, String operatorUserUuid, SpaceCertification certification) {
        // verify whether the submitter exists
        Long userId = iUserService.getUserIdByUuid(operatorUserUuid);
        ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
        // verify whether the space exists
        String spaceName = iSpaceService.getNameBySpaceId(spaceId);
        if (StrUtil.isBlank(spaceName)) {
            sendSpaceCertifyFailedNotice(userId, spaceId);
            throw new BusinessException(SPACE_NOT_EXIST);
        }
        // whether the space station can be certified
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // verify that the space has been authenticated
        ExceptionUtil.isFalse(iSpaceService.isCertified(spaceId), SPACE_ALREADY_CERTIFIED);
        // verify the member
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
        // open enterprise certification
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().certification(certification.getLevel()).build();
        iSpaceService.switchSpacePros(userId, spaceId, feature);
        // send certificate success notice
        sendSpaceCertifiedNotice(userId, spaceId, certification);
    }

    private void sendSpaceCertifiedNotice(Long userId, String spaceId, SpaceCertification certification) {
        // send notification
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
        //  handle authorization change scope. synchronize departments first then employees。
        iFeishuEventService.handleTenantContactData(iFeishuService.getIsvAppId(), tenantId, spaceId, contactMap);
        // Handles subscription information for unbound spaces.
        iFeishuEventService.handleTenantOrders(tenantId, iFeishuService.getIsvAppId());
    }

    @Override
    public void queryAndWriteBackUserContactInfo(String host, String datasheetId, String viewId, String token) {
        // read user's id from datasheet by vika api
        List<UserContactInfo> userContactInfos = vikaOperations.getUserIdFromDatasheet(host, datasheetId, viewId, token);
        if (userContactInfos.isEmpty()) {
            throw new BusinessException("There are no records that meet the conditions.");
        }
        // query user's contact information by user's id
        this.getUserPhoneAndEmailByUserId(userContactInfos);
        // write back user's mobile phone and email
        for (UserContactInfo userContactInfo : userContactInfos) {
            vikaOperations.writeBackUserContactInfo(host, token, datasheetId, userContactInfo);
        }
    }

    @Override
    public void getUserPhoneAndEmailByUserId(List<UserContactInfo> userContactInfos) {
        // query user's mobile phone and email by user's id
        List<UserEntity> userEntities = userMapper.selectByUuIds(userContactInfos.stream().map(UserContactInfo::getUuid).collect(Collectors.toList()));
        Map<String, UserEntity> uuidToUserMap = userEntities.stream().collect(Collectors.toMap(UserEntity::getUuid, Function.identity()));
        // handle write back information
        for (UserContactInfo info : userContactInfos) {
            if (!uuidToUserMap.containsKey(info.getUuid())) {
                continue;
            }
            BeanUtil.copyProperties(uuidToUserMap.get(info.getUuid()), info);
        }
    }

}

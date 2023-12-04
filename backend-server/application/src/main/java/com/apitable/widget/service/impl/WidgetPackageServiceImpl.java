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

package com.apitable.widget.service.impl;

import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.apitable.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.apitable.shared.constants.NotificationConstants.WIDGET_NAME;
import static com.apitable.space.enums.SpaceResourceGroupCode.MANAGE_WIDGET;
import static com.apitable.widget.enums.WidgetException.CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT;
import static com.apitable.widget.enums.WidgetException.EN_US_REQUIRED;
import static com.apitable.widget.enums.WidgetException.RELEASES_FAIL_INCOMPLETE_PARAME;
import static com.apitable.widget.enums.WidgetException.RELEASES_FAIL_VERSION_NUM_ERROR;
import static com.apitable.widget.enums.WidgetException.RELEASES_FAIL_VERSION_NUM_REPEAT;
import static com.apitable.widget.enums.WidgetException.RELEASES_FAIL_WIDGET_DISABLED;
import static com.apitable.widget.enums.WidgetException.ROLLBACK_FAIL_SELECT_VERSION_ERROR;
import static com.apitable.widget.enums.WidgetException.ROLLBACK_FAIL_VERSION_NUM_ERROR;
import static com.apitable.widget.enums.WidgetException.SUBMIT_FAIL_INCOMPLETE_PARAME;
import static com.apitable.widget.enums.WidgetException.SUBMIT_FAIL_NO_SUBMIT_METHOD;
import static com.apitable.widget.enums.WidgetException.SUBMIT_FAIL_VERSION_NUM_ERROR;
import static com.apitable.widget.enums.WidgetException.WIDGET_BANNED;
import static com.apitable.widget.enums.WidgetException.WIDGET_NOT_EXIST;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.asset.service.IAssetService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.infrastructure.permission.space.resource.ResourceCode;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.security.facade.WhiteListServiceFacade;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.apitable.shared.constants.MailPropConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.WidgetReleaseVersionUtils;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.service.ISpaceMemberRoleRelService;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.mapper.UserMapper;
import com.apitable.user.service.IUserService;
import com.apitable.widget.dto.LastSubmitWidgetVersionDTO;
import com.apitable.widget.dto.WidgetBodyDTO;
import com.apitable.widget.entity.WidgetPackageAuthSpaceEntity;
import com.apitable.widget.entity.WidgetPackageEntity;
import com.apitable.widget.entity.WidgetPackageReleaseEntity;
import com.apitable.widget.enums.InstallEnvType;
import com.apitable.widget.enums.RuntimeEnvType;
import com.apitable.widget.enums.WidgetPackageAuthType;
import com.apitable.widget.enums.WidgetPackageStatus;
import com.apitable.widget.enums.WidgetPackageType;
import com.apitable.widget.enums.WidgetReleaseStatus;
import com.apitable.widget.enums.WidgetReleaseType;
import com.apitable.widget.mapper.WidgetPackageAuthSpaceMapper;
import com.apitable.widget.mapper.WidgetPackageMapper;
import com.apitable.widget.mapper.WidgetPackageReleaseMapper;
import com.apitable.widget.ro.WidgetPackageBaseRo.I18nField;
import com.apitable.widget.ro.WidgetPackageBaseV2Ro;
import com.apitable.widget.ro.WidgetPackageCreateRo;
import com.apitable.widget.ro.WidgetPackageReleaseV2Ro;
import com.apitable.widget.ro.WidgetPackageRollbackRo;
import com.apitable.widget.ro.WidgetPackageSubmitV2Ro;
import com.apitable.widget.ro.WidgetPackageUnpublishRo;
import com.apitable.widget.ro.WidgetTransferOwnerRo;
import com.apitable.widget.service.IWidgetPackageService;
import com.apitable.widget.vo.WidgetPackageInfoVo;
import com.apitable.widget.vo.WidgetReleaseCreateVo;
import com.apitable.widget.vo.WidgetReleaseListVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * widget packages service implements.
 */
@Slf4j
@Service
public class WidgetPackageServiceImpl
    extends ServiceImpl<WidgetPackageMapper, WidgetPackageEntity>
    implements IWidgetPackageService {

    @Resource
    private WidgetPackageReleaseMapper widgetPackageReleaseMapper;

    @Resource
    private WidgetPackageAuthSpaceMapper widgetPackageAuthSpaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private ISpaceMemberRoleRelService iSpaceMemberRoleRelService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private IUserService userService;

    @Resource
    private WhiteListServiceFacade whiteListServiceFacade;

    @Value("${SKIP_GLOBAL_WIDGET_AUDIT:false}")
    private Boolean skipGlobalWidgetAudit;

    @Override
    public boolean checkCustomPackageId(String customPackageId) {
        log.info("check component custom id：{}，Is it unique", customPackageId);
        return baseMapper.countNumByPackageId(customPackageId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget) {
        // check widget publishing type
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(widget.getReleaseType());
        // check developer permissions
        this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        String packageId = widget.getPackageId();
        if (StrUtil.isNotBlank(packageId)) {
            // check custom package id
            boolean packageIdIsExist = this.checkCustomPackageId(widget.getPackageId());
            ExceptionUtil.isFalse(packageIdIsExist, CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT);
        } else {
            packageId = IdUtil.createWidgetPackageId();
        }
        I18nField i18nName;
        String i18nNameStr;
        try {
            i18nName = objectMapper.readValue(widget.getName(), I18nField.class);
            // english parameter cannot be empty
            ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
            i18nNameStr = i18nName.toJson();
        } catch (JsonProcessingException e) {
            throw new BusinessException(
                "The JSON format of widget name or description is incorrect");
        }

        // query the latest component package order
        int maxSort = baseMapper.selectMaxWidgetSort(releaseType.getValue(), widget.getSpaceId());

        // check widget package type
        WidgetPackageType packageType = WidgetPackageType.toEnum(widget.getPackageType());

        // create a widget package and bind the space
        WidgetPackageEntity saveObj = new WidgetPackageEntity()
            .setPackageId(packageId)
            .setI18nName(i18nNameStr)
            .setPackageType(packageType.getValue())
            .setReleaseType(releaseType.getValue())
            // The space station widget takes effect by default,
            // and the global widget does not take effect by default.
            .setIsEnabled(WidgetReleaseType.SPACE == releaseType)
            .setIsTemplate(BooleanUtil.isTrue(widget.getIsTemplate()))
            .setStatus(WidgetPackageStatus.DEVELOP.getValue())
            .setSandbox(widget.getSandbox())
            .setOwner(opUserId);
        WidgetPackageAuthSpaceEntity saveJoinObj = new WidgetPackageAuthSpaceEntity()
            .setPackageId(saveObj.getPackageId())
            .setSpaceId(widget.getSpaceId())
            .setType(WidgetPackageAuthType.BOUND_SPACE.getValue())
            .setWidgetSort(maxSort);

        boolean flag = this.save(saveObj)
            && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(saveJoinObj));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

        // return result
        WidgetReleaseCreateVo result = new WidgetReleaseCreateVo();
        result.setPackageId(saveObj.getPackageId());
        return result;
    }

    @Override
    public List<WidgetReleaseListVo> releaseListWidget(Long opUserId, String packageId,
                                                       Page<WidgetReleaseListVo> page) {
        log.info("get a list of widget publishing history");
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(packageId);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // query widget s home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // Check whether the rollback operator is the author,
        // not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }

        // query publishing history
        page.setSearchCount(false);
        page.setSize(-1);
        // paging query is currently closed
        IPage<WidgetReleaseListVo> pageResult =
            widgetPackageReleaseMapper.selectReleasePage(page, packageId);
        pageResult.convert(wr -> {
            wr.setCurrentVersion(wpk.getReleaseId().equals(wr.getReleaseId()));
            return wr;
        });
        return pageResult.getRecords();
    }

    @Override
    public void rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget) {
        log.info("rollback widget");
        // check rollback version number
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()),
            ROLLBACK_FAIL_VERSION_NUM_ERROR);
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // query widget s home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        /*
         * 1.Check whether the rollback operator is the author, not the author,
         *  and then check the widget management authority.
         * 2.Global widget rollback, GM permissions must be verified
         */
        if (!opUserId.equals(wpk.getOwner()) || WidgetReleaseType.GLOBAL == releaseType) {
            // check whether the user is the master administrator
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }
        // Check whether the released version SAH exists
        // and can only be rolled back to the approved version.
        String versionSHA =
            WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // version id to be rolled back
        Long waitRollbackReleaseId =
            widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA,
                WidgetReleaseStatus.PASS_REVIEW.getValue());
        ExceptionUtil.isNotNull(waitRollbackReleaseId, ROLLBACK_FAIL_SELECT_VERSION_ERROR);
        // rollback version
        boolean flag =
            SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(
                WidgetPackageStatus.ONLINE.getValue(), waitRollbackReleaseId,
                wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget) {
        // Check whether the widget exists.
        // Blocked widgets are not allowed to be removed from the shelves.
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // Query widget's home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // Check whether the removed operator is the author,
        // not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkWidgetPermission(opUserId, spaceId, releaseType,
                Collections.singletonList(ResourceCode.UNPUBLISH_WIDGET));
        }
        // It has been removed from the shelf and returned directly to avoid repeated operations.
        if (WidgetPackageStatus.UNPUBLISH.getValue().equals(wpk.getStatus())) {
            return;
        }
        boolean flag = SqlHelper.retBool(
            baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.UNPUBLISH.getValue(),
                null, wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);

        this.sendUnpublishedWidgetNotify(wpk, spaceId, opUserId);
    }

    @Override
    public WidgetPackageInfoVo getWidgetPackageInfo(String packageId) {
        log.info("get information about a single widget package");
        String userLocale = LoginContext.me().getLocaleStr();
        return CollUtil.getFirst(baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(packageId,
            null, userLocale));
    }

    @Override
    public List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId) {
        log.info("get widget store information");
        String userLocale = LoginContext.me().getLocaleStr();
        return baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(null,
            spaceId, userLocale);
    }

    @Override
    public void transferWidgetOwner(Long opUserId, WidgetTransferOwnerRo transferOwnerRo) {
        log.info("widget transfer owner");
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(transferOwnerRo.getPackageId());
        // Query widget's home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        if (WidgetReleaseType.GLOBAL.equals(releaseType)) {
            // global widget does not allow transfer of owners
            throw new BusinessException("insufficient permissions");
        }
        // Check whether the widget transfer owner operator is the author,
        // not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkWidgetPermission(opUserId, spaceId, releaseType,
                Collections.singletonList(ResourceCode.TRANSFER_WIDGET));
        }
        // Check the transfer for the presence of widget attribution to the space station
        MemberEntity transferMember = iMemberService.getById(transferOwnerRo.getTransferMemberId());
        ExceptionUtil.isNotNull(transferMember, NOT_EXIST_MEMBER);
        ExceptionUtil.isNotNull(transferMember.getUserId(), NOT_EXIST_MEMBER);
        ExceptionUtil.isTrue(StrUtil.equals(transferMember.getSpaceId(), spaceId),
            NOT_EXIST_MEMBER);
        // modify widget owner
        WidgetPackageEntity updateEntity =
            WidgetPackageEntity.builder().id(wpk.getId()).owner(transferMember.getUserId()).build();
        boolean flag = super.updateById(updateEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);

        this.sendTransferWidgetNotify(wpk, spaceId, opUserId, transferMember);
    }

    @Override
    public WidgetPackageEntity getByPackageId(String packageId, boolean checkBan) {
        WidgetPackageEntity wpk = baseMapper.selectWidgetByPackageId(packageId);
        ExceptionUtil.isNotNull(wpk, WIDGET_NOT_EXIST);

        if (checkBan) {
            ExceptionUtil.isFalse(WidgetPackageStatus.BANNED.getValue().equals(wpk.getStatus()),
                WIDGET_BANNED);
        }
        return wpk;
    }

    /**
     * Query the basic information of the applet without checking whether it is blocked.
     *
     * @param packageId packageId
     */
    @Override
    public WidgetPackageEntity getByPackageId(String packageId) {
        return getByPackageId(packageId, false);
    }

    /**
     * Check if developers have space stations,
     * basic requirements for development widget personnel.
     */
    private void checkDeveloperUserIfSpaceOrGm(Long userId, String spaceId,
                                               WidgetReleaseType releaseType) {
        this.checkWidgetPermission(userId, spaceId, releaseType, false, null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void releaseWidget(Long opUserId, WidgetPackageReleaseV2Ro widget) {
        log.info("release widget: user id [{}], package id [{}]", opUserId, widget.getPackageId());

        WidgetPackageEntity wpk = checkReleaseProcessInfo(opUserId, widget);

        // generate version's versionSHA.
        String versionSHA =
            WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());

        // generate version's versionSHA.
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // the widget's install env code.
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        // get the widget's name and description.
        I18nField i18nName;
        String i18nNameStr = null;
        String i18nDescStr;
        try {
            i18nName = objectMapper.readValue(StrUtil.blankToDefault(widget.getName(),
                wpk.getI18nName()), I18nField.class);
            // check whether name exist. the name can be empty.
            // empty name mean not modify the original name
            if (null != i18nName) {
                // the en name is necessary
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            i18nDescStr = getI18nDescStr(widget.getDescription());
        } catch (JsonProcessingException e) {
            throw new BusinessException(
                "The JSON format of widget name or description is incorrect");
        }

        // the old files' storage token.
        String[] oldAssetList = {wpk.getCover(), wpk.getIcon(), wpk.getAuthorIcon()};

        addReleaseHistoryAndModifyWidgetInfo(opUserId, widget, wpk, versionSHA,
            installEnvsCodes, runtimeEnvsCodes, i18nNameStr, i18nDescStr);

        notifyUserRelease(opUserId, widget.getSpaceId(), i18nName);

        // delete old files.
        for (String oldAsset : oldAssetList) {
            iAssetService.delete(oldAsset);
        }
    }

    private void addReleaseHistoryAndModifyWidgetInfo(Long opUserId,
                                                      WidgetPackageReleaseV2Ro widget,
                                                      WidgetPackageEntity wpk, String versionSHA,
                                                      String installEnvsCodes,
                                                      String runtimeEnvsCodes, String i18nNameStr,
                                                      String i18nDescStr) {
        // create widget package release record
        WidgetPackageReleaseEntity saveWpr = new WidgetPackageReleaseEntity()
            .setPackageId(wpk.getPackageId())
            .setVersion(widget.getVersion())
            .setReleaseSha(versionSHA)
            .setReleaseUserId(opUserId)
            .setReleaseCodeBundle(widget.getReleaseCodeBundleToken())
            .setSourceCodeBundle(widget.getSourceCodeBundleToken())
            .setSecretKey(widget.getSecretKey())
            .setReleaseNote(widget.getReleaseNote())
            .setInstallEnvCode(installEnvsCodes)
            .setRuntimeEnvCode(runtimeEnvsCodes)
            .setStatus(WidgetReleaseStatus.PASS_REVIEW.getValue());
        boolean flag = SqlHelper.retBool(widgetPackageReleaseMapper.insert(saveWpr));
        // modifying Release Information
        wpk.setReleaseId(saveWpr.getId())
            .setI18nName(i18nNameStr)
            .setI18nDescription(i18nDescStr)
            .setCover(widget.getCoverToken())
            .setIcon(widget.getIconToken())
            .setAuthorName(widget.getAuthorName())
            .setAuthorEmail(widget.getAuthorEmail())
            .setAuthorIcon(widget.getAuthorIconToken())
            .setAuthorLink(widget.getAuthorLink())
            .setStatus(WidgetPackageStatus.ONLINE.getValue())
            .setSandbox(widget.getSandbox())
            .setIsEnabled(Boolean.TRUE.equals(skipGlobalWidgetAudit))
            .setUpdatedBy(opUserId);
        flag &= SqlHelper.retBool(baseMapper.updateById(wpk));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    private void notifyUserRelease(Long opUserId, String spaceId, I18nField i18nName) {
        List<Long> toPlayerIds = new ArrayList<>();
        // admin with "MANAGE_WIDGET" privileges
        List<Long> memberAdminIds =
            iSpaceMemberRoleRelService.getMemberIdListByResourceGroupCodes(spaceId,
                ListUtil.toList(MANAGE_WIDGET.getCode()));
        // main admin
        memberAdminIds.add(spaceMapper.selectSpaceMainAdmin(spaceId));
        if (CollUtil.isNotEmpty(memberAdminIds)) {
            // query user id of admin
            List<Long> userAdminIds = memberMapper.selectUserIdsByMemberIds(memberAdminIds);
            if (CollUtil.isNotEmpty(userAdminIds)) {
                toPlayerIds.addAll(userAdminIds);
            }
        }
        // send message
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
            NotificationTemplateId.NEW_SPACE_WIDGET_NOTIFY,
            toPlayerIds,
            opUserId,
            spaceId,
            Dict.create().set(WIDGET_NAME,
                StrUtil.blankToDefault(i18nName.getZhCN(), i18nName.getEnUS()))));
    }

    private String generateVersionSHA(WidgetPackageBaseV2Ro widget, WidgetPackageEntity wpk) {
        //  generate version's versionSHA.
        String versionSHA =
            WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // check versionSHA is only one in release's versionSHA.
        Long releaseId =
            widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null);
        ExceptionUtil.isNull(releaseId, RELEASES_FAIL_VERSION_NUM_REPEAT);
        return versionSHA;
    }

    private WidgetPackageEntity checkReleaseProcessInfo(Long opUserId,
                                                        WidgetPackageReleaseV2Ro widget) {
        // release process required info
        boolean validField = StrUtil.hasBlank(widget.getDescription());
        validField |= StrUtil.hasBlank(widget.getIconToken(), widget.getCoverToken(),
            widget.getAuthorIconToken(), widget.getReleaseCodeBundleToken());
        ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);
        // check whether widget exist
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()),
            RELEASES_FAIL_VERSION_NUM_ERROR);

        // check whether widget exist
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());

        // check whether widget is banned
        ExceptionUtil.isFalse(
            Objects.equals(wpk.getStatus(), WidgetPackageStatus.BANNED.getValue()),
            RELEASES_FAIL_WIDGET_DISABLED);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        if (WidgetReleaseType.GLOBAL == releaseType) {
            // if widget is global widget, it requires author info for releasing
            validField = StrUtil.hasBlank(widget.getAuthorName(),
                widget.getAuthorLink(), widget.getAuthorEmail());
            ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);
        }

        // check the permission of operator
        if (!opUserId.equals(wpk.getOwner())) {
            this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        }
        return wpk;
    }

    @Override
    @SneakyThrows(JsonProcessingException.class)
    @Transactional(rollbackFor = Exception.class)
    public void submitWidget(Long opUserId, WidgetPackageSubmitV2Ro widget) {
        log.info("submit global widget review. package id: {}", widget.getPackageId());

        checkSubmitReviewInfo(widget);

        // check whether widget exist.
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);

        // check widget's release type is global.
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        ExceptionUtil.isFalse(WidgetReleaseType.SPACE == releaseType,
            SUBMIT_FAIL_NO_SUBMIT_METHOD);

        // generate version's versionSHA.
        String versionSHA = generateVersionSHA(widget, wpk);

        // the widget's install env code.
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // the widget's runtime env code.
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        // get the widget's name and description.
        String i18nNameStr;
        String i18nDescStr;
        try {
            i18nNameStr = getI18nNameStr(widget.getName(), wpk.getI18nName());
            i18nDescStr = getI18nDescStr(widget.getDescription());
        } catch (JsonProcessingException e) {
            throw new BusinessException(
                "The JSON format of widget name or description is incorrect");
        }

        // check the number of submit. If there are more than one submit, delete the last review.
        removeExistSubmit(wpk.getPackageId());

        // ===>>> build the mirror submit review
        WidgetPackageReleaseEntity auditMirrorWidgetRelease =
            getWidgetPackageReleaseEntity(opUserId, widget, wpk, versionSHA,
                installEnvsCodes, runtimeEnvsCodes, i18nNameStr, i18nDescStr);
        // ===>>> end build the audit mirror widget release's record
        // postSubmit: update the extended info
        postSubmit(wpk.getId(), wpk.getWidgetBody(), auditMirrorWidgetRelease.getId());
    }

    private WidgetPackageReleaseEntity getWidgetPackageReleaseEntity(Long opUserId,
                                                                     WidgetPackageSubmitV2Ro widget,
                                                                     WidgetPackageEntity wpk,
                                                                     String versionSHA,
                                                                     String installEnvsCodes,
                                                                     String runtimeEnvsCodes,
                                                                     String i18nNameStr,
                                                                     String i18nDescStr)
        throws JsonProcessingException {
        String auditMirrorWidgetId = IdUtil.createWidgetPackageId();
        WidgetPackageReleaseEntity auditMirrorWidgetRelease = new WidgetPackageReleaseEntity()
            .setPackageId(auditMirrorWidgetId)
            .setVersion(widget.getVersion())
            .setReleaseSha(versionSHA)
            .setReleaseCodeBundle(widget.getReleaseCodeBundleToken())
            .setSourceCodeBundle(widget.getSourceCodeBundleToken())
            .setSecretKey(widget.getSecretKey())
            .setReleaseNote(widget.getReleaseNote())
            .setStatus(WidgetReleaseStatus.WAIT_REVIEW.getValue())
            .setReleaseUserId(opUserId)
            .setCreatedBy(opUserId)
            .setInstallEnvCode(installEnvsCodes)
            .setRuntimeEnvCode(runtimeEnvsCodes)
            .setUpdatedBy(opUserId);
        boolean flag =
            SqlHelper.retBool(widgetPackageReleaseMapper.insert(auditMirrorWidgetRelease));
        WidgetPackageEntity auditMirrorWidget = new WidgetPackageEntity()
            .setPackageId(auditMirrorWidgetId)
            .setReleaseId(auditMirrorWidgetRelease.getId())
            .setI18nName(i18nNameStr)
            .setI18nDescription(i18nDescStr)
            .setCover(widget.getCoverToken())
            .setIcon(widget.getIconToken())
            .setAuthorName(widget.getAuthorName())
            .setAuthorEmail(widget.getAuthorEmail())
            .setAuthorIcon(widget.getAuthorIconToken())
            .setAuthorLink(widget.getAuthorLink())
            .setPackageType(wpk.getPackageType())
            .setReleaseType(WidgetReleaseType.WAIT_REVIEW.getValue())
            .setStatus(WidgetPackageStatus.ONLINE.getValue())
            .setSandbox(widget.getSandbox())
            .setWidgetBody(
                WidgetBodyDTO.builder().fatherWidgetId(wpk.getPackageId())
                    .website(widget.getWebsite()).build().toJson()
            )
            .setIsEnabled(false)
            .setOwner(opUserId)
            .setCreatedBy(opUserId)
            .setUpdatedBy(opUserId);
        WidgetPackageAuthSpaceEntity auditMirrorWidgetAuth = new WidgetPackageAuthSpaceEntity()
            .setPackageId(auditMirrorWidgetId)
            // the global widget's space's id is ""
            .setSpaceId(StrUtil.EMPTY)
            .setType(WidgetPackageAuthType.BOUND_SPACE.getValue());
        flag &= this.save(auditMirrorWidget) && SqlHelper.retBool(
            widgetPackageAuthSpaceMapper.insert(auditMirrorWidgetAuth));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return auditMirrorWidgetRelease;
    }

    private void removeExistSubmit(String packageId) {
        LastSubmitWidgetVersionDTO lastSubmitWidget =
            widgetPackageReleaseMapper.selectLastWidgetVersionInfoByFatherWidgetId(packageId);
        boolean flag = true;
        if (null != lastSubmitWidget) {
            flag = SqlHelper.retBool(baseMapper.deleteById(lastSubmitWidget.getLastPackageId()));
            flag &= SqlHelper.retBool(
                widgetPackageReleaseMapper.deleteById(lastSubmitWidget.getLastPackageReleaseId()));
            flag &= SqlHelper.retBool(widgetPackageAuthSpaceMapper.deleteById(
                lastSubmitWidget.getLastPackageAuthSpaceId()));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    private String getI18nDescStr(String description) throws JsonProcessingException {
        String i18nDescStr;
        I18nField i18nDesc;
        i18nDesc = I18nField.toBean(description);
        // the en description cannot be empty
        ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
        i18nDescStr = i18nDesc.toJson();
        return i18nDescStr;
    }

    private String getI18nNameStr(String name, String defaultI18nName)
        throws JsonProcessingException {
        I18nField i18nName;
        i18nName = I18nField.toBean(StrUtil.blankToDefault(name, defaultI18nName));
        // Check the widget release name. It can be empty.
        // If it is empty, the release does not modify the widget name.
        if (null != i18nName) {
            // the en name is necessary
            ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
            return i18nName.toJson();
        }
        return null;
    }

    private void checkSubmitReviewInfo(WidgetPackageSubmitV2Ro widget) {
        // check whether necessary parameters are included
        boolean validField = StrUtil.hasBlank(widget.getDescription(),
            widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
        validField |= StrUtil.hasBlank(widget.getIconToken(), widget.getCoverToken(),
            widget.getAuthorIconToken(), widget.getReleaseCodeBundleToken());
        ExceptionUtil.isFalse(validField, SUBMIT_FAIL_INCOMPLETE_PARAME);
        // check whether the version is valid
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()),
            SUBMIT_FAIL_VERSION_NUM_ERROR);
    }

    private void postSubmit(Long widgetPackageId, String widgetExtendBody,
                            Long releaseHistoryId) throws JsonProcessingException {
        // rel the release history id to the widget package
        WidgetBodyDTO widgetBody = WidgetBodyDTO.toBean(widgetExtendBody);
        List<Long> oldHistoryVersion =
            Optional.ofNullable(widgetBody.getHistoryReleaseVersion()).orElseGet(ArrayList::new);
        oldHistoryVersion.add(releaseHistoryId);
        widgetBody.setHistoryReleaseVersion(oldHistoryVersion);

        // update the extended info
        boolean flag =
            SqlHelper.retBool(
                baseMapper.updateWidgetBodyById(widgetPackageId, widgetBody.toJson()));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }


    /**
     * Check developer permissions, all operations Gm can intervene.
     *
     * @param userId        user id
     * @param spaceId       space id
     * @param releaseType   publishingType
     * @param resourceCodes permission resource code
     */
    private void checkWidgetPermission(Long userId, String spaceId,
                                       WidgetReleaseType releaseType,
                                       List<ResourceCode> resourceCodes) {
        this.checkWidgetPermission(userId, spaceId, releaseType, true, resourceCodes);
    }

    /**
     * Check developer permissions, all operations Gm can intervene.
     *
     * @param userId          user id
     * @param spaceId         space id
     * @param releaseType     publishing type
     * @param checkPermission whether to verify permissions
     * @param resourceCodes   permission resource code
     */
    private void checkWidgetPermission(Long userId, String spaceId,
                                       WidgetReleaseType releaseType, boolean checkPermission,
                                       List<ResourceCode> resourceCodes) {
        log.info("Check widget developer permissions ");
        if (WidgetReleaseType.GLOBAL == releaseType) {
            // At present, there is no audit process,
            // and the global small-size organization can only be controlled by the official GM.
            whiteListServiceFacade.checkWidgetPermission(userId);
        } else {
            boolean isExist = false;
            try {
                UserSpaceDto userSpace = userSpaceCacheService.getUserSpace(userId, spaceId);
                if (!checkPermission || userSpace.isMainAdmin()) {
                    // Do not check the permissions,
                    // the upper-level entrance to determine whether the owner,
                    // here to add a master administrator
                    isExist = true;
                } else if (CollUtil.containsAny(userSpace.getResourceCodes(), resourceCodes)
                    || userSpace.isMainAdmin()) {
                    // Check permissions to determine whether the operation user permission group
                    // or the operation user is the master administrator.
                    isExist = true;
                }
            } catch (Exception e) {
                throw new BusinessException("Insufficient authority ");
            } finally {
                if (!isExist) {
                    whiteListServiceFacade.checkWidgetPermission(userId);
                }
            }
        }
    }

    @SneakyThrows(JsonProcessingException.class)
    private void sendUnpublishedWidgetNotify(WidgetPackageEntity wpk, String spaceId,
                                             Long opUserId) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        // notify holder
        String widgetName = I18nField.toBean(wpk.getI18nName()).getString(defaultLang);

        Dict dict = Dict.create();
        dict.set("WIDGET_NAME", widgetName);

        // to email
        List<Long> toPlayerIds = ListUtil.toList(wpk.getOwner());
        List<String> emails = userMapper.selectEmailByUserIds(toPlayerIds);

        String subjectType;
        if (WidgetReleaseType.GLOBAL.getValue().equals(wpk.getReleaseType())) {
            subjectType = MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;
        } else {
            // send system notification
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
                NotificationTemplateId.ADMIN_UNPUBLISH_SPACE_WIDGET_NOTIFY,
                toPlayerIds,
                opUserId,
                spaceId,
                Dict.create().set(WIDGET_NAME, widgetName)));
            // send notification email
            String spaceName = spaceMapper.selectSpaceNameBySpaceId(spaceId);
            dict.set("SPACE_NAME", spaceName);

            subjectType = MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_NOTIFY;
        }

        List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, emails);
        List<MailWithLang> tos = MailWithLang.convert(emailsWithLang,
            emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()));
        TaskManager.me()
            .execute(() -> NotifyMailFactory.me().sendMail(subjectType, dict, dict, tos));
    }

    @SneakyThrows(JsonProcessingException.class)
    private void sendTransferWidgetNotify(WidgetPackageEntity wpk, String spaceId,
                                          Long opUserId, MemberEntity transferMember) {
        // notify holder
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        String widgetName = I18nField.toBean(wpk.getI18nName()).getString(defaultLang);

        // send notification
        List<Long> toPlayerIds = ListUtil.toList(wpk.getOwner());
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
            NotificationTemplateId.ADMIN_TRANSFER_SPACE_WIDGET_NOTIFY,
            toPlayerIds,
            opUserId,
            spaceId,
            Dict.create().set(WIDGET_NAME, widgetName)
                .set(INVOLVE_MEMBER_ID, ListUtil.toList(transferMember.getId()))));

        // send notification email
        String spaceName = spaceMapper.selectSpaceNameBySpaceId(spaceId);
        Dict dict = Dict.create();
        dict.set("SPACE_NAME", spaceName);
        dict.set("WIDGET_NAME", widgetName);
        dict.set("MEMBER_NAME", transferMember.getMemberName());
        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", widgetName);
        List<String> emails = userMapper.selectEmailByUserIds(toPlayerIds);
        List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, emails);
        List<MailWithLang> tos = MailWithLang.convert(emailsWithLang,
            emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()));
        TaskManager.me().execute(() -> NotifyMailFactory.me()
            .sendMail(MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY, mapDict, dict, tos));
    }

}

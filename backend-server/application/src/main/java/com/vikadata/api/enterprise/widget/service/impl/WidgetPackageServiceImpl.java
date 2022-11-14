package com.vikadata.api.enterprise.widget.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.ObjectId;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.model.GlobalWidgetInfo;
import com.vikadata.api.shared.cache.bean.UserSpaceDto;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.component.notification.NotifyMailFactory;
import com.vikadata.api.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.vikadata.api.shared.constants.MailPropConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.enterprise.control.infrastructure.permission.space.resource.ResourceCode;
import com.vikadata.api.asset.enums.DeveloperAssetType;
import com.vikadata.api.enterprise.gm.enums.GmAction;
import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.enterprise.widget.enums.WidgetException;
import com.vikadata.api.enterprise.widget.enums.InstallEnvType;
import com.vikadata.api.enterprise.widget.enums.RuntimeEnvType;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageAuthType;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageStatus;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageType;
import com.vikadata.api.enterprise.widget.enums.WidgetReleaseStatus;
import com.vikadata.api.enterprise.widget.enums.WidgetReleaseType;
import com.vikadata.api.enterprise.widget.dto.LastSubmitWidgetVersionDTO;
import com.vikadata.api.enterprise.widget.dto.WidgetBodyDTO;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBanRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBaseRo.I18nField;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBaseV2Ro;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageCreateRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageReleaseRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageReleaseV2Ro;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageRollbackRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageSubmitRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageSubmitV2Ro;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageUnpublishRo;
import com.vikadata.api.enterprise.widget.ro.WidgetTransferOwnerRo;
import com.vikadata.api.asset.vo.AssetUploadResult;
import com.vikadata.api.enterprise.widget.vo.WidgetPackageInfoVo;
import com.vikadata.api.enterprise.widget.vo.WidgetReleaseCreateVo;
import com.vikadata.api.enterprise.widget.vo.WidgetReleaseListVo;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.enterprise.gm.model.SingleGlobalWidgetRo;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.service.ISpaceMemberRoleRelService;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.api.user.model.UserLangDTO;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.enterprise.widget.mapper.WidgetPackageAuthSpaceMapper;
import com.vikadata.api.enterprise.widget.mapper.WidgetPackageMapper;
import com.vikadata.api.enterprise.widget.mapper.WidgetPackageReleaseMapper;
import com.vikadata.api.enterprise.widget.service.IWidgetPackageService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.shared.util.WidgetReleaseVersionUtils;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.WidgetPackageAuthSpaceEntity;
import com.vikadata.entity.WidgetPackageEntity;
import com.vikadata.entity.WidgetPackageReleaseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.shared.constants.AssetsPublicConstants.DEVELOP_PREFIX;
import static com.vikadata.api.shared.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.vikadata.api.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.vikadata.api.shared.constants.NotificationConstants.WIDGET_NAME;
import static com.vikadata.api.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.EN_US_REQUIRED;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.RELEASES_FAIL_INCOMPLETE_PARAME;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.RELEASES_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.RELEASES_FAIL_VERSION_NUM_REPEAT;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.RELEASES_FAIL_WIDGET_DISABLED;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.ROLLBACK_FAIL_SELECT_VERSION_ERROR;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.ROLLBACK_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.SUBMIT_FAIL_INCOMPLETE_PARAME;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.SUBMIT_FAIL_NO_SUBMIT_METHOD;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.SUBMIT_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.SUBMIT_FAIL_VERSION_NUM_REPEAT;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.WIDGET_BANNED;
import static com.vikadata.api.enterprise.widget.enums.WidgetException.WIDGET_NOT_EXIST;

@Slf4j
@Service
public class WidgetPackageServiceImpl extends ServiceImpl<WidgetPackageMapper, WidgetPackageEntity> implements IWidgetPackageService {

    @Resource
    private WidgetPackageReleaseMapper widgetPackageReleaseMapper;

    @Resource
    private WidgetPackageAuthSpaceMapper widgetPackageAuthSpaceMapper;

    @Resource
    private IGmService iGmService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ISpaceMemberRoleRelService iSpaceMemberRoleRelService;

    @Resource
    private SpaceMapper spaceMapper;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private IUserService userService;

    @Override
    public void checkWidgetPackIfExist(String widgetPackageId, List<Integer> status) {
        log.info("check if the component installation package exists, widgetPackageId:{}，status:{}", widgetPackageId, status);
        // determine if a component package exists
        Integer packageStatus = baseMapper.selectStatusByPackageId(widgetPackageId);
        ExceptionUtil.isTrue(packageStatus != null && status.contains(packageStatus),
                WidgetException.WIDGET_PACKAGE_NOT_EXIST);
    }

    @Override
    public boolean checkCustomPackageId(String customPackageId) {
        log.info("check component custom id：{}，Is it unique", customPackageId);
        return baseMapper.countNumByPackageId(customPackageId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget) {
        log.info("create widget");
        // check widget package type
        WidgetPackageType packageType = WidgetPackageType.toEnum(widget.getPackageType());
        // check widget publishing type
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(widget.getReleaseType());
        // check developer permissions
        this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        String packageId = widget.getPackageId();
        if (StrUtil.isNotBlank(packageId)) {
            // check custom package id
            boolean packageIdIsExist = this.checkCustomPackageId(widget.getPackageId());
            ExceptionUtil.isFalse(packageIdIsExist, CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT);
        }
        else {
            packageId = IdUtil.createWidgetPackageId();
        }
        I18nField i18nName;
        String i18nNameStr;
        try {
            i18nName = objectMapper.readValue(widget.getName(), I18nField.class);
            // english parameter cannot be empty
            ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
            i18nNameStr = i18nName.toJson();
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }

        // query the latest component package order
        int maxSort = baseMapper.selectMaxWidgetSort(releaseType.getValue(), widget.getSpaceId());

        // create a widget package and bind the space
        WidgetPackageEntity saveObj = new WidgetPackageEntity()
                .setPackageId(packageId)
                .setI18nName(i18nNameStr)
                .setPackageType(packageType.getValue())
                .setReleaseType(releaseType.getValue())
                // The space station widget takes effect by default, and the global widget does not take effect by default.
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

        boolean flag = this.save(saveObj) && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(saveJoinObj));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

        // return result
        WidgetReleaseCreateVo result = new WidgetReleaseCreateVo();
        result.setPackageId(saveObj.getPackageId());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean releaseWidget(Long opUserId, WidgetPackageReleaseRo widget) {
        log.info("release widget");
        // release widget required parameter check
        boolean validField = StrUtil.hasBlank(widget.getDescription());
        validField |= ObjectUtil.hasNull(widget.getIcon(), widget.getCover(), widget.getAuthorIcon(), widget.getReleaseCodeBundle());
        ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);

        // check release number
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), RELEASES_FAIL_VERSION_NUM_ERROR);
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        ExceptionUtil.isFalse(Objects.equals(wpk.getStatus(), WidgetPackageStatus.BANNED.getValue()), RELEASES_FAIL_WIDGET_DISABLED);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // Space station widget allows not binding author name, author mailbox, author link
        if (WidgetReleaseType.GLOBAL == releaseType) {
            validField = StrUtil.hasBlank(widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
            ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);
        }

        // check developer permissions
        if (!opUserId.equals(wpk.getOwner())) {
            this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        }
        // generate versionSHA
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());

        // generate installation environment code
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // generate runtime environment code
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        I18nField i18nName, i18nDesc;
        String i18nNameStr = null, i18nDescStr, coverToken, iconToken, authorIconToken, releaseCodeBundleToken, sourceCodeBundleToken = null;
        try {
            i18nName = objectMapper.readValue(StrUtil.blankToDefault(widget.getName(), wpk.getI18nName()), I18nField.class);
            i18nDesc = objectMapper.readValue(widget.getDescription(), I18nField.class);
            // Check the widget release name. It can be empty. If it is empty, the release does not modify the widget name.
            if (null != i18nName) {
                // english parameter cannot be empty
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            // english parameter cannot be empty
            ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
            // Check whether the release version SAH is unique and the version number under each package is unique.
            ExceptionUtil.isNull(widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null), RELEASES_FAIL_VERSION_NUM_REPEAT);
            i18nDescStr = i18nDesc.toJson();
            // upload cover
            coverToken = this.uploadDeveloperTmpFile(widget.getCover());
            // upload icon
            iconToken = this.uploadDeveloperTmpFile(widget.getIcon());
            // upload authorIcon
            authorIconToken = this.uploadDeveloperTmpFile(widget.getAuthorIcon());
            // upload releaseCodeBundle
            releaseCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getReleaseCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            // upload sourceCodeBundle
            if (Objects.nonNull(widget.getSourceCodeBundle())) {
                sourceCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getSourceCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            }
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }
        catch (RuntimeException | IOException e) {
            throw new BusinessException(e.getMessage());
        }

        // create release record
        WidgetPackageReleaseEntity saveWpr = new WidgetPackageReleaseEntity()
                .setPackageId(wpk.getPackageId())
                .setVersion(widget.getVersion())
                .setReleaseSha(versionSHA)
                .setReleaseUserId(opUserId)
                .setReleaseCodeBundle(releaseCodeBundleToken)
                .setSourceCodeBundle(sourceCodeBundleToken)
                .setSecretKey(widget.getSecretKey())
                .setReleaseNote(widget.getReleaseNote())
                .setInstallEnvCode(installEnvsCodes)
                .setRuntimeEnvCode(runtimeEnvsCodes)
                .setStatus(WidgetReleaseStatus.PASS_REVIEW.getValue());

        // save release record
        boolean flag = SqlHelper.retBool(widgetPackageReleaseMapper.insert(saveWpr));
        // modify component package status
        String[] oldAssetList = { wpk.getCover(), wpk.getIcon(), wpk.getAuthorIcon() };
        // modify publishing information
        wpk.setReleaseId(saveWpr.getId())
                .setI18nName(i18nNameStr)
                .setI18nDescription(i18nDescStr)
                .setCover(coverToken)
                .setIcon(iconToken)
                .setAuthorName(widget.getAuthorName())
                .setAuthorEmail(widget.getAuthorEmail())
                .setAuthorIcon(authorIconToken)
                .setAuthorLink(widget.getAuthorLink())
                .setStatus(WidgetPackageStatus.ONLINE.getValue())
                .setSandbox(widget.getSandbox())
                .setUpdatedBy(opUserId);
        flag &= SqlHelper.retBool(baseMapper.updateById(wpk));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

        // delete temporary files in the cloud
        this.deleteDeveloperTmpFile(oldAssetList);

        List<Long> toPlayerIds = new ArrayList<>();
        // widget management permissions
        List<Long> memberAdminIds = iSpaceMemberRoleRelService.getMemberId(widget.getSpaceId(), ListUtil.toList("MANAGE_WIDGET"));
        // master administrator
        memberAdminIds.add(spaceMapper.selectSpaceMainAdmin(widget.getSpaceId()));
        if (CollUtil.isNotEmpty(memberAdminIds)) {
            // query user user id
            List<Long> userAdminIds = memberMapper.selectUserIdsByMemberIds(memberAdminIds);
            if (CollUtil.isNotEmpty(userAdminIds)) {
                toPlayerIds.addAll(userAdminIds);
            }
        }
        // send notification
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
                NotificationTemplateId.NEW_SPACE_WIDGET_NOTIFY,
                toPlayerIds,
                opUserId,
                widget.getSpaceId(),
                Dict.create().set(WIDGET_NAME, StrUtil.blankToDefault(i18nName.getZhCN(), i18nName.getEnUS()))));
        return true;
    }

    @Override
    public List<WidgetReleaseListVo> releaseListWidget(Long opUserId, String packageId, Page<WidgetReleaseListVo> page) {
        log.info("get a list of widget publishing history");
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(packageId);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // query widget s home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // Check whether the rollback operator is the author, not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }

        // query publishing history
        page.setSearchCount(false);
        page.setSize(-1);
        // paging query is currently closed
        IPage<WidgetReleaseListVo> pageResult = widgetPackageReleaseMapper.selectReleasePage(page, packageId);
        pageResult.convert(wr -> {
            wr.setCurrentVersion(wpk.getReleaseId().equals(wr.getReleaseId()));
            return wr;
        });
        return pageResult.getRecords();
    }

    @Override
    public boolean rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget) {
        log.info("rollback widget");
        // check rollback version number
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), ROLLBACK_FAIL_VERSION_NUM_ERROR);
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // query widget s home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        /*
         * 1.Check whether the rollback operator is the author, not the author, and then check the widget management authority.
         * 2.Global widget rollback, GM permissions must be verified
         */
        if (!opUserId.equals(wpk.getOwner()) || WidgetReleaseType.GLOBAL == releaseType) {
            // check whether the user is the master administrator
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }
        // Check whether the released version SAH exists and can only be rolled back to the approved version.
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // version id to be rolled back
        Long waitRollbackReleaseId;
        ExceptionUtil.isNotNull(waitRollbackReleaseId = widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, WidgetReleaseStatus.PASS_REVIEW.getValue()), ROLLBACK_FAIL_SELECT_VERSION_ERROR);
        // rollback version
        boolean flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.ONLINE.getValue(), waitRollbackReleaseId, wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return true;
    }

    @Override
    public boolean unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget) {
        log.info("unpublish widget");
        // Check whether the widget exists. Blocked widgets are not allowed to be removed from the shelves.
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // Query widget's home space station
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // Check whether the removed operator is the author, not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkWidgetPermission(opUserId, spaceId, releaseType, Collections.singletonList(ResourceCode.UNPUBLISH_WIDGET));
        }
        // It has been removed from the shelf and returned directly to avoid repeated operations.
        if (WidgetPackageStatus.UNPUBLISH.getValue().equals(wpk.getStatus())) {
            return true;
        }
        // unpush
        boolean flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.UNPUBLISH.getValue(), null, wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);

        this.sendUnpublishWidgetNotify(wpk, spaceId, opUserId);
        return true;
    }

    @Override
    public boolean banWindget(Long opUserId, WidgetPackageBanRo widget) {
        log.info("ban/unban widget");
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        boolean flag;
        if (widget.getUnban()) {
            // ban
            flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.UNPUBLISH.getValue(), null, wpk.getPackageId(), opUserId));
        }
        else {
            // unban, release the release version Id association after the ban
            flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.BANNED.getValue(), null, wpk.getPackageId(), opUserId));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return true;
    }

    @Override
    public WidgetPackageInfoVo getWidgetPackageInfo(String packageId) {
        log.info("get information about a single widget package");
        String userLocale = LoginContext.me().getLocaleStr();
        return CollUtil.getFirst(baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(packageId, null, userLocale));
    }

    @Override
    public List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId) {
        log.info("get widget store information");
        String userLocale = LoginContext.me().getLocaleStr();
        return baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(null, spaceId, userLocale);
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
        // Check whether the widget transfer owner operator is the author, not the author checking widget management permissions
        if (!opUserId.equals(wpk.getOwner())) {
            // check whether the user is the master administrator
            this.checkWidgetPermission(opUserId, spaceId, releaseType, Collections.singletonList(ResourceCode.TRANSFER_WIDGET));
        }
        // Check the transfer for the presence of widget attribution to the space station
        MemberEntity transferMember = iMemberService.getById(transferOwnerRo.getTransferMemberId());
        ExceptionUtil.isNotNull(transferMember, NOT_EXIST_MEMBER);
        ExceptionUtil.isNotNull(transferMember.getUserId(), NOT_EXIST_MEMBER);
        ExceptionUtil.isTrue(StrUtil.equals(transferMember.getSpaceId(), spaceId), NOT_EXIST_MEMBER);
        // modify widget owner
        WidgetPackageEntity updateEntity = WidgetPackageEntity.builder().id(wpk.getId()).owner(transferMember.getUserId()).build();
        boolean flag = super.updateById(updateEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);

        this.sendTransferWidgetNotify(wpk, spaceId, opUserId, transferMember);
    }

    @Override
    public List<GlobalWidgetInfo> getGlobalWidgetPackageConfiguration(String nodeId) {
        return vikaOperations.getGlobalWidgetPackageConfiguration(nodeId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void globalWidgetDbDataRefresh(String nodeId) {
        // Currently, it is paging. If there is more data in the later period, you can consider using paging.
        List<GlobalWidgetInfo> globalWidgetDatas = getGlobalWidgetPackageConfiguration(nodeId);
        // Divide into two batches of SQL for batch operations.
        if (CollUtil.isNotEmpty(globalWidgetDatas)) {
            for (GlobalWidgetInfo globalWidgetData : globalWidgetDatas) {
                baseMapper.singleUpdateGlobalAndTemplateConfig(globalWidgetData);
            }
        }
    }

    @Override
    public void singleGlobalWidgetRefresh(SingleGlobalWidgetRo body) {
        List<GlobalWidgetInfo> globalWidgetPackage = this.getGlobalWidgetPackageConfiguration(body.getNodeId());
        if (CollUtil.isEmpty(globalWidgetPackage)) {
            return;
        }

        Map<String, Integer> globalWidgetSort = new LinkedHashMap<>();
        for (int i = 0; i < globalWidgetPackage.size(); i++) {
            globalWidgetSort.put(globalWidgetPackage.get(i).getPackageId(), i + 1);
        }
        // query whether widget changes order
        Integer newWidgetSort = globalWidgetSort.get(body.getPackageId());
        Integer oldWidgetSort = baseMapper.selectGlobalWidgetSort(body.getPackageId());
        ExceptionUtil.isNotNull(oldWidgetSort, WIDGET_NOT_EXIST);

        GlobalWidgetInfo updateWpk;
        BeanUtil.copyProperties(body, updateWpk = new GlobalWidgetInfo(), CopyOptions.create().ignoreError());
        if (!Objects.equals(newWidgetSort, oldWidgetSort)) {
            // Widget changes in sequence, the corresponding order of exchange
            String oldPackageId = MapUtil.inverse(globalWidgetSort).get(oldWidgetSort);

            GlobalWidgetInfo updateWpkSort = new GlobalWidgetInfo();
            updateWpkSort.setPackageId(oldPackageId);
            updateWpkSort.setWidgetSort(oldWidgetSort);
            baseMapper.singleUpdateGlobalAndTemplateConfig(updateWpkSort);
        }

        updateWpk.setWidgetSort(newWidgetSort);
        boolean flag = SqlHelper.retBool(baseMapper.singleUpdateGlobalAndTemplateConfig(updateWpk));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @SneakyThrows(JsonProcessingException.class)
    @Transactional(rollbackFor = Exception.class)
    public boolean submitWidget(Long opUserId, WidgetPackageSubmitRo widget) {
        log.info("submit global widget review");
        // release widget required parameter check
        boolean validField = StrUtil.hasBlank(widget.getDescription(), widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
        validField |= ObjectUtil.hasNull(widget.getIcon(), widget.getCover(), widget.getAuthorIcon(), widget.getReleaseCodeBundle());
        ExceptionUtil.isFalse(validField, SUBMIT_FAIL_INCOMPLETE_PARAME);

        // check release number
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), SUBMIT_FAIL_VERSION_NUM_ERROR);
        // check if the widget exists
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);

        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        ExceptionUtil.isFalse(WidgetReleaseType.SPACE == releaseType, SUBMIT_FAIL_NO_SUBMIT_METHOD);

        // generate versionSHA
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // Check whether the release version SAH is unique and the version number under each package is unique.
        ExceptionUtil.isNull(widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null), SUBMIT_FAIL_VERSION_NUM_REPEAT);

        // generate installation environment code
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // generate runtime environment code
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        I18nField i18nName, i18nDesc;
        String i18nNameStr = null, i18nDescStr, coverToken, iconToken, authorIconToken, releaseCodeBundleToken, sourceCodeBundleToken = null;
        try {
            i18nName = I18nField.toBean(StrUtil.blankToDefault(widget.getName(), wpk.getI18nName()));
            i18nDesc = I18nField.toBean(widget.getDescription());
            // Check the widget release name. It can be empty. If it is empty, the release does not modify the widget name.
            if (null != i18nName) {
                // english parameter cannot be empty
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            // english parameter cannot be empty
            ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
            i18nDescStr = i18nDesc.toJson();
            // upload cover
            coverToken = this.uploadDeveloperTmpFile(widget.getCover());
            // upload icon
            iconToken = this.uploadDeveloperTmpFile(widget.getIcon());
            // upload authorIcon
            authorIconToken = this.uploadDeveloperTmpFile(widget.getAuthorIcon());
            // upload releaseCodeBundle
            releaseCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getReleaseCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            // upload sourceCodeBundle
            if (Objects.nonNull(widget.getSourceCodeBundle())) {
                sourceCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getSourceCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            }
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }
        catch (RuntimeException | IOException e) {
            throw new BusinessException(e.getMessage());
        }

        // multiple submit directly overwrite, delete the last submit record
        LastSubmitWidgetVersionDTO lastSubmitWidget = widgetPackageReleaseMapper.selectLastWidgetVersionInfoByFatherWidgetId(wpk.getPackageId());
        boolean flag = true;
        if (null != lastSubmitWidget) {
            flag = SqlHelper.retBool(baseMapper.deleteById(lastSubmitWidget.getLastPackageId()));
            flag &= SqlHelper.retBool(widgetPackageReleaseMapper.deleteById(lastSubmitWidget.getLastPackageReleaseId()));
            flag &= SqlHelper.retBool(widgetPackageAuthSpaceMapper.deleteById(lastSubmitWidget.getLastPackageAuthSpaceId()));
        }

        // ===>>> build the pending image record required by submit
        String auditMirrorWidgetId = IdUtil.createWidgetPackageId();
        WidgetPackageReleaseEntity auditMirrorWidgetRelease = new WidgetPackageReleaseEntity()
                .setPackageId(auditMirrorWidgetId)
                .setVersion(widget.getVersion())
                .setReleaseSha(versionSHA)
                .setReleaseCodeBundle(releaseCodeBundleToken)
                .setSourceCodeBundle(sourceCodeBundleToken)
                .setSecretKey(widget.getSecretKey())
                .setReleaseNote(widget.getReleaseNote())
                .setStatus(WidgetReleaseStatus.WAIT_REVIEW.getValue())
                .setReleaseUserId(opUserId)
                .setCreatedBy(opUserId)
                .setInstallEnvCode(installEnvsCodes)
                .setRuntimeEnvCode(runtimeEnvsCodes)
                .setUpdatedBy(opUserId);
        flag &= SqlHelper.retBool(widgetPackageReleaseMapper.insert(auditMirrorWidgetRelease));
        WidgetPackageEntity auditMirrorWidget = new WidgetPackageEntity()
                .setPackageId(auditMirrorWidgetId)
                .setReleaseId(auditMirrorWidgetRelease.getId())
                .setI18nName(i18nNameStr)
                .setI18nDescription(i18nDescStr)
                .setCover(coverToken)
                .setIcon(iconToken)
                .setAuthorName(widget.getAuthorName())
                .setAuthorEmail(widget.getAuthorEmail())
                .setAuthorIcon(authorIconToken)
                .setAuthorLink(widget.getAuthorLink())
                .setPackageType(wpk.getPackageType())
                .setReleaseType(WidgetReleaseType.WAIT_REVIEW.getValue())
                .setStatus(WidgetPackageStatus.ONLINE.getValue())
                .setSandbox(widget.getSandbox())
                .setWidgetBody(
                        WidgetBodyDTO.builder().fatherWidgetId(wpk.getPackageId()).website(widget.getWebsite()).build().toJson()
                )
                .setIsEnabled(false)
                .setOwner(opUserId)
                .setCreatedBy(opUserId)
                .setUpdatedBy(opUserId);
        WidgetPackageAuthSpaceEntity auditMirrorWidgetAuth = new WidgetPackageAuthSpaceEntity()
                .setPackageId(auditMirrorWidgetId)
                // the global widget space station id can be
                .setSpaceId("")
                .setType(WidgetPackageAuthType.BOUND_SPACE.getValue());

        flag &= this.save(auditMirrorWidget) && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(auditMirrorWidgetAuth));
        // ===>>> end build the pending image record required by submit

        // Associate the release history Id to the main widget;
        WidgetBodyDTO widgetBody = WidgetBodyDTO.toBean(wpk.getWidgetBody());
        List<Long> oldHistoryVersion = Optional.ofNullable(widgetBody.getHistoryReleaseVersion()).orElseGet(ArrayList::new);
        oldHistoryVersion.add(auditMirrorWidgetRelease.getId());
        widgetBody.setHistoryReleaseVersion(oldHistoryVersion);

        // modify extension parameters
        wpk.setWidgetBody(widgetBody.toJson());
        flag &= SqlHelper.retBool(baseMapper.updateById(wpk));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return true;
    }

    @Override
    public WidgetPackageEntity getByPackageId(String packageId, boolean checkBan) {
        WidgetPackageEntity wpk = baseMapper.selectWidgetByPackageId(packageId);
        ExceptionUtil.isNotNull(wpk, WIDGET_NOT_EXIST);

        if (checkBan) {
            ExceptionUtil.isFalse(WidgetPackageStatus.BANNED.getValue().equals(wpk.getStatus()), WIDGET_BANNED);
        }
        return wpk;
    }

    /**
     * Check if developers have space stations, basic requirements for development widget personnel
     */
    private void checkDeveloperUserIfSpaceOrGm(Long userId, String spaceId, WidgetReleaseType releaseType) {
        this.checkWidgetPermission(userId, spaceId, releaseType, false, null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean releaseWidget(Long opUserId, WidgetPackageReleaseV2Ro widget) {
        log.info("release widget: user id [{}], package id [{}]", opUserId, widget.getPackageId());

        WidgetPackageEntity wpk = checkReleaseProcessInfo(opUserId, widget);

        // generate version's versionSHA.
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());

        // generate version's versionSHA.
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // the widget's install env code.
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        // get the widget's name and description.
        I18nField i18nName;
        String i18nNameStr = null, i18nDescStr;
        try {
            i18nName = objectMapper.readValue(StrUtil.blankToDefault(widget.getName(), wpk.getI18nName()), I18nField.class);
            // check whether name exist. the name can be empty.
            // empty name mean not modify the original name
            if (null != i18nName) {
                // the en' name is necessary
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            i18nDescStr = getI18nDescStr(widget.getDescription());
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }

        // the old files' storage token.
        String[] oldAssetList = { wpk.getCover(), wpk.getIcon(), wpk.getAuthorIcon() };

        addReleaseHistroyAndModifyWidgetInfo(opUserId, widget, wpk, versionSHA, installEnvsCodes, runtimeEnvsCodes, i18nNameStr, i18nDescStr);

        notifyUserRelease(opUserId, widget.getSpaceId(), i18nName);

        // delete old files.
        for (String oldAsset: oldAssetList) {
            iAssetService.delete(oldAsset);
        }
        return true;
    }

    private void addReleaseHistroyAndModifyWidgetInfo(Long opUserId, WidgetPackageReleaseV2Ro widget, WidgetPackageEntity wpk, String versionSHA, String installEnvsCodes, String runtimeEnvsCodes, String i18nNameStr, String i18nDescStr) {
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
                .setUpdatedBy(opUserId);
        flag &= SqlHelper.retBool(baseMapper.updateById(wpk));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    private void notifyUserRelease(Long opUserId, String spaceId, I18nField i18nName) {
        List<Long> toPlayerIds = new ArrayList<>();
        // admin with "MANAGE_WIDGET" privileges
        List<Long> memberAdminIds = iSpaceMemberRoleRelService.getMemberId(spaceId, ListUtil.toList("MANAGE_WIDGET"));
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
                Dict.create().set(WIDGET_NAME, StrUtil.blankToDefault(i18nName.getZhCN(), i18nName.getEnUS()))));
    }

    private String generateVersionSHA(WidgetPackageBaseV2Ro widget, WidgetPackageEntity wpk) {
        //  generate version's versionSHA.
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // check versionSHA is only one in release's versionSHA.
        ExceptionUtil.isNull(widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null), RELEASES_FAIL_VERSION_NUM_REPEAT);
        return versionSHA;
    }

    private WidgetPackageEntity checkReleaseProcessInfo(Long opUserId, WidgetPackageReleaseV2Ro widget) {
        // release process required info
        boolean validField = StrUtil.hasBlank(widget.getDescription());
        validField |= StrUtil.hasBlank(widget.getIconToken(), widget.getCoverToken(), widget.getAuthorIconToken(), widget.getReleaseCodeBundleToken());
        ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);
        // check whether widget exist
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), RELEASES_FAIL_VERSION_NUM_ERROR);

        // check whether widget exist
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());

        // check whether widget is banned
        ExceptionUtil.isFalse(Objects.equals(wpk.getStatus(), WidgetPackageStatus.BANNED.getValue()), RELEASES_FAIL_WIDGET_DISABLED);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        if (WidgetReleaseType.GLOBAL == releaseType) {
            // if widget is global widget, it requires author info for releasing
            validField = StrUtil.hasBlank(widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
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
    public boolean submitWidget(Long opUserId, WidgetPackageSubmitV2Ro widget) {
        log.info("submit global widget review. package id: {}", widget.getPackageId());

        checkSubmitReviewInfo(widget);

        // check whether widget exist.
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);

        // check widget's release type is global.
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        ExceptionUtil.isFalse(WidgetReleaseType.SPACE == releaseType, SUBMIT_FAIL_NO_SUBMIT_METHOD);

        // generate version's versionSHA.
        String versionSHA = generateVersionSHA(widget, wpk);

        // the widget's install env code.
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // the widget's runtime env code.
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        // get the widget's name and description.
        String i18nNameStr, i18nDescStr;
        try {
            i18nNameStr = getI18nNameStr(widget.getName(), wpk.getI18nName());
            i18nDescStr = getI18nDescStr(widget.getDescription());
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }

        // check the number of submit. If there are more than one sumbit, delete the last review.
        removeExistSubmit(wpk.getPackageId());

        // ===>>> build the mirror submit review
        WidgetPackageReleaseEntity auditMirrorWidgetRelease = getWidgetPackageReleaseEntity(opUserId, widget, wpk, versionSHA, installEnvsCodes, runtimeEnvsCodes, i18nNameStr, i18nDescStr);
        // ===>>> end build the audit mirror widget release's record
        // postSubmit: update the extended info
        postSubmit(wpk.getId(), wpk.getWidgetBody(), auditMirrorWidgetRelease.getId());
        return true;
    }

    private WidgetPackageReleaseEntity getWidgetPackageReleaseEntity(Long opUserId, WidgetPackageSubmitV2Ro widget, WidgetPackageEntity wpk, String versionSHA, String installEnvsCodes, String runtimeEnvsCodes, String i18nNameStr, String i18nDescStr) throws JsonProcessingException {
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
        boolean flag = SqlHelper.retBool(widgetPackageReleaseMapper.insert(auditMirrorWidgetRelease));
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
                        WidgetBodyDTO.builder().fatherWidgetId(wpk.getPackageId()).website(widget.getWebsite()).build().toJson()
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
        flag &= this.save(auditMirrorWidget) && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(auditMirrorWidgetAuth));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return auditMirrorWidgetRelease;
    }

    private void removeExistSubmit(String packageId) {
        LastSubmitWidgetVersionDTO lastSubmitWidget = widgetPackageReleaseMapper.selectLastWidgetVersionInfoByFatherWidgetId(packageId);
        boolean flag = true;
        if (null != lastSubmitWidget) {
            flag = SqlHelper.retBool(baseMapper.deleteById(lastSubmitWidget.getLastPackageId()));
            flag &= SqlHelper.retBool(widgetPackageReleaseMapper.deleteById(lastSubmitWidget.getLastPackageReleaseId()));
            flag &= SqlHelper.retBool(widgetPackageAuthSpaceMapper.deleteById(lastSubmitWidget.getLastPackageAuthSpaceId()));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    private String getI18nDescStr(String description) throws JsonProcessingException {
        String i18nDescStr;
        I18nField i18nDesc;
        i18nDesc = I18nField.toBean(description);
        // the en' description cannot be empty
        ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
        i18nDescStr = i18nDesc.toJson();
        return i18nDescStr;
    }

    private String getI18nNameStr(String name,String defaultI18nName) throws JsonProcessingException {
        I18nField i18nName;
        i18nName = I18nField.toBean(StrUtil.blankToDefault(name, defaultI18nName));
        // Check the widget release name. It can be empty. If it is empty, the release does not modify the widget name.
        if (null != i18nName) {
            // the en' name is necessary
            ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
            return i18nName.toJson();
        }
        return null;
    }

    private void checkSubmitReviewInfo(WidgetPackageSubmitV2Ro widget) {
        // check whether necessary parameters are included
        boolean validField = StrUtil.hasBlank(widget.getDescription(), widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
        validField |= StrUtil.hasBlank(widget.getIconToken(), widget.getCoverToken(), widget.getAuthorIconToken(), widget.getReleaseCodeBundleToken());
        ExceptionUtil.isFalse(validField, SUBMIT_FAIL_INCOMPLETE_PARAME);
        // check whether the version is valid
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), SUBMIT_FAIL_VERSION_NUM_ERROR);
    }

    private void postSubmit(Long widgetPackageId, String widgetExtendBody, Long releaseHistoryId) throws JsonProcessingException {
        // rel the release history id to the widget package
        WidgetBodyDTO widgetBody = WidgetBodyDTO.toBean(widgetExtendBody);
        List<Long> oldHistoryVersion = Optional.ofNullable(widgetBody.getHistoryReleaseVersion()).orElseGet(ArrayList::new);
        oldHistoryVersion.add(releaseHistoryId);
        widgetBody.setHistoryReleaseVersion(oldHistoryVersion);

        // update the extended info
        boolean flag = SqlHelper.retBool(baseMapper.updateWidgetBodyById(widgetPackageId, widgetBody.toJson()));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }


    /**
     * <p>Check developer permissions, all operations Gm can intervene <p>
     *
     * @param userId user id
     * @param spaceId space id
     * @param releaseType publishingType
     * @param resourceCodes permission resource code
     * 
     * 
     */
    private void checkWidgetPermission(Long userId, String spaceId, WidgetReleaseType releaseType, List<ResourceCode> resourceCodes) {
        this.checkWidgetPermission(userId, spaceId, releaseType, true, resourceCodes);
    }

    /**
     * <p>Check developer permissions, all operations Gm can intervene <p>
     *
     * @param userId user id
     * @param spaceId space id
     * @param releaseType publishing type
     * @param checkPermission whether to verify permissions
     * @param resourceCodes permission resource code
     * 
     * 
     */
    private void checkWidgetPermission(Long userId, String spaceId, WidgetReleaseType releaseType, boolean checkPermission, List<ResourceCode> resourceCodes) {
        log.info("Check widget developer permissions ");
        if (WidgetReleaseType.GLOBAL == releaseType) {
            // At present, there is no audit process, and the global small-size organization can only be controlled by the official GM.
            iGmService.validPermission(userId, GmAction.WIDGET_MANAGE);
        }
        else {
            boolean isExist = false;
            try {
                UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
                if (!checkPermission || userSpace.isMainAdmin()) {
                    // Do not check the permissions, the upper-level entrance to determine whether the owner, here to add a master administrator
                    isExist = true;
                }
                else if (CollUtil.containsAny(userSpace.getResourceCodes(), resourceCodes) || userSpace.isMainAdmin()) {
                    // Check permissions to determine whether the operation user permission group or the operation user is the master administrator.
                    isExist = true;
                }
            }
            catch (Exception e) {
                throw new BusinessException("Insufficient authority ");
            }
            finally {
                if (!isExist) {
                    iGmService.validPermission(userId, GmAction.WIDGET_MANAGE);
                }
            }
        }
    }

    /**
     * developer temporary file upload
     * <p>
     * After the upload is completed, the previous file resources will be manually replaced.
     * </p>
     *
     * @param file file to be uploaded
     * @return upload file token
     * 
     * 
     */
    private String uploadDeveloperTmpFile(MultipartFile file) throws IOException {
        if (null == file) {
            return null;
        }
        AssetUploadResult assetUploadResult = iAssetService.uploadFile(file.getInputStream(), file.getSize(), file.getContentType());
        return assetUploadResult.getToken();
    }

    /**
     * delete temporary developer files
     *
     * @param cloudPaths cloud path
     */
    private void deleteDeveloperTmpFile(String... cloudPaths) {
        for (String cloudPath : cloudPaths) {
            if (StrUtil.isNotBlank(cloudPath) && StrUtil.startWith(cloudPath, PUBLIC_PREFIX)) {
                // delete cloud original file
                iAssetService.delete(cloudPath);
            }
        }
    }

    /**
     * upload the source code of the published file
     *
     * @param file file to be uploaded
     * @param packageId widgetId
     * @param version release version number
     * @param releaseCreatedBy publisher
     * @return upload file token
     */
    private String uploadReleaseCodeSourceFile(MultipartFile file, String packageId, String version, Long releaseCreatedBy) throws IOException {
        if (null == file) {
            return null;
        }
        // declare a custom upload directory {developer file prefix} / {developer upload type：widget} / {widgetID} / {version number} / {UUID.file suffix}
        String paht = StrUtil.format("{}/{}/{}/{}/{}.{}", DEVELOP_PREFIX, DeveloperAssetType.WIDGET.name().toLowerCase(), packageId, version, ObjectId.next(), FileUtil.extName(file.getOriginalFilename()));
        AssetUploadResult assetUploadResult = iAssetService.uploadFileInDeveloper(file.getInputStream(), paht, file.getOriginalFilename(), file.getSize(), file.getContentType(), releaseCreatedBy, DeveloperAssetType.WIDGET);
        return assetUploadResult.getToken();
    }

    @SneakyThrows(JsonProcessingException.class)
    private void sendUnpublishWidgetNotify(WidgetPackageEntity wpk, String spaceId, Long opUserId) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        // notify holder
        String widgetName = I18nField.toBean(wpk.getI18nName()).getString(defaultLang);

        Dict dict = Dict.create();
        dict.set("WIDGET_NAME", widgetName);
        dict.set("YEARS", LocalDate.now().getYear());
        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", widgetName);

        // to email
        List<Long> toPlayerIds = ListUtil.toList(wpk.getOwner());
        List<String> emails = userMapper.selectEmailByUserIds(toPlayerIds);

        String subjectType;
        if (WidgetReleaseType.GLOBAL.getValue().equals(wpk.getReleaseType())) {
            subjectType = MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;
        }
        else {
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
        List<MailWithLang> tos = MailWithLang.convert(emailsWithLang, emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()));
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(subjectType, mapDict, dict, tos));
    }

    @SneakyThrows(JsonProcessingException.class)
    private void sendTransferWidgetNotify(WidgetPackageEntity wpk, String spaceId, Long opUserId, MemberEntity transferMember) {
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
                Dict.create().set(WIDGET_NAME, widgetName).set(INVOLVE_MEMBER_ID, ListUtil.toList(transferMember.getId()))));

        // send notification email
        String spaceName = spaceMapper.selectSpaceNameBySpaceId(spaceId);
        List<String> emails = userMapper.selectEmailByUserIds(toPlayerIds);
        Dict dict = Dict.create();
        dict.set("SPACE_NAME", spaceName);
        dict.set("WIDGET_NAME", widgetName);
        dict.set("MEMBER_NAME", transferMember.getMemberName());
        dict.set("YEARS", LocalDate.now().getYear());
        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", widgetName);
        List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, emails);
        List<MailWithLang> tos = MailWithLang.convert(emailsWithLang, emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()));
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY, mapDict, dict, tos));
    }

}

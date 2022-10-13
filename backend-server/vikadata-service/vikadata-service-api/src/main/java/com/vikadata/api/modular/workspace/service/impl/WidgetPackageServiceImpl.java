package com.vikadata.api.modular.workspace.service.impl;

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
import com.vikadata.api.enums.widget.InstallEnvType;
import com.vikadata.api.enums.widget.RuntimeEnvType;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.control.permission.space.resource.ResourceCode;
import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.WidgetException;
import com.vikadata.api.enums.workbench.WidgetPackageAuthType;
import com.vikadata.api.enums.workbench.WidgetPackageStatus;
import com.vikadata.api.enums.workbench.WidgetPackageType;
import com.vikadata.api.enums.workbench.WidgetReleaseStatus;
import com.vikadata.api.enums.workbench.WidgetReleaseType;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.model.dto.widget.LastSubmitWidgetVersionDTO;
import com.vikadata.api.model.dto.widget.WidgetBodyDTO;
import com.vikadata.api.model.ro.widget.WidgetPackageBanRo;
import com.vikadata.api.model.ro.widget.WidgetPackageBaseRo.I18nField;
import com.vikadata.api.model.ro.widget.WidgetPackageBaseV2Ro;
import com.vikadata.api.model.ro.widget.WidgetPackageCreateRo;
import com.vikadata.api.model.ro.widget.WidgetPackageReleaseRo;
import com.vikadata.api.model.ro.widget.WidgetPackageReleaseV2Ro;
import com.vikadata.api.model.ro.widget.WidgetPackageRollbackRo;
import com.vikadata.api.model.ro.widget.WidgetPackageSubmitRo;
import com.vikadata.api.model.ro.widget.WidgetPackageSubmitV2Ro;
import com.vikadata.api.model.ro.widget.WidgetPackageUnpublishRo;
import com.vikadata.api.model.ro.widget.WidgetTransferOwnerRo;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.model.vo.widget.WidgetPackageInfoVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseCreateVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseListVo;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.developer.model.SingleGlobalWidgetRo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceMemberRoleRelService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageAuthSpaceMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageReleaseMapper;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.WidgetReleaseVersionUtils;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.WidgetPackageAuthSpaceEntity;
import com.vikadata.entity.WidgetPackageEntity;
import com.vikadata.entity.WidgetPackageReleaseEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.GlobalWidgetInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.constants.AssetsPublicConstants.DEVELOP_PREFIX;
import static com.vikadata.api.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.vikadata.api.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.vikadata.api.constants.NotificationConstants.WIDGET_NAME;
import static com.vikadata.api.enums.exception.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.enums.exception.WidgetException.CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT;
import static com.vikadata.api.enums.exception.WidgetException.EN_US_REQUIRED;
import static com.vikadata.api.enums.exception.WidgetException.RELEASES_FAIL_INCOMPLETE_PARAME;
import static com.vikadata.api.enums.exception.WidgetException.RELEASES_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enums.exception.WidgetException.RELEASES_FAIL_VERSION_NUM_REPEAT;
import static com.vikadata.api.enums.exception.WidgetException.RELEASES_FAIL_WIDGET_DISABLED;
import static com.vikadata.api.enums.exception.WidgetException.ROLLBACK_FAIL_SELECT_VERSION_ERROR;
import static com.vikadata.api.enums.exception.WidgetException.ROLLBACK_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enums.exception.WidgetException.SUBMIT_FAIL_INCOMPLETE_PARAME;
import static com.vikadata.api.enums.exception.WidgetException.SUBMIT_FAIL_NO_SUBMIT_METHOD;
import static com.vikadata.api.enums.exception.WidgetException.SUBMIT_FAIL_VERSION_NUM_ERROR;
import static com.vikadata.api.enums.exception.WidgetException.SUBMIT_FAIL_VERSION_NUM_REPEAT;
import static com.vikadata.api.enums.exception.WidgetException.WIDGET_BANNED;
import static com.vikadata.api.enums.exception.WidgetException.WIDGET_NOT_EXIST;

/**
 * @author Shawn Deng
 * @date 2021-01-09 16:22:05
 */
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
        log.info("检查组件安装包是否存在, widgetPackageId:{}，status:{}", widgetPackageId, status);
        // 判断组件包是否存在
        Integer packageStatus = baseMapper.selectStatusByPackageId(widgetPackageId);
        ExceptionUtil.isTrue(packageStatus != null && status.contains(packageStatus),
                WidgetException.WIDGET_PACKAGE_NOT_EXIST);
    }

    @Override
    public boolean checkCustomPackageId(String customPackageId) {
        log.info("检查组件自定义ID：{}，是否唯一", customPackageId);
        return baseMapper.countNumByPackageId(customPackageId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget) {
        log.info("创建小程序");
        // 检查小程序包类型
        WidgetPackageType packageType = WidgetPackageType.toEnum(widget.getPackageType());
        // 检查小程序发布类型
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(widget.getReleaseType());
        // 检查开发人员权限
        this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        String packageId = widget.getPackageId();
        if (StrUtil.isNotBlank(packageId)) {
            // 检查自定义packageId
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
            // 英文参数不能为空
            ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
            i18nNameStr = i18nName.toJson();
        }
        catch (JsonProcessingException e) {
            throw new BusinessException("The JSON format of widget name or description is incorrect");
        }

        // 查询最新的组件包顺序
        int maxSort = baseMapper.selectMaxWidgetSort(releaseType.getValue(), widget.getSpaceId());

        // 创建小程序包，并且绑定空间
        WidgetPackageEntity saveObj = new WidgetPackageEntity()
                .setPackageId(packageId)
                .setI18nName(i18nNameStr)
                .setPackageType(packageType.getValue())
                .setReleaseType(releaseType.getValue())
                // 空间站小程序默认生效，全局小程序默认不生效
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

        // 返回结果
        WidgetReleaseCreateVo result = new WidgetReleaseCreateVo();
        result.setPackageId(saveObj.getPackageId());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean releaseWidget(Long opUserId, WidgetPackageReleaseRo widget) {
        log.info("发布小程序");
        // 发布小程序必填参数检查
        boolean validField = StrUtil.hasBlank(widget.getDescription());
        validField |= ObjectUtil.hasNull(widget.getIcon(), widget.getCover(), widget.getAuthorIcon(), widget.getReleaseCodeBundle());
        ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);

        // 检查发布版本号
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), RELEASES_FAIL_VERSION_NUM_ERROR);
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        ExceptionUtil.isFalse(Objects.equals(wpk.getStatus(), WidgetPackageStatus.BANNED.getValue()), RELEASES_FAIL_WIDGET_DISABLED);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // 空间站小程序允许不绑定 作者名称，作者邮箱，作者链接
        if (WidgetReleaseType.GLOBAL == releaseType) {
            validField = StrUtil.hasBlank(widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
            ExceptionUtil.isFalse(validField, RELEASES_FAIL_INCOMPLETE_PARAME);
        }

        // 检查开发人员权限
        if (!opUserId.equals(wpk.getOwner())) {
            this.checkDeveloperUserIfSpaceOrGm(opUserId, widget.getSpaceId(), releaseType);
        }
        // 生成versionSHA
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());

        // 生成安装环境编码
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // 生成运行环境编码
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        I18nField i18nName, i18nDesc;
        String i18nNameStr = null, i18nDescStr, coverToken, iconToken, authorIconToken, releaseCodeBundleToken, sourceCodeBundleToken = null;
        try {
            i18nName = objectMapper.readValue(StrUtil.blankToDefault(widget.getName(), wpk.getI18nName()), I18nField.class);
            i18nDesc = objectMapper.readValue(widget.getDescription(), I18nField.class);
            // 检查小程序发布名称，可以为空，为空发布不修改小程序名称
            if (null != i18nName) {
                // 英文参数不能为空
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            // 英文参数不能为空
            ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
            // 检查发布版本SAH是否唯一，每个包下版本号唯一
            ExceptionUtil.isNull(widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null), RELEASES_FAIL_VERSION_NUM_REPEAT);
            i18nDescStr = i18nDesc.toJson();
            // 上传cover
            coverToken = this.uploadDeveloperTmpFile(widget.getCover());
            // 上传icon
            iconToken = this.uploadDeveloperTmpFile(widget.getIcon());
            // 上传authorIcon
            authorIconToken = this.uploadDeveloperTmpFile(widget.getAuthorIcon());
            // 上传releaseCodeBundle
            releaseCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getReleaseCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            // 上传sourceCodeBundle
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

        // 创建发布版本记录
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

        // 保存发布版本记录
        boolean flag = SqlHelper.retBool(widgetPackageReleaseMapper.insert(saveWpr));
        // 修改组件包状态
        String[] oldAssetList = { wpk.getCover(), wpk.getIcon(), wpk.getAuthorIcon() };
        // 修改发布信息
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

        // 删除云端临时文件
        this.deleteDeveloperTmpFile(oldAssetList);

        List<Long> toPlayerIds = new ArrayList<>();
        // 小程序管理权限
        List<Long> memberAdminIds = iSpaceMemberRoleRelService.getMemberId(widget.getSpaceId(), ListUtil.toList("MANAGE_WIDGET"));
        // 主管理员
        memberAdminIds.add(spaceMapper.selectSpaceMainAdmin(widget.getSpaceId()));
        if (CollUtil.isNotEmpty(memberAdminIds)) {
            // 查询用户UserId
            List<Long> userAdminIds = memberMapper.selectUserIdsByMemberIds(memberAdminIds);
            if (CollUtil.isNotEmpty(userAdminIds)) {
                toPlayerIds.addAll(userAdminIds);
            }
        }
        // 发送通知
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
        log.info("获取小程序发布历史列表");
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(packageId);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // 查询小程序归属空间站
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // 检查回滚操作人是否作者，不是作者在校验小程序管理权限
        if (!opUserId.equals(wpk.getOwner())) {
            // 检查用户是否主管理员
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }

        // 查询发布历史
        page.setSearchCount(false);
        page.setSize(-1);
        // 目前关闭分页查询
        IPage<WidgetReleaseListVo> pageResult = widgetPackageReleaseMapper.selectReleasePage(page, packageId);
        pageResult.convert(wr -> {
            wr.setCurrentVersion(wpk.getReleaseId().equals(wr.getReleaseId()));
            return wr;
        });
        return pageResult.getRecords();
    }

    @Override
    public boolean rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget) {
        log.info("回滚小程序");
        // 检查回滚版本号
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), ROLLBACK_FAIL_VERSION_NUM_ERROR);
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // 查询小程序归属空间站
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        /*
         * 1.检查回滚操作人是否作者，不是作者再校验小程序管理权限
         * 2.全局小组件回滚，必须校验GM权限
         */
        if (!opUserId.equals(wpk.getOwner()) || WidgetReleaseType.GLOBAL == releaseType) {
            // 检查用户是否主管理员
            this.checkDeveloperUserIfSpaceOrGm(opUserId, spaceId, releaseType);
        }
        // 检查发布版本SAH是否存在，只能回滚到审核通过的版本
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // 待回滚版本Id
        Long waitRollbackReleaseId;
        ExceptionUtil.isNotNull(waitRollbackReleaseId = widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, WidgetReleaseStatus.PASS_REVIEW.getValue()), ROLLBACK_FAIL_SELECT_VERSION_ERROR);
        // 回滚版本
        boolean flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.ONLINE.getValue(), waitRollbackReleaseId, wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return true;
    }

    @Override
    public boolean unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget) {
        log.info("下架小程序");
        // 检查小程序是否存在，封禁的小程序不允许下架
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        // 查询小程序归属空间站
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        // 检查下架操作人是否作者，不是作者在校验小程序管理权限
        if (!opUserId.equals(wpk.getOwner())) {
            // 检查用户是否主管理员
            this.checkWidgetPermission(opUserId, spaceId, releaseType, Collections.singletonList(ResourceCode.UNPUBLISH_WIDGET));
        }
        // 已下架直接返回，避免重复操作
        if (WidgetPackageStatus.UNPUBLISH.getValue().equals(wpk.getStatus())) {
            return true;
        }
        // 下架
        boolean flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.UNPUBLISH.getValue(), null, wpk.getPackageId(), opUserId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);

        this.sendUnpublishWidgetNotify(wpk, spaceId, opUserId);
        return true;
    }

    @Override
    public boolean banWindget(Long opUserId, WidgetPackageBanRo widget) {
        log.info("禁封/解禁小程序");
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId());
        boolean flag;
        if (widget.getUnban()) {
            // 解禁
            flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.UNPUBLISH.getValue(), null, wpk.getPackageId(), opUserId));
        }
        else {
            // 封禁，封禁后解除发布版本Id关联
            flag = SqlHelper.retBool(baseMapper.updateStatusAndReleaseIdByPackageId(WidgetPackageStatus.BANNED.getValue(), null, wpk.getPackageId(), opUserId));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return true;
    }

    @Override
    public WidgetPackageInfoVo getWidgetPackageInfo(String packageId) {
        log.info("获取单个小程序包信息");
        String userLocale = LoginContext.me().getLocaleStr();
        return CollUtil.getFirst(baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(packageId, null, userLocale));
    }

    @Override
    public List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId) {
        log.info("获取小程序商店信息");
        String userLocale = LoginContext.me().getLocaleStr();
        return baseMapper.selectWidgetPackageInfoByPackageIdOrSpaceId(null, spaceId, userLocale);
    }

    @Override
    public void transferWidgetOwner(Long opUserId, WidgetTransferOwnerRo transferOwnerRo) {
        log.info("小程序转移Owner");
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(transferOwnerRo.getPackageId());
        // 查询小程序归属空间站
        String spaceId = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId(wpk.getPackageId());
        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        if (WidgetReleaseType.GLOBAL.equals(releaseType)) {
            // 全局小程序不允许转移拥有者
            throw new BusinessException("权限不足");
        }
        // 检查小程序转移Owner操作人是否作者，不是作者在校验小程序管理权限
        if (!opUserId.equals(wpk.getOwner())) {
            // 检查用户是否主管理员
            this.checkWidgetPermission(opUserId, spaceId, releaseType, Collections.singletonList(ResourceCode.TRANSFER_WIDGET));
        }
        // 检查转移人员是否存在小程序归属空间站
        MemberEntity transferMember = iMemberService.getById(transferOwnerRo.getTransferMemberId());
        ExceptionUtil.isNotNull(transferMember, NOT_EXIST_MEMBER);
        ExceptionUtil.isNotNull(transferMember.getUserId(), NOT_EXIST_MEMBER);
        ExceptionUtil.isTrue(StrUtil.equals(transferMember.getSpaceId(), spaceId), NOT_EXIST_MEMBER);
        // 修改小程序Owner
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
        // 当前为分页，后期数据多了可以考虑使用分页
        List<GlobalWidgetInfo> globalWidgetDatas = getGlobalWidgetPackageConfiguration(nodeId);
        // 为了批量操作分成两批Sql
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
        // 查询小程序是否改变顺序
        Integer newWidgetSort = globalWidgetSort.get(body.getPackageId());
        Integer oldWidgetSort = baseMapper.selectGlobalWidgetSort(body.getPackageId());
        ExceptionUtil.isNotNull(oldWidgetSort, WIDGET_NOT_EXIST);

        GlobalWidgetInfo updateWpk;
        BeanUtil.copyProperties(body, updateWpk = new GlobalWidgetInfo(), CopyOptions.create().ignoreError());
        if (!Objects.equals(newWidgetSort, oldWidgetSort)) {
            // 小程序循序改变，兑换对应的顺序
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
        log.info("提交全局小程序审核");
        // 发布小程序必填参数检查
        boolean validField = StrUtil.hasBlank(widget.getDescription(), widget.getAuthorName(), widget.getAuthorLink(), widget.getAuthorEmail());
        validField |= ObjectUtil.hasNull(widget.getIcon(), widget.getCover(), widget.getAuthorIcon(), widget.getReleaseCodeBundle());
        ExceptionUtil.isFalse(validField, SUBMIT_FAIL_INCOMPLETE_PARAME);

        // 检查发布版本号
        ExceptionUtil.isTrue(WidgetReleaseVersionUtils.checkVersion(widget.getVersion()), SUBMIT_FAIL_VERSION_NUM_ERROR);
        // 检查小程序是否存在
        WidgetPackageEntity wpk = this.getByPackageId(widget.getPackageId(), true);

        WidgetReleaseType releaseType = WidgetReleaseType.toEnum(wpk.getReleaseType());
        ExceptionUtil.isFalse(WidgetReleaseType.SPACE == releaseType, SUBMIT_FAIL_NO_SUBMIT_METHOD);

        // 生成versionSHA
        String versionSHA = WidgetReleaseVersionUtils.createVersionSHA(wpk.getPackageId(), widget.getVersion());
        // 检查发布版本SAH是否唯一，每个包下版本号唯一
        ExceptionUtil.isNull(widgetPackageReleaseMapper.selectReleaseShaToId(versionSHA, null), SUBMIT_FAIL_VERSION_NUM_REPEAT);

        // 生成安装环境编码
        String installEnvsCodes = InstallEnvType.getInstallEnvCode(widget.getInstallEnv());

        // 生成运行环境编码
        String runtimeEnvsCodes = RuntimeEnvType.getRuntimeEnvCode(widget.getRuntimeEnv());

        I18nField i18nName, i18nDesc;
        String i18nNameStr = null, i18nDescStr, coverToken, iconToken, authorIconToken, releaseCodeBundleToken, sourceCodeBundleToken = null;
        try {
            i18nName = I18nField.toBean(StrUtil.blankToDefault(widget.getName(), wpk.getI18nName()));
            i18nDesc = I18nField.toBean(widget.getDescription());
            // 检查小程序发布名称，可以为空，为空发布不修改小程序名称
            if (null != i18nName) {
                // 英文参数不能为空
                ExceptionUtil.isNotBlank(i18nName.getEnUS(), EN_US_REQUIRED);
                i18nNameStr = i18nName.toJson();
            }
            // 英文参数不能为空
            ExceptionUtil.isNotBlank(i18nDesc.getEnUS(), EN_US_REQUIRED);
            i18nDescStr = i18nDesc.toJson();
            // 上传cover
            coverToken = this.uploadDeveloperTmpFile(widget.getCover());
            // 上传icon
            iconToken = this.uploadDeveloperTmpFile(widget.getIcon());
            // 上传authorIcon
            authorIconToken = this.uploadDeveloperTmpFile(widget.getAuthorIcon());
            // 上传releaseCodeBundle
            releaseCodeBundleToken = this.uploadReleaseCodeSourceFile(widget.getReleaseCodeBundle(), wpk.getPackageId(), widget.getVersion(), opUserId);
            // 上传sourceCodeBundle
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

        // 多次submit直接覆盖，删除最后一次submit记录
        LastSubmitWidgetVersionDTO lastSubmitWidget = widgetPackageReleaseMapper.selectLastWidgetVersionInfoByFatherWidgetId(wpk.getPackageId());
        boolean flag = true;
        if (null != lastSubmitWidget) {
            flag = SqlHelper.retBool(baseMapper.deleteById(lastSubmitWidget.getLastPackageId()));
            flag &= SqlHelper.retBool(widgetPackageReleaseMapper.deleteById(lastSubmitWidget.getLastPackageReleaseId()));
            flag &= SqlHelper.retBool(widgetPackageAuthSpaceMapper.deleteById(lastSubmitWidget.getLastPackageAuthSpaceId()));
        }

        // ===>>> 构建submit需要的待审核镜像记录
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
                // 全局小程序空间站Id可以为 ""
                .setSpaceId("")
                .setType(WidgetPackageAuthType.BOUND_SPACE.getValue());

        flag &= this.save(auditMirrorWidget) && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(auditMirrorWidgetAuth));
        // ===>>> end 构建submit需要的待审核镜像记录

        // 关联发布历史记录Id，到主小程序；
        WidgetBodyDTO widgetBody = WidgetBodyDTO.toBean(wpk.getWidgetBody());
        List<Long> oldHistoryVersion = Optional.ofNullable(widgetBody.getHistoryReleaseVersion()).orElseGet(ArrayList::new);
        oldHistoryVersion.add(auditMirrorWidgetRelease.getId());
        widgetBody.setHistoryReleaseVersion(oldHistoryVersion);

        // 修改扩展参数
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
     * 检查开发人员是否存在空间站，开发小程序人员基本要求
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
        // 检查小程序发布名称，可以为空，为空发布不修改小程序名称
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
     * <p>检查开发人员权限，所有操作Gm都可以干预</p>
     *
     * @param userId                        用户ID
     * @param spaceId                       空间ID
     * @param releaseType                   发布类型
     * @param resourceCodes                 权限资源编码
     * @author Pengap
     * @date 2021/10/27 14:55:43
     */
    private void checkWidgetPermission(Long userId, String spaceId, WidgetReleaseType releaseType, List<ResourceCode> resourceCodes) {
        this.checkWidgetPermission(userId, spaceId, releaseType, true, resourceCodes);
    }

    /**
     * <p>检查开发人员权限，所有操作Gm都可以干预</p>
     *
     * @param userId                        用户ID
     * @param spaceId                       空间ID
     * @param releaseType                   发布类型
     * @param checkPermission               是否校验权限
     * @param resourceCodes                 权限资源编码
     * @author Pengap
     * @date 2021/7/8
     */
    private void checkWidgetPermission(Long userId, String spaceId, WidgetReleaseType releaseType, boolean checkPermission, List<ResourceCode> resourceCodes) {
        log.info("检查小程序开发人员权限");
        if (WidgetReleaseType.GLOBAL == releaseType) {
            // 目前没有审核流程，全局小组建只能官方GM才能操控
            iGmService.validPermission(userId, GmAction.WIDGET_MANAGE);
        }
        else {
            boolean isExist = false;
            try {
                UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
                if (!checkPermission || userSpace.isMainAdmin()) {
                    // 不校验权限，上层入口判断是否owner，这里多加一个主管理员
                    isExist = true;
                }
                else if (CollUtil.containsAny(userSpace.getResourceCodes(), resourceCodes) || userSpace.isMainAdmin()) {
                    // 校验权限，判断操作用户权限组或者操作用户是否主管理员
                    isExist = true;
                }
            }
            catch (Exception e) {
                throw new BusinessException("权限不足");
            }
            finally {
                if (!isExist) {
                    iGmService.validPermission(userId, GmAction.WIDGET_MANAGE);
                }
            }
        }
    }

    /**
     * 开发者临时文件上传
     * <p>
     * 上传完成后，会手动替换以前的文件资源
     * </p>
     *
     * @param file 待上传文件
     * @return 上传文件Token
     * @author Pengap
     * @date 2021/7/21
     */
    private String uploadDeveloperTmpFile(MultipartFile file) throws IOException {
        if (null == file) {
            return null;
        }
        AssetUploadResult assetUploadResult = iAssetService.uploadFile(file.getInputStream(), file.getSize(), file.getContentType());
        return assetUploadResult.getToken();
    }

    /**
     * 删除开发者临时文件
     *
     * @param cloudPaths 云端路径
     * @author Pengap
     * @date 2021/7/21
     */
    private void deleteDeveloperTmpFile(String... cloudPaths) {
        for (String cloudPath : cloudPaths) {
            if (StrUtil.isNotBlank(cloudPath) && StrUtil.startWith(cloudPath, PUBLIC_PREFIX)) {
                //删除云端原文件
                iAssetService.delete(cloudPath);
            }
        }
    }

    /**
     * 发布文件源码上传
     *
     * @param file 待上传文件
     * @param packageId 小程序Id
     * @param version 发布版本号
     * @param releaseCreatedBy 发布人
     * @return 上传文件Token
     * @author Pengap
     * @date 2021/7/21
     */
    private String uploadReleaseCodeSourceFile(MultipartFile file, String packageId, String version, Long releaseCreatedBy) throws IOException {
        if (null == file) {
            return null;
        }
        // 声明一个自定义上传目录 {开发者文件前缀} / {开发者上传类型：小程序} / {小程序ID} / {版本号} / {UUID.文件后缀}
        String paht = StrUtil.format("{}/{}/{}/{}/{}.{}", DEVELOP_PREFIX, DeveloperAssetType.WIDGET.name().toLowerCase(), packageId, version, ObjectId.next(), FileUtil.extName(file.getOriginalFilename()));
        AssetUploadResult assetUploadResult = iAssetService.uploadFileInDeveloper(file.getInputStream(), paht, file.getOriginalFilename(), file.getSize(), file.getContentType(), releaseCreatedBy, DeveloperAssetType.WIDGET);
        return assetUploadResult.getToken();
    }

    @SneakyThrows(JsonProcessingException.class)
    private void sendUnpublishWidgetNotify(WidgetPackageEntity wpk, String spaceId, Long opUserId) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        // 通知holder
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
            // 发送系统通知
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
                    NotificationTemplateId.ADMIN_UNPUBLISH_SPACE_WIDGET_NOTIFY,
                    toPlayerIds,
                    opUserId,
                    spaceId,
                    Dict.create().set(WIDGET_NAME, widgetName)));
            // 发送通知邮件
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
        // 通知holder
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        String widgetName = I18nField.toBean(wpk.getI18nName()).getString(defaultLang);

        // 发送通知
        List<Long> toPlayerIds = ListUtil.toList(wpk.getOwner());
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(
                NotificationTemplateId.ADMIN_TRANSFER_SPACE_WIDGET_NOTIFY,
                toPlayerIds,
                opUserId,
                spaceId,
                Dict.create().set(WIDGET_NAME, widgetName).set(INVOLVE_MEMBER_ID, ListUtil.toList(transferMember.getId()))));

        // 发送通知邮件
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

package com.vikadata.api.modular.workspace.service.impl;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vikadata.api.enums.widget.InstallEnvType;
import com.vikadata.api.enums.widget.RuntimeEnvType;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.workbench.WidgetPackageAuthType;
import com.vikadata.api.enums.workbench.WidgetPackageStatus;
import com.vikadata.api.enums.workbench.WidgetPackageType;
import com.vikadata.api.enums.workbench.WidgetReleaseStatus;
import com.vikadata.api.enums.workbench.WidgetReleaseType;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.model.dto.widget.WidgetBodyDTO;
import com.vikadata.api.model.dto.widget.WidgetBodyDTO.DataArchive;
import com.vikadata.api.model.ro.widget.WidgetAuditGlobalIdRo;
import com.vikadata.api.model.ro.widget.WidgetAuditSubmitDataRo;
import com.vikadata.api.model.ro.widget.WidgetPackageBaseRo.I18nField;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageAuthSpaceMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageReleaseMapper;
import com.vikadata.api.modular.workspace.service.IWidgetAuditService;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WidgetPackageAuthSpaceEntity;
import com.vikadata.entity.WidgetPackageEntity;
import com.vikadata.entity.WidgetPackageReleaseEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.WidgetException.AUDIT_REASON_NOT_EMPTY;
import static com.vikadata.api.enums.exception.WidgetException.AUDIT_SUBMIT_VERSION_NOT_EXIST;
import static com.vikadata.api.enums.exception.WidgetException.ISSUED_GLOBAL_ID_FAIL;
import static com.vikadata.api.enums.exception.WidgetException.WIDGET_AUTH_DATA_AUDIT_FAIL;
import static com.vikadata.api.enums.exception.WidgetException.WIDGET_VERSION_DATA_AUDIT_FAIL;

/**
 * <p>
 * 小程序申请 服务实现类
 * </p>
 * @author Pengap
 * @date 2022/3/8 16:04:32
 */
@Slf4j
@Service
public class WidgetAuditServiceImpl implements IWidgetAuditService {

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @Resource
    private WidgetPackageMapper widgetPackageMapper;

    @Resource
    private WidgetPackageReleaseMapper widgetPackageReleaseMapper;

    @Resource
    private WidgetPackageAuthSpaceMapper widgetPackageAuthSpaceMapper;

    @Resource
    private IUserService iUserService;

    @Override
    @SneakyThrows(JsonProcessingException.class)
    @Transactional(rollbackFor = Exception.class)
    public String issuedGlobalId(Long opUserId, WidgetAuditGlobalIdRo body) {
        log.info("{},发行全局ID,结果:{}", opUserId, body.getAuditResult());

        int countGlobalId = widgetPackageMapper.countByIssuedIdArchive(body.getDstId(), body.getRecordId());
        ExceptionUtil.isFalse(countGlobalId > 0, WIDGET_AUTH_DATA_AUDIT_FAIL);

        String subjectType;
        Dict dict = Dict.create();
        String issuedGlobalPackageId = null;
        if (body.getAuditResult()) {
            issuedGlobalPackageId = IdUtil.createWidgetPackageId();
            boolean packageIdIsExist = iWidgetPackageService.checkCustomPackageId(issuedGlobalPackageId);
            ExceptionUtil.isFalse(packageIdIsExist, ISSUED_GLOBAL_ID_FAIL);

            WidgetPackageType packageType = WidgetPackageType.toEnum(body.getPackageType());

            I18nField i18nName = new I18nField();
            i18nName.setZhCN(body.getAuditWidgetName());
            i18nName.setEnUS(body.getAuditWidgetName());
            I18nField i18nDescription = new I18nField();
            i18nDescription.setZhCN(StrUtil.format("{}描述", body.getAuditWidgetName()));
            i18nDescription.setEnUS(StrUtil.format("{} description", body.getAuditWidgetName()));
            WidgetBodyDTO widgetBody = new WidgetBodyDTO();
            widgetBody.setIssuedIdArchive(new DataArchive(body.getDstId(), body.getRecordId(), opUserId));

            WidgetPackageEntity saveObj = new WidgetPackageEntity()
                    .setPackageId(issuedGlobalPackageId)
                    .setI18nName(i18nName.toJson())
                    .setI18nDescription(i18nDescription.toJson())
                    .setAuthorEmail(body.getNoticeEmail())
                    .setPackageType(packageType.getValue())
                    .setReleaseType(WidgetReleaseType.GLOBAL.getValue())
                    .setWidgetBody(widgetBody.toJson())
                    .setIsEnabled(false)
                    .setStatus(WidgetPackageStatus.DEVELOP.getValue())
                    .setOwner(null)
                    .setCreatedBy(-1L)
                    .setUpdatedBy(-1L);
            WidgetPackageAuthSpaceEntity saceJoinObj = new WidgetPackageAuthSpaceEntity()
                    .setPackageId(issuedGlobalPackageId)
                    .setSpaceId("")
                    .setType(WidgetPackageAuthType.BOUND_SPACE.getValue())
                    .setCreatedBy(-1L)
                    .setUpdatedBy(-1L);
            boolean flag = iWidgetPackageService.save(saveObj) && SqlHelper.retBool(widgetPackageAuthSpaceMapper.insert(saceJoinObj));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

            subjectType = MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS;
            dict.set("GLOBAL_PACKAGE_ID", issuedGlobalPackageId);
        }
        else {
            ExceptionUtil.isNotBlank(body.getAuditRemark(), AUDIT_REASON_NOT_EMPTY);
            body.setAuditRemark(StrUtil.replace(body.getAuditRemark(), "\n", "<br/>"));

            subjectType = MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL;
            dict.set("IDENTITY_VERIFY_FAIL_REASON", body.getAuditRemark());
        }
        dict.set("YEARS", LocalDate.now().getYear());

        String lang = LanguageManager.me().getDefaultLanguageTag();
        List<String> to = Collections.singletonList(body.getNoticeEmail());
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(lang, subjectType, dict, to));
        return issuedGlobalPackageId;
    }

    @Override
    public List<WidgetStoreListInfo> waitReviewWidgetList(WidgetStoreListRo body) {
        List<WidgetStoreListInfo> widgetStoreListInfos = widgetPackageReleaseMapper.selectWaitReviewWidgetList(body);
        // 处理小程序安装、运行环境类型
        for (WidgetStoreListInfo widgetStoreListInfo : widgetStoreListInfos){
            widgetStoreListInfo.setInstallEnv(InstallEnvType.toValueList(widgetStoreListInfo.getInstallEnvCode()));
            widgetStoreListInfo.setRuntimeEnv(RuntimeEnvType.toValueList(widgetStoreListInfo.getRuntimeEnvCode()));
        }
        return widgetStoreListInfos;
    }

    @Override
    @SneakyThrows(JsonProcessingException.class)
    @Transactional(rollbackFor = Exception.class)
    public void auditSubmitData(Long opUserId, WidgetAuditSubmitDataRo body) {
        log.info("{},审核Id:{},结果:{}", opUserId, body.getGlobalPackageId(), body.getAuditResult());

        // 校验小程序ID是否有效
        WidgetPackageEntity fatherWpk = iWidgetPackageService.getByPackageId(body.getGlobalPackageId(), true);
        // 校验审核结果，防止数据重复生效
        int countAuditResult = widgetPackageMapper.countByAuditSubmitResultArchive(body.getDstId(), body.getRecordId());
        ExceptionUtil.isFalse(countAuditResult > 0, WIDGET_VERSION_DATA_AUDIT_FAIL);
        // 校验审核submit version信息
        WidgetPackageEntity submitWidgetPackage = widgetPackageMapper.selectByFatherWidgetIdAndVersion(body.getGlobalPackageId(), body.getSubmitVersion());
        ExceptionUtil.isNotNull(submitWidgetPackage, AUDIT_SUBMIT_VERSION_NOT_EXIST);
        WidgetPackageReleaseEntity submitWidgetRelease = widgetPackageReleaseMapper.selectByFatherWidgetIdAndVersion(body.getGlobalPackageId(), body.getSubmitVersion());
        ExceptionUtil.isNotNull(submitWidgetRelease, AUDIT_SUBMIT_VERSION_NOT_EXIST);

        String widgetName = Optional.ofNullable(I18nField.toBean(submitWidgetPackage.getI18nName())).map(I18nField::getZhCN).orElse("");
        String widgetVersion = submitWidgetRelease.getVersion();
        WidgetBodyDTO submitWidgetBody = WidgetBodyDTO.toBean(submitWidgetPackage.getWidgetBody());

        String subjectType;
        Dict dict = Dict.create();
        dict.set("WIDGET_NAME", widgetName);
        dict.set("WIDGET_VERSION", widgetVersion);
        if (body.getAuditResult()) {
            // 创建发布版本记录
            WidgetPackageReleaseEntity saveWpr = new WidgetPackageReleaseEntity()
                    .setPackageId(fatherWpk.getPackageId())
                    .setStatus(WidgetReleaseStatus.PASS_REVIEW.getValue());
            CopyOptions copyOptions = CopyOptions.create()
                    .setIgnoreProperties("id", "packageId", "status", "isDeleted", "createdAt", "updatedAt")
                    .ignoreError();
            BeanUtil.copyProperties(submitWidgetRelease, saveWpr, copyOptions);

            // 保存发布版本记录
            boolean flag = SqlHelper.retBool(widgetPackageReleaseMapper.insert(saveWpr));

            // 更新扩展信息（增量）
            WidgetBodyDTO fatherWpkBody = WidgetBodyDTO.toBean(fatherWpk.getWidgetBody());
            fatherWpkBody.setWebsite(submitWidgetBody.getWebsite())
                    .setTemplateCover(submitWidgetBody.getTemplateCover())
                    .setWidgetOpenSource(submitWidgetBody.getWidgetOpenSource());

            // 更新发布信息
            fatherWpk.setReleaseId(saveWpr.getId())
                    .setI18nName(submitWidgetPackage.getI18nName())
                    .setI18nDescription(submitWidgetPackage.getI18nDescription())
                    .setCover(submitWidgetPackage.getCover())
                    .setIcon(submitWidgetPackage.getIcon())
                    .setAuthorName(submitWidgetPackage.getAuthorName())
                    .setAuthorEmail(submitWidgetPackage.getAuthorEmail())
                    .setAuthorIcon(submitWidgetPackage.getAuthorIcon())
                    .setAuthorLink(submitWidgetPackage.getAuthorLink())
                    .setStatus(WidgetPackageStatus.ONLINE.getValue())
                    .setSandbox(submitWidgetPackage.getSandbox())
                    .setWidgetBody(fatherWpkBody.toJson())
                    .setIsEnabled(true)
                    .setOwner(submitWidgetPackage.getCreatedBy())
                    .setUpdatedBy(submitWidgetPackage.getUpdatedBy());
            if (fatherWpk.getCreatedBy() == -1) {
                // 只更新一次
                fatherWpk.setCreatedBy(submitWidgetPackage.getCreatedBy());
            }
            flag &= SqlHelper.retBool(widgetPackageMapper.updateById(fatherWpk));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

            subjectType = MailPropConstants.SUBJECT_WIDGET_SUBMIT_SUCCESS;
            submitWidgetRelease.setStatus(WidgetReleaseStatus.PASS_REVIEW.getValue());
        }
        else {
            ExceptionUtil.isNotBlank(body.getAuditRemark(), AUDIT_REASON_NOT_EMPTY);
            body.setAuditRemark(StrUtil.replace(body.getAuditRemark(), "\n", "<br/>"));

            subjectType = MailPropConstants.SUBJECT_WIDGET_SUBMIT_FAIL;
            dict.set("WIDGET_EVALUATE_FAIL_REASON", body.getAuditRemark());
            submitWidgetRelease.setStatus(WidgetReleaseStatus.REJECT.getValue());
        }
        dict.set("YEARS", LocalDate.now().getYear());

        // 对Submit审核记录进行存档
        submitWidgetBody.setAuditSubmitResultArchive(new DataArchive(body.getDstId(), body.getRecordId(), opUserId));
        submitWidgetPackage.setWidgetBody(submitWidgetBody.toJson());
        widgetPackageMapper.updateById(submitWidgetPackage);
        widgetPackageReleaseMapper.updateById(submitWidgetRelease);

        // 查询 Submit Owner 语言信息发送结果邮件
        UserLangDTO userLangDto = CollUtil.getFirst(iUserService.getLangAndEmailByIds(Collections.singletonList(fatherWpk.getOwner()), LanguageManager.me().getDefaultLanguageTag()));
        if (Objects.nonNull(userLangDto) && StrUtil.isNotBlank(userLangDto.getEmail())) {
            List<String> to = Collections.singletonList(userLangDto.getEmail());
            TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(userLangDto.getLocale(), subjectType, dict, to));
        }
    }

}

package com.vikadata.api.modular.labs.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.enums.labs.LabsApplicantTypeEnum;
import com.vikadata.api.enums.labs.LabsFeatureEnum;
import com.vikadata.api.enums.labs.LabsFeatureTypeEnum;
import com.vikadata.api.model.ro.labs.GmApplyFeatureRo;
import com.vikadata.api.model.vo.labs.LabsFeatureVo;
import com.vikadata.api.modular.labs.mapper.LabsApplicantMapper;
import com.vikadata.api.modular.labs.service.ILabsApplicantService;
import com.vikadata.api.modular.labs.service.ILabsFeatureService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.LabsApplicantEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.LabsFeatureException.FEATURE_TYPE_IS_NOT_EXIST;
import static com.vikadata.api.enums.labs.LabsFeatureEnum.ofLabsFeature;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.GLOBAL;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.NORMAL;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.NORMAL_PERSIST;

/**
 * <p>
 * 实验性功能申请表 服务实现类
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/21 11:00:52
 */
@Service
@Slf4j
public class LabsApplicantServiceImpl extends ServiceImpl<LabsApplicantMapper, LabsApplicantEntity> implements ILabsApplicantService {

    @Resource
    private LabsApplicantMapper labsApplicantMapper;

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @Override
    public LabsFeatureVo getUserCurrentFeatureApplicants(List<String> applicants) {
        // 加载全局开放的实验性功能
        List<String> globalApplicants = labsApplicantMapper.selectFeatureKeyByType(GLOBAL.getType());

        // 对申请者进行空值判断
        if(applicants.isEmpty()){
            return LabsFeatureVo.builder()
                    .keys(globalApplicants.stream().map(LabsFeatureEnum::ofFeatureKey).collect(Collectors.toList()))
                    .build();
        }

        // 查询用户级别、空间站级别下的所有内测申请记录
        List<String> userLabsApplicants =
                labsApplicantMapper.selectUserFeaturesByApplicant(applicants);

        // 合并去重
        globalApplicants.addAll(userLabsApplicants);
        globalApplicants = new ArrayList<>(new LinkedHashSet<>(globalApplicants));

        return LabsFeatureVo.builder()
                .keys(globalApplicants.stream().map(LabsFeatureEnum::ofFeatureKey).collect(Collectors.toList()))
                .build();
    }

    @Override
    public LabsApplicantEntity getApplicantByApplicantAndFeatureKey(String applicant, String featureKey) {
        return labsApplicantMapper.selectApplicantAndFeatureKey(applicant, featureKey);
    }

    @Override
    public void enableLabsFeature(String applicant, LabsApplicantTypeEnum applicantType, String featureKey, Long operator) {
        LabsApplicantEntity existLabsApplicant =
                labsApplicantMapper.selectApplicantAndFeatureKey(applicant, ofLabsFeature(featureKey).name());
        LabsFeatureTypeEnum currentLabsFeatureType = iLabsFeatureService.getCurrentLabsFeatureType(featureKey);
        if (Objects.isNull(existLabsApplicant)) {
            // 如果不是normal或者normal_persist类型，不允许启用实验性功能
            boolean enableUpdate = NORMAL.equals(currentLabsFeatureType) ||
                    NORMAL_PERSIST.equals(currentLabsFeatureType);
            ExceptionUtil.isTrue(enableUpdate, FEATURE_TYPE_IS_NOT_EXIST);
            // 写入记录
            labsApplicantMapper.insert(LabsApplicantEntity.builder()
                    .applicant(applicant)
                    .applicantType(applicantType.getCode())
                    .featureKey(ofLabsFeature(featureKey).name())
                    .createdBy(operator)
                    .build());
        }
    }

    @Override
    public void disableLabsFeature(String applicant, String featureKey) {
        LabsApplicantEntity existLabsApplicant =
                labsApplicantMapper.selectApplicantAndFeatureKey(applicant, ofLabsFeature(featureKey).name());
        if (Objects.isNull(existLabsApplicant)) {
            return;
        }
        labsApplicantMapper.deleteById(existLabsApplicant.getId());
    }

    @Override
    public void sendNotification(NotificationTemplateId templateId, List<Long> toUserId, Long applyUser, GmApplyFeatureRo applyFeatureRo) {
        LabsFeatureEnum featureEnum = ofLabsFeature(applyFeatureRo.getFeatureKey());
        String toastUrl = featureEnum.getToastUrl();
        NotificationManager.me().playerNotify(
                templateId,
                toUserId,
                applyUser,
                applyFeatureRo.getSpaceId(),
                Dict.create()
                        .set("toast", Dict.create().set("url", StrUtil.isNotBlank(toastUrl) ? toastUrl : null))
                        .set("featureKey", featureEnum.getFeatureName())
        );
    }

    @Override
    public void openApplicantFeature(Long id) {
        labsApplicantMapper.updateIsDeletedById(id, false);
    }

}

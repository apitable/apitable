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

package com.apitable.space.service.impl;

import com.apitable.core.util.ExceptionUtil;
import com.apitable.space.entity.LabsApplicantEntity;
import com.apitable.space.enums.LabsApplicantTypeEnum;
import com.apitable.space.enums.LabsFeatureEnum;
import com.apitable.space.enums.LabsFeatureException;
import com.apitable.space.enums.LabsFeatureTypeEnum;
import com.apitable.space.mapper.LabsApplicantMapper;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.space.service.ILabsFeatureService;
import com.apitable.space.vo.LabsFeatureVo;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Service implementation class of experimental function application form.
 * </p>
 */
@Service
@Slf4j
public class LabsApplicantServiceImpl extends ServiceImpl<LabsApplicantMapper, LabsApplicantEntity>
    implements ILabsApplicantService {

    @Resource
    private LabsApplicantMapper labsApplicantMapper;

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @Override
    public LabsFeatureVo getUserCurrentFeatureApplicants(List<String> applicants) {
        // Load experimental functions that are open globally
        List<String> globalApplicants =
            labsApplicantMapper.selectFeatureKeyByType(LabsFeatureTypeEnum.GLOBAL.getType());

        // Judge the applicant as null
        if (applicants.isEmpty()) {
            return LabsFeatureVo.builder()
                .keys(globalApplicants.stream().map(LabsFeatureEnum::ofFeatureKey)
                    .collect(Collectors.toList()))
                .build();
        }

        // Query all internal test application records at user level and space level
        List<String> userLabsApplicants =
            labsApplicantMapper.selectUserFeaturesByApplicant(applicants);

        // Merge and de duplication
        globalApplicants.addAll(userLabsApplicants);
        globalApplicants = new ArrayList<>(new LinkedHashSet<>(globalApplicants));

        return LabsFeatureVo.builder()
            .keys(globalApplicants.stream().map(LabsFeatureEnum::ofFeatureKey)
                .collect(Collectors.toList()))
            .build();
    }

    @Override
    public LabsApplicantEntity getApplicantByApplicantAndFeatureKey(String applicant,
                                                                    String featureKey) {
        return labsApplicantMapper.selectApplicantAndFeatureKey(applicant, featureKey);
    }

    @Override
    public void enableLabsFeature(String applicant, LabsApplicantTypeEnum applicantType,
                                  String featureKey, Long operator) {
        LabsApplicantEntity existLabsApplicant =
            labsApplicantMapper.selectApplicantAndFeatureKey(applicant,
                LabsFeatureEnum.ofLabsFeature(featureKey).name());
        LabsFeatureTypeEnum currentLabsFeatureType =
            iLabsFeatureService.getCurrentLabsFeatureType(featureKey);
        if (Objects.isNull(existLabsApplicant)) {
            // If it is not of normal or normal persistent type, it is not allowed to enable experimental functions
            boolean enableUpdate = LabsFeatureTypeEnum.NORMAL.equals(currentLabsFeatureType)
                || LabsFeatureTypeEnum.NORMAL_PERSIST.equals(currentLabsFeatureType);
            ExceptionUtil.isTrue(enableUpdate, LabsFeatureException.FEATURE_TYPE_IS_NOT_EXIST);
            // Write Record
            labsApplicantMapper.insert(LabsApplicantEntity.builder()
                .applicant(applicant)
                .applicantType(applicantType.getCode())
                .featureKey(LabsFeatureEnum.ofLabsFeature(featureKey).name())
                .createdBy(operator)
                .build());
        }
    }

    @Override
    public void disableLabsFeature(String applicant, String featureKey) {
        LabsApplicantEntity existLabsApplicant =
            labsApplicantMapper.selectApplicantAndFeatureKey(applicant,
                LabsFeatureEnum.ofLabsFeature(featureKey).name());
        if (Objects.isNull(existLabsApplicant)) {
            return;
        }
        labsApplicantMapper.deleteById(existLabsApplicant.getId());
    }

}

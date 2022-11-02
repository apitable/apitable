package com.vikadata.api.modular.labs.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.labs.LabsFeatureEnum;
import com.vikadata.api.model.ro.labs.GmLabsFeatureCreatorRo;
import com.vikadata.core.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.labs.LabsFeatureScopeEnum;
import com.vikadata.api.enums.labs.LabsFeatureTypeEnum;
import com.vikadata.api.model.vo.labs.FeatureVo;
import com.vikadata.api.model.vo.labs.UserSpaceLabsFeatureVo;
import com.vikadata.api.modular.labs.mapper.LabsFeatureMapper;
import com.vikadata.api.modular.labs.service.ILabsFeatureService;
import com.vikadata.entity.LabsFeaturesEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.LabsFeatureException.*;
import static com.vikadata.api.enums.labs.LabsFeatureEnum.*;
import static com.vikadata.api.enums.labs.LabsFeatureScopeEnum.UNKNOWN_SCOPE;
import static com.vikadata.api.enums.labs.LabsFeatureScopeEnum.ofLabsFeatureScope;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.NORMAL;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.NORMAL_PERSIST;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.REVIEW;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.UNKNOWN_LABS_FEATURE_TYPE;
import static com.vikadata.api.enums.labs.LabsFeatureTypeEnum.ofLabsFeatureType;
import static java.util.stream.Collectors.groupingBy;

/**
 * <p>
 * Experimental Menu Service Implementation Class
 * </p>
 */
@Service
@Slf4j
public class LabsFeatureServiceImpl extends ServiceImpl<LabsFeatureMapper, LabsFeaturesEntity> implements ILabsFeatureService {

    @Resource
    private LabsFeatureMapper labsFeatureMapper;

    @Override
    public List<LabsFeaturesEntity> getAvailableLabFeatures() {
        List<Integer> featureTypes = Arrays.asList(REVIEW.getType(), NORMAL.getType(), NORMAL_PERSIST.getType());
        List<LabsFeaturesEntity> availableLabFeatures =
            labsFeatureMapper.selectAllFeaturesByType(featureTypes);
        return availableLabFeatures.stream()
            .filter(labFeature -> Boolean.FALSE.equals(labFeature.getIsDeleted()))
            .collect(Collectors.toList());
    }

    @Override
    public LabsFeaturesEntity getExistLabsFeature(String featureKey) {
        return labsFeatureMapper.selectByFeatureKey(featureKey);
    }

    @Override
    public LabsFeaturesEntity getCurrentLabsFeature(String featureKey, String featureScope) {
        LabsFeatureScopeEnum scope = LabsFeatureScopeEnum.ofLabsFeatureScope(featureScope);
        return labsFeatureMapper.selectByFeatureKeyAndFeatureScope(featureKey, scope.getScopeCode());
    }

    @Override
    public UserSpaceLabsFeatureVo getAvailableLabsFeature() {
        List<LabsFeaturesEntity> availableLabFeatures = this.getAvailableLabFeatures();
        UserSpaceLabsFeatureVo userSpaceLabsFeatureVo = new UserSpaceLabsFeatureVo();
        Map<Integer, List<LabsFeaturesEntity>> groupLabsFeaturesMap = availableLabFeatures.stream()
            .collect(groupingBy(LabsFeaturesEntity::getFeatureScope));
        Map<String, List<FeatureVo>> featureMap = new HashMap<>();
        groupLabsFeaturesMap.forEach((scopeCode, labsFeatures) -> {
            List<FeatureVo> featureVos = new ArrayList<>();
            for (LabsFeaturesEntity feature : labsFeatures) {
                featureVos.add(FeatureVo.builder()
                    .key(ofFeatureKey(feature.getFeatureKey()))
                    .type(ofLabsFeatureType(feature.getType()).getFeatureKey())
                    .url(feature.getUrl())
                    .open(!feature.getIsDeleted())
                    .build());
            }
            featureMap.put(ofLabsFeatureScope(scopeCode).getScopeName(), featureVos);
            userSpaceLabsFeatureVo.setFeatures(featureMap);
        });
        return userSpaceLabsFeatureVo;
    }

    @Override
    public LabsFeatureTypeEnum getCurrentLabsFeatureType(String featureKey) {
        LabsFeaturesEntity currentLabsFeature = labsFeatureMapper.selectByFeatureKey(ofLabsFeature(featureKey).name());
        if (Objects.isNull(currentLabsFeature)) {
            return UNKNOWN_LABS_FEATURE_TYPE;
        }
        return ofLabsFeatureType(currentLabsFeature.getType());
    }

    @Override
    public int deleteLabsFeature(Long id) {
        return labsFeatureMapper.deleteById(id);
    }

    @Override
    public void updateLabsFeatureAttribute(GmLabsFeatureCreatorRo ro) {
        // Unique identification of verification experimental function
        LabsFeatureEnum featureEnum = ofLabsFeature(ro.getKey());
        ExceptionUtil.isFalse(Objects.equals(featureEnum, UNKNOWN_LAB_FEATURE), FEATURE_KEY_IS_NOT_EXIST);
        // Check the number of modified values of attributes
        ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getScope()) || StrUtil.isNotBlank(ro.getType()) || StrUtil.isNotBlank(ro.getUrl()), FEATURE_ATTRIBUTE_AT_LEAST_ONE);
        if (StrUtil.isNotBlank(ro.getScope())) {
            // Verify the scope of experimental functions
            LabsFeatureScopeEnum scopeEnum = ofLabsFeatureScope(ro.getScope());
            ExceptionUtil.isFalse(Objects.equals(scopeEnum, UNKNOWN_SCOPE), FEATURE_SCOPE_IS_NOT_EXIST);
        }
        if (StrUtil.isNotBlank(ro.getType())) {
            // Verify experimental function type
            LabsFeatureTypeEnum labsFeatureTypeEnum = ofLabsFeatureType(ro.getType());
            ExceptionUtil.isFalse(Objects.equals(labsFeatureTypeEnum, UNKNOWN_LABS_FEATURE_TYPE), FEATURE_TYPE_IS_NOT_EXIST);
        }
        // Modify laboratory function properties
        Long featureId = labsFeatureMapper.selectIdByFeatureKey(ro.getKey());
        ExceptionUtil.isNotNull(featureId, FEATURE_KEY_IS_NOT_EXIST);
        LabsFeaturesEntity labsFeaturesEntity = new LabsFeaturesEntity();
        labsFeaturesEntity.setId(featureId);
        labsFeaturesEntity.setFeatureScope(Integer.valueOf(ro.getScope()));
        labsFeaturesEntity.setType(Integer.valueOf(ro.getType()));
        labsFeaturesEntity.setUrl(ro.getUrl());
        boolean flag = this.updateById(labsFeaturesEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }
}

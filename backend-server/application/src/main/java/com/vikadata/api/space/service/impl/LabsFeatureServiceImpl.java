package com.vikadata.api.space.service.impl;

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

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.space.enums.LabsFeatureEnum;
import com.vikadata.api.space.enums.LabsFeatureException;
import com.vikadata.api.space.enums.LabsFeatureScopeEnum;
import com.vikadata.api.space.enums.LabsFeatureTypeEnum;
import com.vikadata.api.space.mapper.LabsFeatureMapper;
import com.vikadata.api.space.service.ILabsFeatureService;
import com.vikadata.api.space.vo.FeatureVo;
import com.vikadata.api.space.vo.UserSpaceLabsFeatureVo;
import com.vikadata.api.enterprise.gm.ro.GmLabsFeatureCreatorRo;
import com.vikadata.core.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.entity.LabsFeaturesEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.space.enums.LabsFeatureScopeEnum.ofLabsFeatureScope;
import static com.vikadata.api.space.enums.LabsFeatureTypeEnum.ofLabsFeatureType;
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
        List<Integer> featureTypes = Arrays.asList(LabsFeatureTypeEnum.REVIEW.getType(), LabsFeatureTypeEnum.NORMAL.getType(), LabsFeatureTypeEnum.NORMAL_PERSIST.getType());
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
                    .key(LabsFeatureEnum.ofFeatureKey(feature.getFeatureKey()))
                    .type(LabsFeatureTypeEnum.ofLabsFeatureType(feature.getType()).getFeatureKey())
                    .url(feature.getUrl())
                    .open(!feature.getIsDeleted())
                    .build());
            }
            featureMap.put(LabsFeatureScopeEnum.ofLabsFeatureScope(scopeCode).getScopeName(), featureVos);
            userSpaceLabsFeatureVo.setFeatures(featureMap);
        });
        return userSpaceLabsFeatureVo;
    }

    @Override
    public LabsFeatureTypeEnum getCurrentLabsFeatureType(String featureKey) {
        LabsFeaturesEntity currentLabsFeature = labsFeatureMapper.selectByFeatureKey(LabsFeatureEnum.ofLabsFeature(featureKey).name());
        if (Objects.isNull(currentLabsFeature)) {
            return LabsFeatureTypeEnum.UNKNOWN_LABS_FEATURE_TYPE;
        }
        return LabsFeatureTypeEnum.ofLabsFeatureType(currentLabsFeature.getType());
    }

    @Override
    public int deleteLabsFeature(Long id) {
        return labsFeatureMapper.deleteById(id);
    }

    @Override
    public void updateLabsFeatureAttribute(GmLabsFeatureCreatorRo ro) {
        // Unique identification of verification experimental function
        LabsFeatureEnum featureEnum = LabsFeatureEnum.ofLabsFeature(ro.getKey());
        ExceptionUtil.isFalse(Objects.equals(featureEnum, LabsFeatureEnum.UNKNOWN_LAB_FEATURE), LabsFeatureException.FEATURE_KEY_IS_NOT_EXIST);
        // Check the number of modified values of attributes
        ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getScope()) || StrUtil.isNotBlank(ro.getType()) || StrUtil.isNotBlank(ro.getUrl()), LabsFeatureException.FEATURE_ATTRIBUTE_AT_LEAST_ONE);
        if (StrUtil.isNotBlank(ro.getScope())) {
            // Verify the scope of experimental functions
            LabsFeatureScopeEnum scopeEnum = LabsFeatureScopeEnum.ofLabsFeatureScope(ro.getScope());
            ExceptionUtil.isFalse(Objects.equals(scopeEnum, LabsFeatureScopeEnum.UNKNOWN_SCOPE), LabsFeatureException.FEATURE_SCOPE_IS_NOT_EXIST);
        }
        if (StrUtil.isNotBlank(ro.getType())) {
            // Verify experimental function type
            LabsFeatureTypeEnum labsFeatureTypeEnum = LabsFeatureTypeEnum.ofLabsFeatureType(ro.getType());
            ExceptionUtil.isFalse(Objects.equals(labsFeatureTypeEnum, LabsFeatureTypeEnum.UNKNOWN_LABS_FEATURE_TYPE), LabsFeatureException.FEATURE_TYPE_IS_NOT_EXIST);
        }
        // Modify laboratory function properties
        Long featureId = labsFeatureMapper.selectIdByFeatureKey(ro.getKey());
        ExceptionUtil.isNotNull(featureId, LabsFeatureException.FEATURE_KEY_IS_NOT_EXIST);
        LabsFeaturesEntity labsFeaturesEntity = new LabsFeaturesEntity();
        labsFeaturesEntity.setId(featureId);
        labsFeaturesEntity.setFeatureScope(Integer.valueOf(ro.getScope()));
        labsFeaturesEntity.setType(Integer.valueOf(ro.getType()));
        labsFeaturesEntity.setUrl(ro.getUrl());
        boolean flag = this.updateById(labsFeaturesEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }
}

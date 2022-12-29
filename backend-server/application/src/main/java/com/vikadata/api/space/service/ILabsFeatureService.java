package com.vikadata.api.space.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.space.enums.LabsFeatureTypeEnum;
import com.vikadata.api.space.vo.UserSpaceLabsFeatureVo;
import com.vikadata.entity.LabsFeaturesEntity;

public interface ILabsFeatureService extends IService<LabsFeaturesEntity> {

    /**
     * Get all laboratory functions that can operate normally
     *
     * @return LabsFeaturesEntity List
     * */
    List<LabsFeaturesEntity> getAvailableLabFeatures();

    /**
     * get row id by feature key
     * @param featureKey lab feature key
     * @return id
     */
    Long getIdByFeatureKey(String featureKey);

    /**
     * Get the list of experimental functions enabled and disabled by the user and the space station
     *
     * @return UserSpaceLabsFeatureVo
     * */
    UserSpaceLabsFeatureVo getAvailableLabsFeature();

    /**
     * Get the current laboratory function category
     *
     * @param featureKey Unique identification of laboratory function
     * @return LabsFeatureTypeEnum
     * */
    LabsFeatureTypeEnum getCurrentLabsFeatureType(String featureKey);
}

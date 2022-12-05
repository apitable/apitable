package com.vikadata.api.space.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enterprise.gm.ro.GmLabsFeatureCreatorRo;
import com.vikadata.api.space.vo.UserSpaceLabsFeatureVo;
import com.vikadata.api.space.enums.LabsFeatureTypeEnum;
import com.vikadata.entity.LabsFeaturesEntity;

public interface ILabsFeatureService extends IService<LabsFeaturesEntity> {

    /**
     * Get all laboratory functions that can operate normally
     *
     * @return LabsFeaturesEntity List
     * */
    List<LabsFeaturesEntity> getAvailableLabFeatures();

    /**
     * Get existing lab functions
     *
     * @param featureKey Unique identification of laboratory function
     * @return LabsFeaturesEntity
     * */
    LabsFeaturesEntity getExistLabsFeature(String featureKey);

    /**
     * Get experimental functions of specified function scope
     *
     * @param featureKey Unique identification of experimental function
     * @param featureScope Scope of laboratory functions
     * @return LabsFeaturesEntity
     * */
    LabsFeaturesEntity getCurrentLabsFeature(String featureKey, String featureScope);

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

    /**
     * Delete the specified experimental function
     *
     * @param id Lab Function ID
     * @return Affected result sets
     * */
    int deleteLabsFeature(Long id);

    /**
     * Modify laboratory function properties
     * */
    void updateLabsFeatureAttribute(GmLabsFeatureCreatorRo ro);
}

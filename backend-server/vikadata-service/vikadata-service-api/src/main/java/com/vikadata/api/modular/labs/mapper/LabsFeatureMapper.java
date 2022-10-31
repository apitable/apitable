package com.vikadata.api.modular.labs.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.LabsFeaturesEntity;

/**
 * <p>
 * Experimental menu Mapper interface
 * </p>
 */
public interface LabsFeatureMapper extends BaseMapper<LabsFeaturesEntity> {

    /**
     * Query all experimental functions according to feature keys
     *
     * @param featureKeys List of laboratory function identification
     * @return LabsFeaturesEntity List
     * */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllByFeatureKeys(@Param("featureKeys") List<String> featureKeys);

    /**
     * Query all experimental functions according to the laboratory function category
     *
     * @param types List of laboratory function categories
     * @return LabsFeaturesEntity List
     * */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllFeaturesByType(@Param("types") List<Integer> types);

    /**
     * Query ID according to the unique ID of the laboratory function
     * @param featureKey Laboratory function identification
     * @return id
     * */
    @InterceptorIgnore(illegalSql = "true")
    Long selectIdByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * Query laboratory functions according to a single feature Hey
     *
     * @param featureKey Laboratory function identification
     * @return LabsFeaturesEntity
     * */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * Query laboratory functions according to function ID and function scope
     *
     * @param featureKey Unique identification of laboratory function
     * @param featureScope Lab Functional Scope
     * @return LabsFeaturesEntity
     * */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKeyAndFeatureScope(@Param("featureKey") String featureKey, @Param("featureScope") Integer featureScope);

}

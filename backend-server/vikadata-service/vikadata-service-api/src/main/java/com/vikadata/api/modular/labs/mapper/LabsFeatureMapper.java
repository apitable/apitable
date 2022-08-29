package com.vikadata.api.modular.labs.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.LabsFeaturesEntity;

/**
 * <p>
 * 实验性功能表 Mapper 接口
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/20 20:30:18
 */
public interface LabsFeatureMapper extends BaseMapper<LabsFeaturesEntity> {

    /**
     * 根据featureKeys查询所有实验性功能
     *
     * @param featureKeys 实验室功能标识列表
     * @return LabsFeaturesEntity List
     * */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllByFeatureKeys(@Param("featureKeys") List<String> featureKeys);

    /**
     * 根据实验室功能类别查询所有实验性功能
     *
     * @param types 实验室功能类别列表
     * @return LabsFeaturesEntity List
     * */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllFeaturesByType(@Param("types") List<Integer> types);

    /**
     * 根据实验室功能唯一标识查询ID
     * @param featureKey 实验室功能标识
     * @return id
     * */
    @InterceptorIgnore(illegalSql = "true")
    Long selectIdByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * 根据单个featureHey查询实验室功能
     *
     * @param featureKey 实验室功能标识
     * @return LabsFeaturesEntity
     * */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * 根据功能标识和功能作用域查询实验室功能
     *
     * @param featureKey 实验室功能唯一标识
     * @param featureScope 实验室功能作用域
     * @return LabsFeaturesEntity
     * */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKeyAndFeatureScope(@Param("featureKey") String featureKey, @Param("featureScope") Integer featureScope);

}

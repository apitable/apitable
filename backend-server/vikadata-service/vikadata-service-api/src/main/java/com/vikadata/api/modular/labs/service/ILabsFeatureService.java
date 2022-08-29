package com.vikadata.api.modular.labs.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.api.enums.labs.LabsFeatureTypeEnum;
import com.vikadata.api.model.ro.labs.GmLabsFeatureCreatorRo;
import com.vikadata.api.model.vo.labs.UserSpaceLabsFeatureVo;
import com.vikadata.entity.LabsFeaturesEntity;

import java.util.List;

public interface ILabsFeatureService extends IService<LabsFeaturesEntity> {

    /**
     * 获取所有可正常操作的实验室功能
     *
     * @return LabsFeaturesEntity List
     * */
    List<LabsFeaturesEntity> getAvailableLabFeatures();

    /**
     * 获取已存在的实验室功能
     *
     * @param featureKey 实验室功能唯一标识
     * @return LabsFeaturesEntity
     * */
    LabsFeaturesEntity getExistLabsFeature(String featureKey);

    /**
     * 获取指定功能作用域的实验性功能
     *
     * @param featureKey 实验性功能唯一标识
     * @param featureScope 实验室功能的作用域
     * @return LabsFeaturesEntity
     * */
    LabsFeaturesEntity getCurrentLabsFeature(String featureKey, String featureScope);

    /**
     * 获取用户以及所在空间站启用关闭的实验性功能列表
     *
     * @return UserSpaceLabsFeatureVo
     * */
    UserSpaceLabsFeatureVo getAvailableLabsFeature();

    /**
     * 获取当前实验室功能类别
     *
     * @param featureKey 实验室功能唯一标识
     * @return LabsFeatureTypeEnum
     * */
    LabsFeatureTypeEnum getCurrentLabsFeatureType(String featureKey);

    /**
     * 删除指定的实验性功能
     *
     * @param id 实验室功能ID
     * @return 受影响的结果集
     * */
    int deleteLabsFeature(Long id);

    /**
     * 修改实验室功能属性
     * */
    void updateLabsFeatureAttribute(GmLabsFeatureCreatorRo ro);
}

package com.vikadata.api.modular.labs.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.LabsApplicantEntity;

/**
 * <p>
 * 实验室功能申请表 Mapper 接口
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @since 2021/10/20 20:25:45
 */
public interface LabsApplicantMapper extends BaseMapper<LabsApplicantEntity> {

    /**
     * 根据userId和spaceId查询其实验性功能
     *
     * @param applicants 申请者ID，为userId和spaceId
     * @return featureKey List
     * */
    List<String> selectUserFeaturesByApplicant(@Param("applicants") List<String> applicants);

    /**
     * 根据实验室功能的类型查询实验室功能唯一标识符
     *
     * @param type 实验室功能的类型
     * @return featureKey 实验室功能唯一标识符
     */
    List<String> selectFeatureKeyByType(@Param("type") Integer type);

    /**
     * 根据applicant和featureKey查询指定的申请记录
     *
     * @param applicant 申请者ID，可以是userId或者spaceId
     * @param featureKey 实验性功能标识
     * @return LabsApplicantEntity
     * */
    LabsApplicantEntity selectApplicantAndFeatureKey(@Param("applicant") String applicant, @Param("featureKey") String featureKey);

    /**
     * 软删除实验性功能申请记录
     *
     * @param id 实验性功能申请表的id
     * @param isDeleted 是否删除记录
     * @return 受影响的记录行数
     * */
    int updateIsDeletedById(@Param("id") Long id, @Param("isDeleted") Boolean isDeleted);
}

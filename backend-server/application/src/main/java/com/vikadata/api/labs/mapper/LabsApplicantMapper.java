package com.vikadata.api.labs.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.LabsApplicantEntity;

/**
 * <p>
 * Laboratory Function Application Form Mapper Interface
 * </p>
 */
public interface LabsApplicantMapper extends BaseMapper<LabsApplicantEntity> {

    /**
     * Query its experimental functions according to user ID and space ID
     *
     * @param applicants Applicant ID: user ID and space ID
     * @return featureKey List
     * */
    List<String> selectUserFeaturesByApplicant(@Param("applicants") List<String> applicants);

    /**
     * Query the unique identifier of a laboratory function according to its type
     *
     * @param type Types of laboratory functions
     * @return featureKey Laboratory function unique identifier
     */
    List<String> selectFeatureKeyByType(@Param("type") Integer type);

    /**
     * Query the specified application record according to the application and feature key
     *
     * @param applicant Applicant ID, which can be user ID or space ID
     * @param featureKey Experimental function identification
     * @return LabsApplicantEntity
     * */
    LabsApplicantEntity selectApplicantAndFeatureKey(@Param("applicant") String applicant, @Param("featureKey") String featureKey);

    /**
     * Soft deletion of experimental function application record
     *
     * @param id ID of the experimental function application form
     * @param isDeleted Delete Record
     * @return Number of affected record lines
     * */
    int updateIsDeletedById(@Param("id") Long id, @Param("isDeleted") Boolean isDeleted);
}

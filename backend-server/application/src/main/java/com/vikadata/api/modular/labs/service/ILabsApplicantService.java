package com.vikadata.api.modular.labs.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.enums.labs.LabsApplicantTypeEnum;
import com.vikadata.api.model.ro.labs.GmApplyFeatureRo;
import com.vikadata.api.model.vo.labs.LabsFeatureVo;
import com.vikadata.entity.LabsApplicantEntity;

/**
 * <p>
 * Service class of experimental function application form
 * </p>
 */
public interface ILabsApplicantService extends IService<LabsApplicantEntity> {

    /**
     * Query the laboratory functions of the current user and the empty room station according to the user ID and space ID
     *
     * @param applicants Applicant I Ds, which are user Id or space Id
     * @return LabsApplicantEntity List
     * */
    LabsFeatureVo getUserCurrentFeatureApplicants(List<String> applicants);

    /**
     * Get the specified experimental functions enabled by the applicant or the space station where the user resides
     *
     * @param applicant The unique identifier of the applicant, which can be space ID or user ID
     * @param featureKey Name of experimental function
     * @return LabsApplicantEntity
     * */
    LabsApplicantEntity getApplicantByApplicantAndFeatureKey(String applicant, String featureKey);

    /**
     * Enable the designated experimental internal test function for the user's space
     *
     * @param applicant User ID or space ID
     * @param featureKey Unique identification of experimental function to be opened
     * */
    void enableLabsFeature(String applicant, LabsApplicantTypeEnum applicantType, String featureKey, Long operator);

    /**
     * Turn off the designated experimental internal test function for the user's space
     *
     * @param applicant User ID or space ID
     * @param featureKey Unique identification of experimental function to be closed
     * */
    void disableLabsFeature(String applicant, String featureKey);

    /**
     * Send in station notifications
     *
     * @param templateId Notification template ID
     * @param applyUser Applicant user id, the uuid of the front end
     * @param applyFeatureRo Request object for laboratory function
     * */
    void sendNotification(NotificationTemplateId templateId, List<Long> toUserId, Long applyUser, GmApplyFeatureRo applyFeatureRo);

    /**
     * Enable the function of internal test application laboratory
     *
     * @param id Primary key ID
     * */
    void openApplicantFeature(Long id);
}

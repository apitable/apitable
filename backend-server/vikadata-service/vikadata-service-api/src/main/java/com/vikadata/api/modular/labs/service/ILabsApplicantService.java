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
 * 实验性功能申请表 服务类
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @since 2021/10/21 10:17:23
 */
public interface ILabsApplicantService extends IService<LabsApplicantEntity> {

    /**
     * 根据userId和spaceId查询当前用户以及空房间站的实验室功能
     *
     * @param applicants 申请者IDs，为userId或者spaceId
     * @return LabsApplicantEntity List
     * */
    LabsFeatureVo getUserCurrentFeatureApplicants(List<String> applicants);

    /**
     * 获取申请用户或者用户所在空间站中启用的指定实验性功能
     *
     * @param applicant 申请者唯一标识，可以是spaceId或者userId
     * @param featureKey 实验性功能名称
     * @return LabsApplicantEntity
     * */
    LabsApplicantEntity getApplicantByApplicantAndFeatureKey(String applicant, String featureKey);

    /**
     * 为用户/所在空间站开启指定实验性内测功能
     *
     * @param applicant 用户ID或者空间站ID
     * @param featureKey 待开启实验性功能唯一标识
     * */
    void enableLabsFeature(String applicant, LabsApplicantTypeEnum applicantType, String featureKey, Long operator);

    /**
     * 为用户/所在空间站关闭指定实验性内测功能
     *
     * @param applicant 用户ID或者空间站ID
     * @param featureKey 待关闭实验性功能唯一标识
     * */
    void disableLabsFeature(String applicant, String featureKey);

    /**
     * 发送站内通知
     *
     * @param templateId 通知模板ID
     * @param applyUser 申请者user_id，前端的uuid
     * @param applyFeatureRo 申请实验室功能请求对象
     * */
    void sendNotification(NotificationTemplateId templateId, List<Long> toUserId, Long applyUser, GmApplyFeatureRo applyFeatureRo);

    /**
     * 开启内测申请实验室功能
     *
     * @param id 主键ID
     * */
    void openApplicantFeature(Long id);
}

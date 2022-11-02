package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitDelayEntity;

/**
 * <p>
 * WeCom service provider interface permission delay task processing information
 * </p>
 */
public interface ISocialWecomPermitDelayService extends IService<SocialWecomPermitDelayEntity> {

    /**
     * Add Delay processing information
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param firstAuthTime Time of first installation authorization
     * @param delayType Delay processing type
     * @param processStatus Processing status
     * @return New Delay processing information. If it is blank, it means there is no addition and it will be handed over to the existing task for processing
     */
    SocialWecomPermitDelayEntity addAuthCorp(String suiteId, String authCorpId, LocalDateTime firstAuthTime,
            Integer delayType, Integer processStatus);

    /**
     * Get the delay processing information of the enterprise
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param delayType Delay processing type
     * @param processStatuses Processing status
     * @return Delay processing information
     */
    List<SocialWecomPermitDelayEntity> getByProcessStatuses(String suiteId, String authCorpId, Integer delayType, List<Integer> processStatuses);

    /**
     * Get the delay processing information of the enterprise
     *
     * @param suiteId Application Suit ID
     * @param processStatus Processing status
     * @param limit Data Offset
     * @param skip Quantity returned
     * @return Delay processing information
     */
    List<SocialWecomPermitDelayEntity> getBySuiteIdAndProcessStatus(String suiteId, Integer processStatus, Integer skip, Integer limit);

    /**
     * Batch processing of pending data
     *
     * @param suiteId Application Suit ID
     */
    void batchProcessPending(String suiteId);

}

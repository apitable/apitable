package com.vikadata.api.enterprise.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.enterprise.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.entity.SocialCpIsvMessageEntity;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application authorization notification information record
 * </p>
 */
public interface ISocialCpIsvMessageService extends IService<SocialCpIsvMessageEntity> {

    /**
     * Get unprocessed message notifications in batches
     *
     * @param size Quantity obtained in batch
     * @return List of unprocessed message notifications
     */
    List<SocialCpIsvMessageEntity> getUnprocessedList(int size);

    /**
     * Perform relevant operations on the message notifications that have not been processed
     *
     * @param unprocessedInfo Message notifications to process
     * @throws WxErrorException WeCom Interface exception
     */
    void doUnprocessedInfo(SocialCpIsvMessageEntity unprocessedInfo) throws WxErrorException;

    /**
     * Send unprocessed message notifications to MQ
     *
     * @param unprocessedId Unhandled messages ID
     * @param infoType Message Type
     * @param authCorpId Authorized enterprises ID
     */
    void sendToMq(Long unprocessedId, String infoType, String authCorpId, String suiteId);

    /**
     * update status by id
     * @param id primary key
     * @param status status
     */
    void updateStatusById(Long id, SocialCpIsvMessageProcessStatus status);

}

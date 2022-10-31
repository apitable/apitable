package com.vikadata.social.service.dingtalk.service;

/**
 * internal service call interface
 */
public interface IInternalService {
    /**
     * Push the message pushed by syncHttp to the internal service
     *
     * @param suiteId suiteId
     * @param signature signature
     * @param timestamp timestamp
     * @param nonce nonce
     * @param encrypt encrypt
     */
    void pushDingTalkSyncAction(String suiteId, String signature, String timestamp, String nonce, String encrypt);
}

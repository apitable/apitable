package com.vikadata.social.service.dingtalk.service;

/**
 * <p> 
 * 内部服务调用接口 
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/8 6:52 下午
 */
public interface IInternalService {
    /**
     * 推送syncHttp 推送的消息给内部服务
     *
     * @param suiteId 套件id
     * @param signature 签名
     * @param timestamp 时间戳
     * @param nonce 随机字符串
     * @param encrypt 加密数据
     * @author zoe zheng
     * @date 2021/9/8 6:56 下午
     */
    void pushDingTalkSyncAction(String suiteId, String signature, String timestamp, String nonce, String encrypt);
}

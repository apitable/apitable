package com.vikadata.social.dingtalk.api;


import com.vikadata.social.dingtalk.MessageReceiver;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p> 
 * 企业内部应用接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/19 3:31 下午
 */
public interface CorpAppOperations {
    /**
     * 获取企业内部应用的access_token
     *
     * @param forceRefresh 强制刷新
     * @return String
     * @author zoe zheng
     * @date 2021/4/20 6:37 下午
     */
    String getAccessToken(boolean forceRefresh);

    /**
     * 通过免登码获取用户信息(v2)
     *
     * @param code 免登授权码
     * @return UserInfoV2
     * @author zoe zheng
     * @date 2021/4/20 6:56 下午
     */
    UserInfoV2 getUserInfoByCode(String code);

    /**
     * 根据userid获取用户详情
     *
     * @param userId 员工唯一标识userid。
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/4/20 7:11 下午
     */
    DingTalkUserDetail getUserInfoByUserId(String userId);

    /**
     * 企业内部应用发送群消息
     *
     * @param receiver 消息接收者
     * @param message 发送的消息
     * @return 消息ID
     * @author zoe zheng
     * @date 2021/4/23 2:18 下午
     */
    String sendChatMessage(MessageReceiver receiver, Message message);

}

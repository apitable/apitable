package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.entity.SocialCpIsvMessageEntity;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用授权通知信息记录
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 17:00:30
 */
public interface ISocialCpIsvMessageService extends IService<SocialCpIsvMessageEntity> {

    /**
     * 批量获取未处理的消息通知
     *
     * @param size 批量获取的数量
     * @return 未处理的消息通知列表
     * @author 刘斌华
     * @date 2022-01-05 17:45:33
     */
    List<SocialCpIsvMessageEntity> getUnprocessedList(int size);

    /**
     * 对还未处理的消息通知进行相关操作
     *
     * @param unprocessedInfo 要处理的消息通知
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-06 11:41:42
     */
    void doUnprocessedInfo(SocialCpIsvMessageEntity unprocessedInfo) throws WxErrorException;

    /**
     * 将未处理的消息通知发送到 MQ
     *
     * @param unprocessedId 未处理的消息 ID
     * @param infoType 消息类型
     * @param authCorpId 授权的企业 ID
     * @author 刘斌华
     * @date 2022-02-24 15:13:43
     */
    void sendToMq(Long unprocessedId, String infoType, String authCorpId, String suiteId);

    /**
     * update status by id
     * @param id primary key
     * @param status status
     */
    void updateStatusById(Long id, SocialCpIsvMessageProcessStatus status);

}

package com.vikadata.scheduler.space.service;

import java.util.List;

import com.vikadata.scheduler.space.model.AssetsAuditDto;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;

/**
 * <p>
 * 附件 服务类
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/26
 */
public interface IAssetAuditService {

    /**
     * 查询待人工审核图片列表
     *
     * @return  List<AssetsAuditVo> 回调结果
     * @author Benson Cheung
     * @date 2020/3/20
     */
    List<AssetsAuditDto> readReviews();

    /**
     * 推送待人工审核图片的钉钉群消息
     *
     * @param resourceUrl       存储桶域名
     * @param dtCensorPath      内容审核H5钉钉访问页面地址
     * @param dtCensorChatId    内容审核钉钉群
     */
    void auditAssetsSendDtMsg(String resourceUrl, String dtCensorPath, String dtCensorChatId) throws DingTalkApiException;
}

package com.vikadata.scheduler.space.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import javax.annotation.Resource;

import com.xxl.job.core.context.XxlJobHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.scheduler.space.config.properties.ConfigProperties;
import com.vikadata.scheduler.space.constants.AssetsPublicConstants;
import com.vikadata.scheduler.space.mapper.asset.AssetAuditMapper;
import com.vikadata.scheduler.space.model.AssetsAuditDto;
import com.vikadata.scheduler.space.service.IAssetAuditService;
import com.vikadata.social.dingtalk.DingTalkTemplate;
import com.vikadata.social.dingtalk.MessageReceiverBuilder;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.message.LinkMessage;
import com.vikadata.social.dingtalk.message.element.Link;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 附件表 服务实现类
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/11/21
 */
@Service
@Slf4j
public class AssetAuditServiceImpl implements IAssetAuditService {

    @Resource
    private AssetAuditMapper assetAuditMapper;

    @Autowired(required = false)
    private DingTalkTemplate dingtalkTemplate;

    @Override
    public List<AssetsAuditDto> readReviews() {
        log.info("查询需人工审核的图片列表");
        return assetAuditMapper.getArtificialAssetsAuditList();
    }

    @Override
    public void auditAssetsSendDtMsg(String resourceUrl, String dtCensorPath, String dtCensorChatId) throws DingTalkApiException {
        XxlJobHelper.log("需人工审核图片开始推送钉钉群,当前时间：{}", LocalDateTime.now(ZoneId.of("+8")));
        if (dingtalkTemplate == null) {
            XxlJobHelper.log("未开启钉钉集成组件服务");
            return;
        }
        List<AssetsAuditDto> list = this.readReviews();
        if (list.size() > 0) {
            //推送钉钉群消息
            Link link = new Link();
            link.setTitle("图片审核通知");
            link.setText("当前有" + list.size() + "图片需要人工审核，请点击查看");
            link.setMessageUrl(dtCensorPath);
            link.setPicUrl(resourceUrl + AssetsPublicConstants.DEFAULT_SPACE_LOGO);
            LinkMessage message = new LinkMessage(link);
            dingtalkTemplate.corpAppOperations().sendChatMessage(MessageReceiverBuilder.chatId(dtCensorChatId), message);
            XxlJobHelper.log("当前图片总数：" + list.size() + "图片消息已推送到钉钉群");
        }

    }
}

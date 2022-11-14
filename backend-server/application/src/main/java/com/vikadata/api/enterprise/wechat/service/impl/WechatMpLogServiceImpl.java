package com.vikadata.api.enterprise.wechat.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.user.enums.ThirdPartyMemberType;
import com.vikadata.api.enterprise.wechat.enums.WechatEventType;
import com.vikadata.api.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.enterprise.wechat.mapper.WechatMpLogMapper;
import com.vikadata.api.enterprise.wechat.service.IWechatMpLogService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WechatMpLogEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.shared.constants.WechatConstants.QR_SCENE_PRE;

/**
 * <p>
 * WeChat Mp Log Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class WechatMpLogServiceImpl implements IWechatMpLogService {

    @Resource
    private WechatMpLogMapper wechatMpLogMapper;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Override
    public void create(String appId, String openid, String unionId, WxMpXmlMessage inMessage) {
        log.info("Save wechat mp log. openid：{}，unionId：{}，inMessage：{}", openid, unionId, inMessage);
        String nickName = thirdPartyMemberMapper.selectNickNameByUnionIdAndType(appId, unionId,
                ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        WechatMpLogEntity entity = WechatMpLogEntity.builder()
                .appId(appId)
                .openId(openid)
                .unionId(unionId)
                .msgType(inMessage.getMsgType())
                .eventType(inMessage.getEvent())
                .scene(inMessage.getEventKey())
                .extra(JSONUtil.parseObj(inMessage.getAllFieldsMap()).toString())
                .creatorName(nickName)
                .build();
        if (inMessage.getEvent().equalsIgnoreCase(WechatEventType.SUBSCRIBE.name()) && StrUtil.isNotBlank(inMessage.getEventKey())) {
            // Not following the official account Follow the event after scanning the QR code,
            // and truncate the prefix returned by the official
            entity.setScene(inMessage.getEventKey().substring(QR_SCENE_PRE.length()));
        }
        boolean flag = SqlHelper.retBool(wechatMpLogMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}

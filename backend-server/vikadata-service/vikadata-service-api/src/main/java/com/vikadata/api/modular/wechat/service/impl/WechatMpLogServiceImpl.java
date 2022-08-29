package com.vikadata.api.modular.wechat.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.enums.wechat.WechatEventType;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.wechat.mapper.WechatMpLogMapper;
import com.vikadata.api.modular.wechat.service.IWechatMpLogService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WechatMpLogEntity;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

import static com.vikadata.api.constants.WechatConstants.QR_SCENE_PRE;

/**
 * <p>
 * 微信公众号日志 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
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
        log.info("保存微信公众号日志，openid：{}，unionId：{}，inMessage：{}", openid, unionId, inMessage);
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
            // 未关注公众号 扫描二维码后关注事件，截断官方返回的前缀
            entity.setScene(inMessage.getEventKey().substring(QR_SCENE_PRE.length()));
        }
        boolean flag = SqlHelper.retBool(wechatMpLogMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}

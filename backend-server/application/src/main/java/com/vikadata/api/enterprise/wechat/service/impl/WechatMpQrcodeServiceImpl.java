package com.vikadata.api.enterprise.wechat.service.impl;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.enterprise.wechat.vo.QrCodePageVo;
import com.vikadata.api.enterprise.wechat.mapper.WechatMpQrcodeMapper;
import com.vikadata.api.enterprise.wechat.service.IWechatMpQrcodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WechatMpQrcodeEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * WeChat Mp Qrcode Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class WechatMpQrcodeServiceImpl implements IWechatMpQrcodeService {

    @Resource
    private WechatMpQrcodeMapper wechatMpQrcodeMapper;

    @Override
    public IPage<QrCodePageVo> getQrCodePageVo(Page<QrCodePageVo> page, String appId) {
        return wechatMpQrcodeMapper.selectDetailInfo(page, appId);
    }

    @Override
    public void save(String appId, String type, String scene, WxMpQrCodeTicket ticket) {
        log.info("Save QRcode information. appId:{}，type:{}，scene:{}，WxMpQrCodeTicket:{}", appId, type, scene, ticket);
        WechatMpQrcodeEntity entity = WechatMpQrcodeEntity.builder()
                .appId(appId)
                .type(type)
                .scene(scene)
                .ticket(ticket.getTicket())
                .expireSeconds(ticket.getExpireSeconds())
                .url(ticket.getUrl())
                .build();
        boolean flag = SqlHelper.retBool(wechatMpQrcodeMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void delete(Long userId, Long qrCodeId, String appId) {
        boolean flag = SqlHelper.retBool(wechatMpQrcodeMapper.removeByIdAndAppId(userId, qrCodeId, appId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }
}

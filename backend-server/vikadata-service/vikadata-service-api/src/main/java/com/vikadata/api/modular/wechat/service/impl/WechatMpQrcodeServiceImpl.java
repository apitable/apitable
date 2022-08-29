package com.vikadata.api.modular.wechat.service.impl;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.vo.wechat.QrCodePageVo;
import com.vikadata.api.modular.wechat.mapper.WechatMpQrcodeMapper;
import com.vikadata.api.modular.wechat.service.IWechatMpQrcodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WechatMpQrcodeEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 微信公众号二维码信息 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/13
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
        log.info("保存二维码信息，appId:{}，type:{}，scene:{}，WxMpQrCodeTicket:{}", appId, type, scene, ticket);
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
        // 逻辑删除
        boolean flag = SqlHelper.retBool(wechatMpQrcodeMapper.removeByIdAndAppId(userId, qrCodeId, appId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }
}

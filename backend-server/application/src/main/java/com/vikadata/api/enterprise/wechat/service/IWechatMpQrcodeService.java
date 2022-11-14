package com.vikadata.api.enterprise.wechat.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;

import com.vikadata.api.enterprise.wechat.vo.QrCodePageVo;

/**
 * <p>
 * WeChat Mp Qrcode Service
 * </p>
 */
public interface IWechatMpQrcodeService {

    /**
     * Get qrcode page view information
     */
    IPage<QrCodePageVo> getQrCodePageVo(Page<QrCodePageVo> page, String appId);

    /**
     * Create qrcode
     */
    void save(String appId, String type, String scene, WxMpQrCodeTicket ticket);

    /**
     * Delete qrcode
     */
    void delete(Long userId, Long qrCodeId, String appId);
}

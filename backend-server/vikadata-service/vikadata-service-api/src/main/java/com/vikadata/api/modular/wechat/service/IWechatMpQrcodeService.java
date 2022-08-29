package com.vikadata.api.modular.wechat.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;

import com.vikadata.api.model.vo.wechat.QrCodePageVo;

/**
 * <p>
 * 微信公众号二维码信息 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/13
 */
public interface IWechatMpQrcodeService {

    /**
     * 获取二维码分页视图信息
     *
     * @param page      分页请求对象
     * @param appId     appId
     * @return QrCodePageVo
     * @author Chambers
     * @date 2022/6/24
     */
    IPage<QrCodePageVo> getQrCodePageVo(Page<QrCodePageVo> page, String appId);

    /**
     * 保存二维码信息
     *
     * @param appId  appId
     * @param type   类型
     * @param scene  场景值
     * @param ticket 二维码的Ticket
     * @author Chambers
     * @date 2020/8/10
     */
    void save(String appId, String type, String scene, WxMpQrCodeTicket ticket);

    /**
     * 删除二维码
     *
     * @param userId    用户ID
     * @param qrCodeId  二维码表ID
     * @param appId     appId
     * @author Chambers
     * @date 2022/6/24
     */
    void delete(Long userId, Long qrCodeId, String appId);
}

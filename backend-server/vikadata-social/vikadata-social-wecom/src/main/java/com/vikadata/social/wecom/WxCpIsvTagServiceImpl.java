package com.vikadata.social.wecom;

import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpTagGetResult;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpTagServiceImpl;

import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Tag.TAG_GET;

/**
 * <p>
 * 企业微信第三方服务商接口调用
 * </p>
 * @author 刘斌华
 * @date 2022-01-18 11:45:51
 */
public class WxCpIsvTagServiceImpl extends WxCpTpTagServiceImpl {

    private final WxCpTpService mainService;

    public WxCpIsvTagServiceImpl(WxCpTpService mainService) {
        super(mainService);

        this.mainService = mainService;
    }

    /**
     * 重写获取标签成员接口
     *
     * @see #get(String) 原接口有问题，没有提供 access_token
     * @param tagId 标签 ID
     * @param authCorpId 授权的企业 ID
     * @author 刘斌华
     * @date 2022-01-18 16:52:05
     */
    public WxCpTpTagGetResult get(String tagId, String authCorpId) throws WxErrorException {

        if (tagId == null) {
            throw new IllegalArgumentException("缺少tagId参数");
        }

        @SuppressWarnings("deprecation") // 需要使用此方法
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String url = String.format(wxCpTpConfigStorage.getApiUrl(TAG_GET), tagId);
        String params = "&access_token=" + wxCpTpConfigStorage.getAccessToken(authCorpId);
        String responseContent = mainService.get(url, params);

        return WxCpTpTagGetResult.deserialize(responseContent);

    }

}

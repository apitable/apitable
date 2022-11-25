package com.vikadata.social.wecom;

import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpTagGetResult;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpTagServiceImpl;

import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Tag.TAG_GET;

/**
 * Wecom isv service provider interface call
 */
public class WxCpIsvTagServiceImpl extends WxCpTpTagServiceImpl {

    private final WxCpTpService mainService;

    public WxCpIsvTagServiceImpl(WxCpTpService mainService) {
        super(mainService);

        this.mainService = mainService;
    }

    /**
     * Override the get tag member interface
     * @see #get(String) There is a problem with the original interface and no access_token is provided
     * @param tagId Tag ID
     * @param authCorpId corp ID
     */
    public WxCpTpTagGetResult get(String tagId, String authCorpId) throws WxErrorException {

        if (tagId == null) {
            throw new IllegalArgumentException("Missing tag Id parameter");
        }

        @SuppressWarnings("deprecation") // need to use this method
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String url = String.format(wxCpTpConfigStorage.getApiUrl(TAG_GET), tagId);
        String params = "&access_token=" + wxCpTpConfigStorage.getAccessToken(authCorpId);
        String responseContent = mainService.get(url, params);

        return WxCpTpTagGetResult.deserialize(responseContent);

    }

}

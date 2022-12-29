package com.vikadata.social.wecom;

import java.util.List;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.util.json.GsonParser;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpUserServiceImpl;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.User.USER_SIMPLE_LIST;

/**
 * Wecom isv user service implementation
 */
public class WxCpIsvUserServiceImpl extends WxCpTpUserServiceImpl {

    private final WxCpTpService mainService;

    public WxCpIsvUserServiceImpl(WxCpTpService mainService) {
        super(mainService);

        this.mainService = mainService;
    }

    /**
     * Rewrite the interface for obtaining department members
     * @see #listSimpleByDepartment(Long, Boolean, Integer) There is a problem with the original interface and no access_token is provided
     * @param departId Department ID
     * @param fetchChild whether to recurse the members of the subdepartment
     * @param status Member status
     * @param authCorpId Authorized corporate ID
     * @return Member information under the department
     */
    public List<WxCpUser> listSimpleByDepartment(Long departId, Boolean fetchChild, Integer status, String authCorpId)
            throws WxErrorException {

        @SuppressWarnings("deprecation") // need to use this method
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String url = wxCpTpConfigStorage.getApiUrl(USER_SIMPLE_LIST + departId);
        String params = "";
        if (fetchChild != null) {
            params += "&fetch_child=" + (fetchChild ? "1" : "0");
        }
        if (status != null) {
            params += "&status=" + status;
        }
        else {
            params += "&status=0";
        }
        params += "&access_token=" + wxCpTpConfigStorage.getAccessToken(authCorpId);
        String responseContent = mainService.get(url, params);
        JsonObject tmpJsonElement = GsonParser.parse(responseContent);
        return WxCpGsonBuilder.create()
                .fromJson(
                        tmpJsonElement.getAsJsonObject().get("userlist"),
                        new TypeToken<List<WxCpUser>>() {
                        }.getType()
                );
    }

}

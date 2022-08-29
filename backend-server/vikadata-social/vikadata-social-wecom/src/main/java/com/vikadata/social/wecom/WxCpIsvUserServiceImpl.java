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
 * <p>
 * 企业微信第三方服务商接口调用
 * </p>
 * @author 刘斌华
 * @date 2022-01-18 11:45:51
 */
public class WxCpIsvUserServiceImpl extends WxCpTpUserServiceImpl {

    private final WxCpTpService mainService;

    public WxCpIsvUserServiceImpl(WxCpTpService mainService) {
        super(mainService);

        this.mainService = mainService;
    }

    /**
     * 重写获取部门成员接口
     *
     * @see #listSimpleByDepartment(Long, Boolean, Integer) 原接口有问题，没有提供 access_token
     * @param departId 部门 ID
     * @param fetchChild 是否递归子部门的成员
     * @param status 成员状态
     * @param authCorpId 授权的企业 ID
     * @return 部门下的成员信息
     * @author 刘斌华
     * @date 2022-01-18 12:13:59
     */
    public List<WxCpUser> listSimpleByDepartment(Long departId, Boolean fetchChild, Integer status, String authCorpId)
            throws WxErrorException {

        @SuppressWarnings("deprecation") // 需要使用此方法
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String url = wxCpTpConfigStorage.getApiUrl(USER_SIMPLE_LIST + departId);
        String params = "";
        if (fetchChild != null) {
            params += "&fetch_child=" + (fetchChild ? "1" : "0");
        }
        if (status != null) {
            params += "&status=" + status;
        } else {
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

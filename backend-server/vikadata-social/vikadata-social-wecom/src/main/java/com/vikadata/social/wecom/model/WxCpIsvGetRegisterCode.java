package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 根据注册模板生成注册码
 * </p>
 * @author 刘斌华
 * @date 2022-03-14 17:16:57
 */
@Getter
@Setter
public class WxCpIsvGetRegisterCode extends WxCpBaseResp {

    @SerializedName("register_code")
    private String registerCode;

    @SerializedName("expires_in")
    private Integer expiresIn;

    public static WxCpIsvGetRegisterCode fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvGetRegisterCode.class);

    }

    public String toJson() {

        return WxCpGsonBuilder.create().toJson(this);

    }

}

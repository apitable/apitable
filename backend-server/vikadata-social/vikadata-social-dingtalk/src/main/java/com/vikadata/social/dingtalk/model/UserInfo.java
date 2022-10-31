package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User Info
 */
@Setter
@Getter
@ToString
public class UserInfo {

    private Boolean mainOrgAuthHighLevel;

    private String nick;

    private String openid;

    private String unionid;


    public Boolean getMainOrgAuthHighLevel() {
        return this.mainOrgAuthHighLevel;
    }

    public void setMainOrgAuthHighLevel(Boolean mainOrgAuthHighLevel) {
        this.mainOrgAuthHighLevel = mainOrgAuthHighLevel;
    }

    public String getNick() {
        return this.nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getOpenid() {
        return this.openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getUnionid() {
        return this.unionid;
    }

    public void setUnionid(String unionid) {
        this.unionid = unionid;
    }
}

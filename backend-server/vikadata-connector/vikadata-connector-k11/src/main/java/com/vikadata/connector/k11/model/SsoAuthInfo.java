package com.vikadata.connector.k11.model;

/**
 * <p>
 * k11 sso 授权返回信息
 * </p>
 *
 * @author Chambers
 * @date 2021/6/18
 */
public class SsoAuthInfo {

    private String emailAddr;

    private String telephone;

    /**
     * 用户展示名（姓氏+名）
     */
    private String userDisplayName;

    /**
     * 员工自增ID，非员工帐号返回 0
     */
    private Integer staffId;

    public String getEmailAddr() {
        return emailAddr;
    }

    public void setEmailAddr(String emailAddr) {
        this.emailAddr = emailAddr;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }
}

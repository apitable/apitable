package com.vikadata.connector.k11.model;

/**
 * <p>
 * K11 SSO Auth Information
 * </p>
 */
public class SsoAuthInfo {

    private String emailAddr;

    private String telephone;

    private String userDisplayName;

    /**
     * employee auto-increment ID, non-employee account returns 0
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

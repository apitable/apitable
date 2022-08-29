package com.vikadata.integration.sms;

/**
 * <p>
 * 短信消息体
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 17:00
 */
public class SmsMessage {

    private String areaCode;

    private String mobile;

    private String templateCode;

    private String[] params;

    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getTemplateCode() {
        return templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
    }
}

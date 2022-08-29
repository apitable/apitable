package com.vikadata.connector.k11.model;


/**
 * <p>
 * 数据加密密钥
 * </p>
 *
 * @author Chambers
 * @date 2021/6/18
 */
public class EncryptKey {

    private String encryptKey;

    private String ticket;

    public String getEncryptKey() {
        return encryptKey;
    }

    public void setEncryptKey(String encryptKey) {
        this.encryptKey = encryptKey;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }
}

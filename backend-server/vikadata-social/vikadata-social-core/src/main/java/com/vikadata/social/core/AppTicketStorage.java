package com.vikadata.social.core;

/**
 * APP Ticket 存储接口规范
 * ISV 应用必须实现此接口
 *
 * @author Shawn Deng
 * @date 2020-11-19 19:24:10
 */
public interface AppTicketStorage {

    /**
     * 获取 ticket
     *
     * @return 调用凭证
     */
    String getTicket();

    /**
     * 更新 ticket
     *
     * @param appTicket        开放平台推送的凭证
     * @param expiresInSeconds 有效期（单位：秒）
     */
    void updateTicket(String appTicket, int expiresInSeconds);
}

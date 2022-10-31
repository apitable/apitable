package com.vikadata.social.core;

/**
 * APP Ticket Storage Interface Specification
 * ISV Applications must implement this interface
 */
public interface AppTicketStorage {

    /**
     * obtain ticket
     * @return ticket
     */
    String getTicket();

    /**
     * update ticket
     *
     * @param appTicket        ticket pushed by the open platform
     * @param expiresInSeconds expire seconds （unit：s）
     */
    void updateTicket(String appTicket, int expiresInSeconds);
}

package com.apitable.space.vo;

import lombok.Data;

/**
 * seat usage in space.
 *
 * @author Shawn Deng
 */
@Data
public class SeatUsage {

    private Long total;
    private Long chatbotCount;
    private Long memberCount;

    /**
     * constructor.
     *
     * @param chatbotCount chatbot count
     * @param memberCount  member count
     */
    public SeatUsage(Long chatbotCount, Long memberCount) {
        this.chatbotCount = chatbotCount;
        this.memberCount = memberCount;
        this.total = chatbotCount + memberCount;
    }
}

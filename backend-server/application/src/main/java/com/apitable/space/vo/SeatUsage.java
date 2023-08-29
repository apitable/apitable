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
    private Long chatBotCount;
    private Long memberCount;

    /**
     * constructor.
     *
     * @param chatBotCount chatBot count
     * @param memberCount  member count
     */
    public SeatUsage(Long chatBotCount, Long memberCount) {
        this.chatBotCount = chatBotCount;
        this.memberCount = memberCount;
        this.total = chatBotCount + memberCount;
    }
}

package com.apitable.space.vo;

import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

/**
 * seat usage in space.
 *
 * @author Shawn Deng
 */
@Data
public class SeatUsage {

    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long total;

    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long chatBotCount;

    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long memberCount;

    public SeatUsage() {
        this(0L, 0L);
    }

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

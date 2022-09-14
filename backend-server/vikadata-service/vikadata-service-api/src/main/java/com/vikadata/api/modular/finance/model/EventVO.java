package com.vikadata.api.modular.finance.model;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import lombok.Data;

import com.vikadata.system.config.billing.Event;

/**
 * @author Shawn Deng
 */
@Data
public class EventVO {

    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate startDate;

    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate endDate;

    public static EventVO of(Event event) {
        EventVO eventVO = new EventVO();
        if (event != null) {
            eventVO.setStartDate(event.getStartDate());
            eventVO.setEndDate(event.getEndDate());
        }
        return eventVO;
    }
}

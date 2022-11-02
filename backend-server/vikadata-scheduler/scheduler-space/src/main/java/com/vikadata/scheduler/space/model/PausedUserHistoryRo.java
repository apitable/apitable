package com.vikadata.scheduler.space.model;

import lombok.Data;

@Data
public class PausedUserHistoryRo {

    /**
     * Cooling-off period days
     */
    private int limitDays;

}

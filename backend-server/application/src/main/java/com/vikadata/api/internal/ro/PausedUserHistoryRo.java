package com.vikadata.api.internal.ro;

import lombok.Data;

@Data
public class PausedUserHistoryRo {

    /**
     * Days of cooling off period
     */
    private int limitDays;

}

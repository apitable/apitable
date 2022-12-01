package com.vikadata.api.user.model;

import lombok.Data;

@Data
public class PausedUserHistoryRo {

    /**
     * Days of cooling off period
     */
    private int limitDays;

}

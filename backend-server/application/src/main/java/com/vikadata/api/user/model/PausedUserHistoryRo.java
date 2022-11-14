package com.vikadata.api.user.model;

import lombok.Data;

@Data
public class PausedUserHistoryRo {

    /**
     * 冷静期天数.
     */
    private int limitDays;

}

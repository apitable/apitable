package com.vikadata.api.space.model;

import lombok.Data;

/**
 * Datasheet Statistics Vo
 */
@Data
public class DatasheetStaticsVO {

    private long kanbanViews;

    private long calendarViews;

    private long galleryViews;

    private long ganttViews;
}

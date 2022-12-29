package com.vikadata.api.space.dto;

import lombok.Data;

/**
 * Datasheet Statistics Vo
 */
@Data
public class DatasheetStaticsDTO {

    private long kanbanViews;

    private long calendarViews;

    private long galleryViews;

    private long ganttViews;
}

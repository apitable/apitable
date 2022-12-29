package com.vikadata.scheduler.space.service;

import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler;
import com.vikadata.scheduler.space.handler.FixDatasheetDataHandler;

/**
 * <p>
 * Datasheet Meta Service
 * </p>
 */
public interface IDatasheetMetaService {

    /**
     * One-way Linked Data Processing
     *
     * @param jobParam  job param
     */
    void oneWayLinkDataHandler(ClearOneWayLinkJobHandler.JobParam jobParam);

    /**
     * Fix view sort field
     *
     * @param jobParam  job param
     */
    void fixTemplateViewSortInfo(FixDatasheetDataHandler.JobParam jobParam);

}

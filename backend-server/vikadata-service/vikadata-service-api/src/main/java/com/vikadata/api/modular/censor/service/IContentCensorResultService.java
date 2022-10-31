package com.vikadata.api.modular.censor.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.censor.ContentCensorReportRo;
import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.entity.ContentCensorResultEntity;

/**
 * <p>
 * Content Censor Result Service
 * </p>
 */
public interface IContentCensorResultService extends IService<ContentCensorResultEntity> {


    /**
     * Query the report information list according to the conditions
     *
     * @param page      page params
     * @param status    processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @return IPage<ContentCensorResultVo>
     */
    IPage<ContentCensorResultVo> readReports(Integer status, Page<ContentCensorResultVo> page);

    /**
     * Submit a report
     *
     * @param censorReportRo report information
     */
    void createReports(ContentCensorReportRo censorReportRo);

    /**
     * Handling whistleblower information
     *
     * @param nodeId node id
     * @param status processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     */
    void updateReports(String nodeId, Integer status);
}

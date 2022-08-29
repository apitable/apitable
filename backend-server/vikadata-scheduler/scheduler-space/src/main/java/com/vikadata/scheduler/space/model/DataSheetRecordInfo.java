package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 数表记录信息
 * </p>
 *
 * @author Chambers
 * @date 2020/7/17
 */
@Data
public class DataSheetRecordInfo {

    /**
     * 表ID
     */
    private Long id;

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 数据
     */
    private String data;

    /**
     * 记录ID
     */
    private String recordId;

    /**
     * 记录元数据
     */
    private String fieldUpdatedInfo;

    /**
     * 创建者
     */
    private Long createdBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}

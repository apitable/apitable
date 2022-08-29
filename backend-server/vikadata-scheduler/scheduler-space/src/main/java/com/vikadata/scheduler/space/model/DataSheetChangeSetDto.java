package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 数表 change set dto
 * </p>
 *
 * @author Chambers
 * @date 2020/9/14
 */
@Data
public class DataSheetChangeSetDto {

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 操作集
     */
    private String operations;

    /**
     * 创建者
     */
    private Long createdBy;
}

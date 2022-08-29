package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 神器关联Dto
 * </p>
 *
 * @author Pengap
 * @date 2022/1/21 17:40:53
 */
@Data
public class ForeignDatasheetDto {

    private Long id;

    private String dstId;

    private String fieldMap;

}

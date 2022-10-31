package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * Foreign Datasheet Dto
 * </p>
 */
@Data
public class ForeignDatasheetDto {

    private Long id;

    private String dstId;

    private String fieldMap;

}

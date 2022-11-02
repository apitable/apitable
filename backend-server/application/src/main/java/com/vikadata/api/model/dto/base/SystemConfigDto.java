package com.vikadata.api.model.dto.base;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SystemConfigDto {

    private Long id;

    private Integer type;

    private String i18nName;

    private String configMap;

    private Integer isDeleted;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime updatedAt;

}

package com.vikadata.api.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Online Template Information
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OnlineTemplateDto {

    private String templateId;

    private String templateName;

    private String propertyCode;

    private String propertyName;

    private Integer propertyType;
}

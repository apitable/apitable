package com.vikadata.api.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Template Property Rel Dto
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemplatePropertyRelDto {

    private Long propertyId;

    private String propertyName;

    private String propertyCode;

    private Integer propertyType;

    private String templateId;
}

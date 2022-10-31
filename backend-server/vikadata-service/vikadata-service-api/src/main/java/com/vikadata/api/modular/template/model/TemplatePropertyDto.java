package com.vikadata.api.modular.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Template Property Dto
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemplatePropertyDto {

    private Long propertyId;

    private String propertyName;

    private String propertyCode;

    private Integer propertyType;

    private String i18nName;
}

package com.vikadata.api.modular.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Search Results
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemplateKeyWordSearchDto {

    private String templateId;

    private String templateName;

    private String propertyCode;

    private String propertyName;

    private Integer propertyType;

    /**
     * whether the template name contains keywords
     */
    private Integer nameIndex;

    /**
     * whether the attribute name contains keywords
     */
    private Integer propertyNameIndex;
}

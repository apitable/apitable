package com.vikadata.api.modular.template.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Album DTO
 * </p>
 *
 * @author Chambers
 * @date 2022/9/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateAlbumDto {

    /**
     * Template Album Table ID
     */
    private Long id;

    /**
     * Template Album Custom ID
     */
    private String albumId;

    /**
     * I18n Key Name
     */
    private String i18nName;

    /**
     * Template Album Name
     */
    private String name;
}

package com.vikadata.api.template.model;

import java.util.List;
import java.util.Set;

import lombok.Data;

import com.vikadata.api.template.vo.AlbumVo;
import com.vikadata.api.template.vo.TemplateSearchResult;

/**
 * <p>
 * Template Search DTO
 * </p>
 */
@Data
public class TemplateSearchDTO {

    private List<AlbumVo> albums;

    private List<TemplateSearchResult> templates;

    private List<String> albumNames;

    private List<String> templateNames;

    private Set<String> tagNames;

}

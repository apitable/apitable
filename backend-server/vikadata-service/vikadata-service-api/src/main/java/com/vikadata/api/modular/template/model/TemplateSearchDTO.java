package com.vikadata.api.modular.template.model;

import java.util.List;
import java.util.Set;

import lombok.Data;

import com.vikadata.api.model.vo.template.AlbumVo;
import com.vikadata.api.model.vo.template.TemplateSearchResult;

/**
 * <p>
 * Template Search DTO
 * </p>
 *
 * @author Chambers
 * @date 2022/9/28
 */
@Data
public class TemplateSearchDTO {

    private List<AlbumVo> albums;

    private List<TemplateSearchResult> templates;

    private List<String> albumNames;

    private List<String> templateNames;

    private Set<String> tagNames;

}

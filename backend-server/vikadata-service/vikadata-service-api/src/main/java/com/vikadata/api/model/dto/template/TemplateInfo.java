package com.vikadata.api.model.dto.template;

import lombok.Data;

/**
 * <p>
 * 模板 info
 * </p>
 *
 * @author Chambers
 * @date 2020/5/25
 */
@Data
public class TemplateInfo {

    private Long id;

    private String templateId;

    private String nodeId;

    private String name;

    private String typeId;

    private String uuid;
}

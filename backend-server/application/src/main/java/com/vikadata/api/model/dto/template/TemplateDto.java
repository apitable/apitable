package com.vikadata.api.model.dto.template;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TemplateDto extends TemplateInfo {

    private String nodeName;

    private String icon;

    private String cover;

    private Integer type;

    private String avatar;

    private String nickName;

    private Boolean isNickNameModified;

    private String spaceName;
}

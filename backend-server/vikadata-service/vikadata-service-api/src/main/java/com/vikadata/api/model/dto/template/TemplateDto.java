package com.vikadata.api.model.dto.template;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 模板 dto
 * </p>
 *
 * @author Chambers
 * @date 2020/5/23
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TemplateDto extends TemplateInfo {

    private String nodeName;

    private String icon;

    private String cover;

    private Integer type;

    private String avatar;

    private String nickName;

    /**
     * 用户（user）是否修改过昵称
     */
    private Boolean isNickNameModified;

    private String spaceName;
}

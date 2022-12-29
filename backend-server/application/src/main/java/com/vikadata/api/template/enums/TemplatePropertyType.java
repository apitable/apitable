package com.vikadata.api.template.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** 
* <p> 
* Template Property type
* </p> 
* @author zoe zheng 
*/
@Getter
@AllArgsConstructor
public enum TemplatePropertyType {

    CATEGORY(0),

    TAG(1);

    private final int type;
}

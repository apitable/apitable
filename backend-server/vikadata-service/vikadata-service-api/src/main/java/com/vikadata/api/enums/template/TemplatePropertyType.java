package com.vikadata.api.enums.template;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** 
* <p> 
* 模版属性类型
* </p> 
* @author zoe zheng 
* @date 2021/8/2 6:02 下午
*/
@Getter
@AllArgsConstructor
public enum TemplatePropertyType {

    /**
     * 分类
     */
    CATEGORY(0),

    /**
     * 标签
     */
    TAG(1);


    private int type;
}

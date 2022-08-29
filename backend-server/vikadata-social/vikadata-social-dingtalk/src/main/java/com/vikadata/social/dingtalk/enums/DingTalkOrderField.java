package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 图片机器审核的结果类型
 *
 * @author Benson Cheung
 * @since 2020/03/21
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderField {

    /**
     * 代表按照进入部门的时间升序
     */
    ENTRY_ASC("entry_asc"),

    /**
     * 代表按照进入部门的时间降序
     */
    ENTRY_DESC("entry_desc"),

    /**
     * 代表按照进入部门的时间降序
     */
    MODIFY_ASC("modify_asc"),
    /**
     * 代表按照进入部门的时间降序
     */
    MODIFY_DESC("modify_desc"),
    /**
     * 代表用户定义(未定义时按照拼音)排序
     */
    CUSTOM("custom");

    private final String value;

    public String getValue() {
        return this.value;
    }

}

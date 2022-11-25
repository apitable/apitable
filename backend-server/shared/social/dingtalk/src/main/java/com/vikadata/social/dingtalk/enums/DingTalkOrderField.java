package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Types of results for image machine review
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderField {

    /**
     * Delegates are in ascending order of time of entering the department
     */
    ENTRY_ASC("entry_asc"),

    /**
     * Delegates are in descending order of entry time
     */
    ENTRY_DESC("entry_desc"),

    /**
     * Delegates are in descending order of entry time
     */
    MODIFY_ASC("modify_asc"),

    /**
     * Delegates are in descending order of entry time
     */
    MODIFY_DESC("modify_desc"),

    /**
     * Represents user-defined sorting (according to pinyin if not defined)
     */
    CUSTOM("custom");

    private final String value;

    public String getValue() {
        return this.value;
    }

}

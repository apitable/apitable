package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * 字段类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-17 00:26
 */
public enum FieldType {

    /**
     * 不支持该类型
     */
    NOT_SUPPORT(0),

    /**
     * 多行文本类型
     */
    TEXT(1),

    /**
     * 数字类型
     */
    NUMBER(2),

    /**
     * 单选类型
     */
    SINGLE_SELECT(3),

    /**
     * 多选类型
     */
    MULTI_SELECT(4),

    /**
     * 日期类型
     */
    DATETIME(5),

    /**
     * 附件类型
     */
    ATTACHMENT(6),

    /**
     * 关联类型
     */
    LINK(7),

    /**
     * URL类型
     */
    URL(8),

    /**
     * 邮箱类型
     */
    EMAIL(9),

    /**
     * 电话类型
     */
    PHONE(10),

    /**
     * 勾选类型
     */
    CHECKBOX(11),

    /**
     * 评分类型
     */
    RATING(12),

    /**
     * 成员类型
     */
    MEMBER(13),

    /**
     * 表查询类型
     */
    LOOKUP(14),

    /**
     * 表统计类型
     */
    ROLLUP(15),

    /**
     * 公式类型
     */
    FORMULA(16),

    /**
     * 货币类型
     */
    CURRENCY(17),

    /**
     * 百分比类型
     */
    PERCENT(18),

    /**
     * 单行文本类型
     */
    SINGLE_TEXT(19),

    /**
     * 自增数字类型
     */
    AUTO_NUMBER(20),

    /**
     * 创建时间类型
     */
    CREATED_TIME(21),

    /**
     * 修改时间类型
     */
    LAST_MODIFIED_TIME(22),

    /**
     * 创建者类型
     */
    CREATED_BY(23),

    /**
     * 修改者类型
     */
    LAST_MODIFIED_BY(24);


    private int fieldType;

    FieldType(int fieldType) {
        this.fieldType = fieldType;
    }

    public int getFieldType() {
        return fieldType;
    }

    public void setFieldType(int fieldType) {
        this.fieldType = fieldType;
    }

    public static FieldType create(int fieldType) {
        for (FieldType type : FieldType.values()) {
            if (type.getFieldType() == fieldType) {
                return type;
            }
        }
        return NOT_SUPPORT;
    }
}

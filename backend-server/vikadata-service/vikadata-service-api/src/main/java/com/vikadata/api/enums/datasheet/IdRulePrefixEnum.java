package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * 自定义ID前缀类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-17 00:26
 */
public enum IdRulePrefixEnum {

    /**
     * 空间
     */
    SPC("spc"),

    /**
     * 文件夹
     */
    FOD("fod"),

    /**
     * 数表
     */
    DST("dst"),

    /**
     * 表单
     */
    FORM("fom"),

    /**
     * 仪表盘
     */
    DASHBOARD("dsb"),

    /**
     * 快捷方式
     */
    MIRROR("mir"),

    /**
     * 视图
     */
    VIW("viw"),

    /**
     * 字段
     */
    FID("fld"),

    /**
     * 记录
     */
    REC("rec"),

    /**
     * 分享前缀
     */
    SHARE("shr"),

    /**
     * 模板
     */
    TPL("tpl"),

    /**
     * 模板category
     */
    TPC("tpc"),

    /**
     * 组件
     */
    WIDGET("wdt"),

    /**
     * 组件包
     */
    WIDGET_PACKAGE("wpk"),

    /**
     * 自动化机器人
     */
    AUTOMATION_ROBOT("arb"),

    /**
     * 自动化 触发器
     */
    AUTOMATION_TRIGGER("atr"),

    /**
     * 自动化 动作
     */
    AUTOMATION_ACTION("aac"),

    /**
     * 自动化 触发器原型
     */
    AUTOMATION_TRIGGER_TYPE("att"),

    /**
     * 自动化 动作原型
     */
    AUTOMATION_ACTION_TYPE("aat"),

    /**
     * 自动化 服务商
     */
    AUTOMATION_SERVICE("asv"),

    /**
     * template tag
     */
    TPT("tpt"),

    /**
     * template album
     */
    ALB("alb"),

    ;

    private final String idRulePrefixEnum;

    IdRulePrefixEnum(String idRulePrefixEnum) {
        this.idRulePrefixEnum = idRulePrefixEnum;
    }

    public String getIdRulePrefixEnum() {
        return idRulePrefixEnum;
    }
}

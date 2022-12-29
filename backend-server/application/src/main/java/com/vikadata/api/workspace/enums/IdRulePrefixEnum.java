package com.vikadata.api.workspace.enums;

/**
 * <p>
 * custom id prefix
 * </p>
 *
 * @author Benson Cheung
 */
public enum IdRulePrefixEnum {

    SPC("spc"),

    FOD("fod"),

    DST("dst"),

    FORM("fom"),

    DASHBOARD("dsb"),

    MIRROR("mir"),

    VIW("viw"),

    FLD("fld"),

    REC("rec"),

    SHARE("shr"),

    TPL("tpl"),

    TPC("tpc"),

    WIDGET("wdt"),

    WIDGET_PACKAGE("wpk"),

    AUTOMATION_ROBOT("arb"),

    AUTOMATION_TRIGGER("atr"),

    AUTOMATION_ACTION("aac"),

    AUTOMATION_TRIGGER_TYPE("att"),

    AUTOMATION_ACTION_TYPE("aat"),

    AUTOMATION_SERVICE("asv"),

    TPT("tpt"),

    ALB("alb"),

    EMB("emb"),

    ;

    private final String idRulePrefixEnum;

    IdRulePrefixEnum(String idRulePrefixEnum) {
        this.idRulePrefixEnum = idRulePrefixEnum;
    }

    public String getIdRulePrefixEnum() {
        return idRulePrefixEnum;
    }
}

/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.enums;

/**
 * <p>
 * custom id prefix.
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

    AUTOMATION("aut"),

    AUTOMATION_ROBOT("arb"),

    AUTOMATION_TRIGGER("atr"),

    AUTOMATION_ACTION("aac"),

    AUTOMATION_TRIGGER_TYPE("att"),

    AUTOMATION_ACTION_TYPE("aat"),

    AUTOMATION_SERVICE("asv"),

    TPT("tpt"),

    ALB("alb"),

    EMB("emb"),

    DOCUMENT_NAME("doc"),

    AI("ai_"),

    AIRAGENT("ag_"),

    CUSTOM_PAGE("cup"),

    ;

    private final String idRulePrefixEnum;

    IdRulePrefixEnum(String idRulePrefixEnum) {
        this.idRulePrefixEnum = idRulePrefixEnum;
    }

    public String getIdRulePrefixEnum() {
        return idRulePrefixEnum;
    }
}

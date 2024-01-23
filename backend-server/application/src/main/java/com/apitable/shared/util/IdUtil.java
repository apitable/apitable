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

package com.apitable.shared.util;

import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;

/**
 * id generator utility class.
 *
 * @author Shawn Deng
 */
public class IdUtil {

    public static final Integer DATASHEET_ID_FIXED_LENGTH = 15;

    public static final Integer ID_FIXED_LENGTH = 10;

    public static final int SHARE_ID_LENGTH = 18;

    public static final Integer AUTOMATION_ID_FIXED_LENGTH = 15;

    public static String createSpaceId() {
        return IdRulePrefixEnum.SPC.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createNodeId() {
        return IdRulePrefixEnum.FOD.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * create node id.
     *
     * @param nodeType node type
     * @return String
     */
    public static String createNodeId(NodeType nodeType) {
        return switch (nodeType) {
            case DATASHEET -> IdRulePrefixEnum.DST.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case FORM -> IdRulePrefixEnum.FORM.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case DASHBOARD -> IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case MIRROR -> IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case AI_CHAT_BOT -> IdRulePrefixEnum.AI.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case AUTOMATION -> IdRulePrefixEnum.AUTOMATION.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case AIRAGENT -> IdRulePrefixEnum.AIRAGENT.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case CUSTOM_PAGE -> IdRulePrefixEnum.CUSTOM_PAGE.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            default -> IdRulePrefixEnum.FOD.getIdRulePrefixEnum()
                + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
        };
    }

    public static String createDocumentName() {
        return IdRulePrefixEnum.DOCUMENT_NAME.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    public static String createDstId() {
        return IdRulePrefixEnum.DST.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    public static String createRecordId() {
        return IdRulePrefixEnum.REC.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createFieldId() {
        return IdRulePrefixEnum.FLD.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createViewId() {
        return IdRulePrefixEnum.VIW.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createShareId() {
        return IdRulePrefixEnum.SHARE.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(SHARE_ID_LENGTH);
    }

    public static String createTempCatCode() {
        return IdRulePrefixEnum.TPC.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createTemplateId() {
        return IdRulePrefixEnum.TPL.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createWidgetId() {
        return IdRulePrefixEnum.WIDGET.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    public static String createWidgetPackageId() {
        return IdRulePrefixEnum.WIDGET_PACKAGE.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createAutomationServiceId() {
        return IdRulePrefixEnum.AUTOMATION_SERVICE.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationTriggerTypeId() {
        return IdRulePrefixEnum.AUTOMATION_TRIGGER_TYPE.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationActionTypeId() {
        return IdRulePrefixEnum.AUTOMATION_ACTION_TYPE.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationRobotId() {
        return IdRulePrefixEnum.AUTOMATION_ROBOT.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationTriggerId() {
        return IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationActionId() {
        return IdRulePrefixEnum.AUTOMATION_ACTION.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    /**
     * template tag code.
     */
    public static String createTempTagCode() {
        return IdRulePrefixEnum.TPT.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * template album custom id.
     */
    public static String createTemplateAlbumId() {
        return IdRulePrefixEnum.ALB.getIdRulePrefixEnum()
            + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * is form.
     *
     * @param id node id
     * @return boolean
     */
    public static boolean isForm(String id) {
        if (null == id) {
            return false;
        }
        return id.startsWith(IdRulePrefixEnum.FORM.getIdRulePrefixEnum());
    }

    /**
     * is embed.
     *
     * @param id node id
     * @return boolean
     */
    public static boolean isEmbed(String id) {
        if (null == id) {
            return false;
        }
        return id.startsWith(IdRulePrefixEnum.EMB.getIdRulePrefixEnum());
    }
}

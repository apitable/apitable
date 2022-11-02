package com.vikadata.api.util;

import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.node.NodeType;

/**
 * <p>
 * id generator utility class
 *
 * @author Shawn Deng
 */
public class IdUtil {

    public static final Integer DATASHEET_ID_FIXED_LENGTH = 15;

    public static final Integer ID_FIXED_LENGTH = 10;

    public static final int SHARE_ID_LENGTH = 18;

    public static final Integer AUTOMATION_ID_FIXED_LENGTH = 15;

    public static String createSpaceId() {
        return IdRulePrefixEnum.SPC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createNodeId() {
        return IdRulePrefixEnum.FOD.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createDstId() {
        return IdRulePrefixEnum.DST.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    public static String createNodeId(Integer type) {
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case DATASHEET:
                return IdRulePrefixEnum.DST.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case FORM:
                return IdRulePrefixEnum.FORM.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case DASHBOARD:
                return IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            case MIRROR:
                return IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
            default:
                return IdRulePrefixEnum.FOD.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
        }
    }

    public static String createRecordId() {
        return IdRulePrefixEnum.REC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createFieldId() {
        return IdRulePrefixEnum.FID.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createViewId() {
        return IdRulePrefixEnum.VIW.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createShareId() {
        return IdRulePrefixEnum.SHARE.getIdRulePrefixEnum() + RandomExtendUtil.randomString(SHARE_ID_LENGTH);
    }

    public static String createTempCatCode() {
        return IdRulePrefixEnum.TPC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createTemplateId() {
        return IdRulePrefixEnum.TPL.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createWidgetId() {
        return IdRulePrefixEnum.WIDGET.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    public static String createWidgetPackageId() {
        return IdRulePrefixEnum.WIDGET_PACKAGE.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    public static String createAutomationRobotId() {
        return IdRulePrefixEnum.AUTOMATION_ROBOT.getIdRulePrefixEnum() + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationTriggerId() {
        return IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum() + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    public static String createAutomationActionId() {
        return IdRulePrefixEnum.AUTOMATION_ACTION.getIdRulePrefixEnum() + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    /**
     * template tag code
     */
    public static String createTempTagCode() {
        return IdRulePrefixEnum.TPT.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * template album custom id
     */
    public static String createTemplateAlbumId() {
        return IdRulePrefixEnum.ALB.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }
}

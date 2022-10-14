package com.vikadata.api.util;

import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.define.enums.NodeType;

import static com.vikadata.api.constants.CustomIdLengthConstant.AUTOMATION_ID_FIXED_LENGTH;
import static com.vikadata.api.constants.CustomIdLengthConstant.DATASHEET_ID_FIXED_LENGTH;
import static com.vikadata.api.constants.CustomIdLengthConstant.ID_FIXED_LENGTH;
import static com.vikadata.api.constants.CustomIdLengthConstant.SHARE_ID_LENGTH;

/**
 * <p>
 * ID生成器工具类，此工具类中主要封装：
 * <p>
 * 1.空间ID生成策略
 * 2.数表ID
 * 3.节点ID
 * 4.数表记录ID
 * 5.数表操作ID
 * 6.数表字段ID
 * 7.数表视图ID
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 15:52
 */
public class IdUtil {

    /**
     * 空间唯一ID生成
     */
    public static String createSpaceId() {
        return IdRulePrefixEnum.SPC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 节点ID
     */
    public static String createNodeId() {
        return IdRulePrefixEnum.FOD.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 数表ID
     */
    public static String createDstId() {
        return IdRulePrefixEnum.DST.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    /**
     * 节点ID
     */
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

    /**
     * 数表记录ID
     */
    public static String createRecordId() {
        return IdRulePrefixEnum.REC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 数表字段ID
     */
    public static String createFieldId() {
        return IdRulePrefixEnum.FID.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 数表视图ID
     */
    public static String createViewId() {
        return IdRulePrefixEnum.VIW.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 分享ID
     */
    public static String createShareId() {
        return IdRulePrefixEnum.SHARE.getIdRulePrefixEnum() + RandomExtendUtil.randomString(SHARE_ID_LENGTH);
    }

    /**
     * 模板分类code
     */
    public static String createTempCatCode() {
        return IdRulePrefixEnum.TPC.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 模板ID
     */
    public static String createTemplateId() {
        return IdRulePrefixEnum.TPL.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 组件ID
     */
    public static String createWidgetId() {
        return IdRulePrefixEnum.WIDGET.getIdRulePrefixEnum() + RandomExtendUtil.randomString(DATASHEET_ID_FIXED_LENGTH);
    }

    /**
     * 组件包ID
     */
    public static String createWidgetPackageId() {
        return IdRulePrefixEnum.WIDGET_PACKAGE.getIdRulePrefixEnum() + RandomExtendUtil.randomString(ID_FIXED_LENGTH);
    }

    /**
     * 自动化机器人ID
     */
    public static String createAutomationRobotId() {
        return IdRulePrefixEnum.AUTOMATION_ROBOT.getIdRulePrefixEnum() + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    /**
     * 触发器实例 ID
     *
     * @return
     */
    public static String createAutomationTriggerId() {
        return IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum() + RandomExtendUtil.randomString(AUTOMATION_ID_FIXED_LENGTH);
    }

    /**
     * 自动化 - 动作实例 ID
     *
     * @return
     */
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

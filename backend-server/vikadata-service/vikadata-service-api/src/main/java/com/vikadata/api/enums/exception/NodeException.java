package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * NodeException
 * 节点异常状态码
 * 状态码范围（410-429）
 *
 * @author Chambers
 * @since 2019/10/30
 */
@Getter
@AllArgsConstructor
public enum NodeException implements BaseException {

    /**
     * 根节点不允许操作
     */
    NOT_ALLOW(410, "根节点不允许操作"),

    /**
     * 节点名称重复
     */
    NODE_NAME_REPEAT(410, "节点名称重复"),

    /**
     * 未知的节点类型
     */
    UNKNOWN_NODE_TYPE(411, "未知的节点类型"),

    /**
     * 节点数量已到达上限
     */
    NUMBER_LIMIT(412, "节点数量已到达上限"),

    /**
     * 移动失败
     */
    MOVE_FAILURE(413, "移动失败"),

    /**
     * 转存失败
     */
    SHARE_NODE_STORE_FAIL(414, "转存失败"),

    /**
     * 您不是此空间的主管理员，不能转存
     */
    STORE_NODE_NOT_PERMISSION(414, "您不是此空间的主管理员，不能转存"),

    /**
     * 分享节点不允许转存
     */
    SHARE_NODE_DISABLE_SAVE(414, "分享节点不允许转存"),

    /**
     * 分享链接失效
     */
    SHARE_EXPIRE(414, "分享链接失效"),

    /**
     * 分享已开启
     */
    SHARE_HAS_OPEN(415, "分享已开启,请刷新节点"),

    /**
     * 开启分享失败
     */
    OPEN_SHARE_ERROR(415, "开启分享失败"),

    /**
     * 关闭分享失败
     */
    CLOSE_SHARE_ERROR(415, "关闭分享失败"),

    /**
     * 开启转存设置失败
     */
    ENABLE_SHARE_ALLOW_SAVE_ERROR(415, "开启转存设置失败"),

    /**
     * 已开启转存设置
     */
    HAS_ENABLE_SHARE_ALLOW_SAVE_ERROR(415, "已开启转存设置,请勿重复操作"),

    /**
     * 已开启转存设置
     */
    HAS_DISABLE_SHARE_ALLOW_SAVE_ERROR(415, "已关闭转存设置,请勿重复操作"),

    /**
     * 已开启可编辑设置
     */
    HAS_ENABLE_SHARE_ALLOW_EDIT_ERROR(415, "已开启可编辑设置,请勿重复操作"),

    /**
     * 已开启可编辑设置
     */
    HAS_DISABLE_SHARE_ALLOW_EDIT_ERROR(415, "已关闭可编辑设置,请勿重复操作"),

    /**
     * 记录分享设置失败
     */
    NOTE_SHARE_SETTING_ERROR(416, "记录分享设置失败"),

    /**
     * 刷新分享链接失败
     */
    REGENERATE_SHARE_ID_ERROR(416, "刷新分享链接失败"),

    /**
     * 根节点不允许分享
     */
    ROOT_NODE_CAN_NOT_SHARE(417, "根节点不允许分享"),

    /**
     * 不能复制文件夹
     */
    NODE_COPY_FOLDER_ERROR(418, "不能复制文件夹"),

    /**
     * 描述过长
     */
    DESCRIPTION_TOO_LONG(419, "描述过长"),

    /**
     * 关联表的字段将超过200列限制，复制失败
     */
    LINK_DATASHEET_COLUMN_EXCEED_LIMIT(420, "关联表的字段将超过200列限制，复制失败"),

    /**
     * 回收站不存在该节点
     */
    RUBBISH_NODE_NOT_EXIST(422, "回收站不存在该节点"),

    /**
     * 星标不存在该节点或前置节点
     */
    FAVORITE_NODE_NOT_EXIST(423, "星标中不存在该节点或前置节点"),

    /**
     * 复制节点复制联列失败
     */
    COPY_NODE_LINK__FIELD_ERROR(424, "复制节点，复制关联列失败"),

    /**
     * 删除节点转换关联列失败
     */
    DELETE_NODE_LINK__FIELD_ERROR(425, "删除节点，转换关联列失败");

    private final Integer code;

    private final String message;
}

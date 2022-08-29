package com.vikadata.api.modular.space.model;

/**
 * <p>
 * 修改空间操作（使用在已集成第三方IM的空间）
 * </p>
 *
 * @author Pengap
 * @date 2021/9/7 18:32:26
 */
public enum SpaceUpdateOperate {

    /**
     * 更新主管理操作
     */
    UPDATE_MAIN_ADMIN,
    /**
     * 修改成员信息
     */
    UPDATE_MEMBER,
    /**
     * 添加小组
     */
    ADD_TEAM,
    /**
     * 编辑小组
     */
    UPDATE_TEAM,
    /**
     * 删除小组
     */
    DELETE_TEAM,
    /**
     * 删除空间
     */
    DELETE_SPACE;

    public static Boolean dingTalkIsvCanOperated(SpaceUpdateOperate value) {
        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM) || value.equals(DELETE_TEAM);
    }

    public static boolean weComIsvCanOperated(SpaceUpdateOperate value) {

        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM) || value.equals(DELETE_TEAM);

    }

}

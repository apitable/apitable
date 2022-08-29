package com.vikadata.api.constants;

/**
 * <p>
 * 节点角色常量
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/27 11:42
 */
public class NodeRoleConstants {

    public static final String ROLE_DESC = "<br/>节点角色分6种类型：<br/>" +
        "1.owner 负责人，在指定工作目录下可新增、编辑、移动、排序、删除、复制文件夹和维格表。<br/>" +
        "2.manager 可管理角色，在指定工作目录下可新增、编辑、移动、排序、删除、复制文件夹和维格表。<br/>" +
        "3.editor 可编辑角色，仅可对该数表进行记录和视图的编辑，但不能编辑字段。<br/>" +
        "4.readonly 只可查看角色，仅可查看该数表，不能做任何编辑修改，只能分配只读权限与其他成员。<br/>";
}

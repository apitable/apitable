package com.vikadata.social.dingtalk.model;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 用户信息--v2接口返回信息
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkUserDetail {
    /**
     * 员工在当前企业内的唯一标识，也称staffId。
     */
    private String userid;

    /**
     * 员工在当前开发者企业账号范围内的唯一标识，系统生成，固定值，不会改变。
     */
    private String unionid;

    /**
     * 成员名称
     */
    private String name;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 86 国家地区码
     * 说明 第三方企业应用不返回该参数
     */
    private String stateCode;

    /**
     * 员工直属主管的userid。
     */
    private String managerUserid;

    /**
     * 手机号
     * 说明 第三方企业应用不返回该参数
     */
    private String mobile;

    /**
     * 是否号码隐藏
     * 说明 隐藏手机号后，手机号在个人资料页隐藏，但仍可对其发DING、发起钉钉免费商务电话。
     */
    private Boolean hideMobile;

    /**
     * 分机号
     * 说明 第三方企业应用不返回该参数
     */
    private String telephone;

    /**
     * 员工工号，对应显示到OA后台和客户端个人资料的工号栏目。长度为0~64个字符。
     */
    private String jobNumber;

    /**
     * 职位
     */
    private String title;

    /**
     * 员工的邮箱
     * 说明 第三方企业应用不返回该参数
     */
    private String email;

    /**
     * 办公地点
     * 说明 第三方企业应用不返回该参数
     */
    private String workPlace;

    /**
     * 备注
     * 说明 第三方企业应用不返回该参数
     */
    private String remark;

    /**
     * 专属帐号登录名
     */
    private String loginId;

    /**
     * 专属帐号类型：
     * sso：企业自建专属帐号
     * dingtalk：钉钉自建专属帐号
     */
    private String exclusiveAccountType;

    /**
     * 是否专属帐号
     */
    private Boolean exclusiveAccount;

    /**
     * 所属部门ID列表
     */
    private List<Long> deptIdList;

    /**
     * 员工在部门中的排序
     */
    private List<DeptOrder> deptOrderList;

    /**
     * 扩展属性，最大长度2000个字符
     */
    private String extension;

    /**
     * 入职时间，Unix时间戳
     * 在OA后台通讯录中的员工基础信息中维护过入职时间才会返回
     * 说明 第三方企业应用不返回该参数
     */
    private Date hiredDate;

    /**
     * 是否已经激活
     */
    private Boolean active;

    /**
     * 是否完成了实名认证
     */
    private Boolean realAuthed;

    /**
     * 是否为企业的高管
     */
    private Boolean senior;

    /**
     * 是否为企业的管理员
     */
    private Boolean admin;

    /**
     * 是否为企业的老板
     */
    private Boolean boss;

    /**
     * 员工在对应的部门中是否领导
     */
    private List<DeptLeader> leaderInDept;

    /**
     * 角色组名称
     */
    private List<UserRole> roleList;

    /**
     * 当用户来自于关联组织时的关联信息
     */
    private UnionEmpExt unionEmpExt;

    @Getter
    @Setter
    @ToString

    public static class UserRole {
        /**
         * 角色ID
         */
        private Long id;

        /**
         * 角色名称
         */
        private String name;

        /**
         * 角色组名称
         */
        private String groupName;
    }

    @Getter
    @Setter
    @ToString
    public static class DeptOrder {
        /**
         * 部门ID
         */
        private Long deptId;

        /**
         * 员工在部门中的排序
         */
        private Long order;
    }

    @Getter
    @Setter
    @ToString
    public static class DeptLeader {
        /**
         * 部门ID
         */
        private Long deptId;

        /**
         * 是否是领导
         */
        private Boolean leader;
    }

    @Getter
    @Setter
    @ToString
    public static class UnionEmpExt {
        /**
         * 员工的userid
         */
        private String userid;

        /**
         * 关联映射关系
         */
        private List<UnionEmpMapVo> unionEmpMapList;

        /**
         * 当前用户所属的组织的企业corpid
         */
        private String corpId;
    }

    @Getter
    @Setter
    @ToString
    public static class UnionEmpMapVo {
        /**
         * 员工的userid
         */
        private String userid;

        /**
         * 关联分支组织的企业corpid。
         */
        private String corpId;
    }

}

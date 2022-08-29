package com.vikadata.social.feishu.api;

/**
 * 飞书相关接口
 *
 * @author Shawn Deng
 * @date 2020-11-18 15:23:21
 */
public interface Feishu {

    /**
     * 授权管理接口
     *
     * @return 授权管理接口
     */
    AuthOperations authOperations();

    /**
     * 应用管理接口
     *
     * @return 应用管理接口
     */
    AppOperations appOperations();

    /**
     * 通讯录管理接口
     *
     * @return 通讯录管理接口
     */
    ContactOperations contactOperations();

    /**
     * 用户管理接口
     *
     * @return 用户管理接口
     */
    UserOperations userOperations();

    /**
     * 部门管理接口
     *
     * @return 部门管理接口
     */
    DepartmentOperations departmentOperations();

    /**
     * 机器人接口
     *
     * @return 机器人接口
     */
    BotOperations botOperations();

    /**
     * 消息卡片接口
     *
     * @return 消息卡片接口
     */
    MessageOperations messageOperations();

    /**
     * 企业信息接口
     * @return 企业信息接口
     */
    TenantOperations tenantOperations();

    /**
     * 图片操作接口
     * @return
     */
    ImageOperations imageOperations();
}

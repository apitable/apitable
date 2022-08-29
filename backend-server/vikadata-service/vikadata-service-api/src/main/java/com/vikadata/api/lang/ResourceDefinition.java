package com.vikadata.api.lang;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p>
 * api资源的声明类
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 15:14
 */
@Data
public class ResourceDefinition implements Serializable {

    private static final long serialVersionUID = -6964054785146612786L;

    /**
     * 控制器类名称
     */
    private String className;

    /**
     * 控制器中的方法名称
     */
    private String methodName;

    /**
     * 资源所属模块编码
     */
    private String modularCode;

    /**
     * 资源所属模块名称
     */
    private String modularName;

    /**
     * 资源编码
     */
    private String resourceCode;

    /**
     * 资源名称
     */
    private String resourceName;

    /**
     * 资源的请求路径
     */
    private String resourceUrl;

    /**
     * 资源标签组
     */
    private String[] tags;

    /**
     * 菜单编码
     */
    private String[] menuCode;

    /**
     * 资源的http请求方式
     */
    private String httpMethod;

    /**
     * 是否需要登录
     */
    private Boolean requiredLogin;

    /**
     * 是否需要校验权限
     */
    private Boolean requiredPermission;

    /**
     * 资源添加日期
     */
    private LocalDateTime createTime;

    /**
     * 初始化资源的机器的ip地址
     */
    private String ipAddress;

    /**
     * 是否需要校验域名
     * <p>只校验 requiredLogin = true
     * <p>校验请求的「域名」是否是对应绑定的「空间站」
     */
    private Boolean requiredAccessDomain;

}

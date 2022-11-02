package com.vikadata.api.component;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p>
 * api resource definition
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class ResourceDefinition implements Serializable {

    private static final long serialVersionUID = -6964054785146612786L;

    private String className;

    private String methodName;

    private String modularCode;

    private String modularName;

    private String resourceCode;

    private String resourceName;

    private String resourceUrl;

    private String[] tags;

    private String[] menuCode;

    private String httpMethod;

    private Boolean requiredLogin;

    private Boolean requiredPermission;

    private LocalDateTime createTime;

    private String ipAddress;

    private Boolean requiredAccessDomain;

}

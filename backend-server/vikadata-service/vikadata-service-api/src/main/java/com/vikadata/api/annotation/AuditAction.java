package com.vikadata.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.vikadata.api.component.audit.ParamLocation;

/**
 * <p>
 * 审计标识动作
 * Target METHOD: 用于描述类、接口(包括注解类型) 或enum上
 * RetentionPolicy.RUNTIME: JVM保留,所以他们能在运行时被JVM或其他使用反射机制的代码所读取和使用
 * </p>
 *
 * @author zoe zheng
 * @date 2020/3/24 2:04 下午
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface AuditAction {

    /**
     * 动作名称,例如：space_login
     */
    String value();

    /**
     * space_id 参数的位置
     */
    ParamLocation spaceIdLoc() default ParamLocation.NONE;

    /**
     * nodeId 参数的位置
     */
    ParamLocation nodeIdLoc() default ParamLocation.NONE;

    /**
     * parent_node_id 参数的位置
     */
    ParamLocation parentNodeIdLoc() default ParamLocation.NONE;
}

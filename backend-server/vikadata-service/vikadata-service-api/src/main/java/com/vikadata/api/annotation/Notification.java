package com.vikadata.api.annotation;

import java.lang.annotation.*;

import com.vikadata.api.component.audit.ParamLocation;
import com.vikadata.api.component.notification.NotificationTemplateId;
import org.apache.ibatis.jdbc.Null;

/**
* <p>
*  通知标示
* </p>
* @author zoe zheng
* @date 2020/6/15 8:28 下午
*/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Notification {

    /**
     * 模版ID
     */
    NotificationTemplateId[] templateId();
}

package com.vikadata.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.vikadata.api.component.notification.NotificationTemplateId;

/**
* <p>
*  notification annotation
* </p>
* @author zoe zheng
*/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Notification {

    /**
     * template id
     */
    NotificationTemplateId[] templateId();
}

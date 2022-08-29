package com.vikadata.boot.autoconfigure.social.dingtalk;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.DingTalkEventCallbackHandler;
import com.vikadata.social.dingtalk.EventListenerFactory;
import com.vikadata.social.dingtalk.event.BaseEvent;

import org.springframework.context.ApplicationContext;

/**
 * <p>
 *  应用启动后，钉钉事件监听器扫描
 *  扫描特定的注解
 *   并放入容器管理
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:16 下午
 */
public class DingTalkEventScanner {

    private static final Logger log = LoggerFactory.getLogger(DingTalkEventScanner.class);

    private ApplicationContext applicationContext;

    public DingTalkEventScanner(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public EventListenerFactory scan() {
        // 获取标注 DingTalkEventHandler 注解的类
        Map<String, Object> beans = applicationContext.getBeansWithAnnotation(DingTalkEventHandler.class);

        if (beans.isEmpty()) {
            log.warn("您似乎未提供钉钉的事件订阅的处理机制，请问是正确的吗？");
        }

        final AppHandlers appHandlers = new AppHandlers();

        // 解析注解类里面的方法，只有被标注的注解才能被扫描入容器
        for (Object bean : beans.values()) {
            // 所有注解的方法
            List<BaseInvocation> invocations = findInvocations(bean);
            // 遍历监听器方法列表
            invocations.forEach(invocation -> {
                if (invocation instanceof DingTalkEventInvocation) {
                    // 事件订阅方法
                    final DingTalkEventInvocation eventInvocation = (DingTalkEventInvocation) invocation;
                    if (BaseEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        // 如果是事件订阅回调
                        if (null != appHandlers.callbackEventInvocations.putIfAbsent((Class<? extends BaseEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate ding talk event handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    }
                    else {
                        throw new IllegalStateException("unreachable code, unknown ding talk eventType: " + eventInvocation.getEventType().getName());
                    }
                }
                else {
                    // 不会发生的
                    throw new IllegalStateException("钉钉事件未知的方法类型");
                }
            });
        }

        // 往事件监听器里注册事件处理方法
        EventListenerFactory factory = new EventListenerFactory();
        factory.addEventCallbackHandler(
                appHandlers.callbackEventInvocations.entrySet().stream().collect(
                        Collectors.toMap(Map.Entry::getKey, ee -> methodToCallbackEventHandler(ee.getKey(),
                                ee.getValue()))));
        return factory;
    }

    /**
     * 查找注解并包装成处理类
     *
     * @param o bean 对象
     * @return 注解对应的包装类列表
     */
    private List<BaseInvocation> findInvocations(Object o) {
        final List<BaseInvocation> invocations = new ArrayList<>();
        // 遍历类的方法
        for (Method m : o.getClass().getMethods()) {
            BaseInvocation inv = methodToInvocation(m, o);
            if (inv != null) {
                invocations.add(inv);
            }
        }
        return invocations;
    }

    private BaseInvocation methodToInvocation(Method m, Object o) {
        if (m.isAnnotationPresent(DingTalkEventListener.class)) {
            // 事件订阅注解方法
            Parameter[] parameters = m.getParameters();
            // 参数为空不处理
            if (parameters == null) {
                return null;
            }
            Parameter eventParam = null;
            for (Parameter p : parameters) {
                // 参数是继承 BaseEvent 基类
                boolean equalAssign = BaseEvent.class.isAssignableFrom(p.getType()) && BaseEvent.class != p.getType();
                if (equalAssign) {
                    if (eventParam != null) {
                        throw new IllegalStateException("DingTalkEventListener 注解的方法不允许存在多个参数: " + o.getClass().getName() + "." + m.getName());
                    }
                    eventParam = p;
                }
            }
            // 参数为空则不应该代表正确的处理方法
            if (eventParam == null) {
                return null;
            }
            return new DingTalkEventInvocation(m, o, eventParam.getType());
        }
        return null;
    }

    private <T extends BaseEvent> DingTalkEventCallbackHandler<T> methodToCallbackEventHandler(Class<T> eventType,
            BaseInvocation invocation) {
        return (agentId, event) -> {
            Parameter[] parameters = invocation.getMethod().getParameters();

            Object[] params = new Object[parameters.length];

            for (int i = 0; i < params.length; i++) {
                if (parameters[i].getType() == String.class) {
                    params[i] = agentId;
                }
                if (parameters[i].getType() == eventType) {
                    params[i] = event;
                }
            }

            return doInvoke(invocation, params);
        };
    }

    private static Object doInvoke(BaseInvocation inv, Object[] params) {
        try {
            return inv.getMethod().invoke(inv.getObject(), params);
        }
        catch (IllegalAccessException ex) {
            throw new RuntimeException(ex);
        }
        catch (InvocationTargetException ex) {
            throw new RuntimeException(ex.getTargetException());
        }
    }

    /**
     * 整个事件存储的临时容器类
     */
    private static class AppHandlers {
        Map<Class<? extends BaseEvent>, DingTalkEventInvocation> callbackEventInvocations = new HashMap<>();
    }
}

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
 *  After the application is started, the dingtalk event listener scans
 *  Scan for specific annotations {@link DingTalkEventHandler}
 *  And put it into IOC container
 * </p>
 * @author zoe zheng
 */
public class DingTalkEventScanner {

    private static final Logger log = LoggerFactory.getLogger(DingTalkEventScanner.class);

    private ApplicationContext applicationContext;

    public DingTalkEventScanner(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public EventListenerFactory scan() {
        Map<String, Object> beans = applicationContext.getBeansWithAnnotation(DingTalkEventHandler.class);

        if (beans.isEmpty()) {
            log.warn("It seems that you do not provide the processing mechanism of dingtalk event subscription. is it correct？");
        }

        final AppHandlers appHandlers = new AppHandlers();

        // only annotated method can be scanned into containers
        for (Object bean : beans.values()) {
            // get all annotations of method
            List<BaseInvocation> invocations = findInvocations(bean);
            // fetch listener method list
            invocations.forEach(invocation -> {
                if (invocation instanceof DingTalkEventInvocation) {
                    // Event subscription method
                    final DingTalkEventInvocation eventInvocation = (DingTalkEventInvocation) invocation;
                    if (BaseEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        // If it is an event subscription callback
                        if (null != appHandlers.callbackEventInvocations.putIfAbsent((Class<? extends BaseEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate ding talk event handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    }
                    else {
                        throw new IllegalStateException("unreachable code, unknown ding talk eventType: " + eventInvocation.getEventType().getName());
                    }
                }
                else {
                    // It won't happen
                    throw new IllegalStateException("Unknown method type for dingtalk event");
                }
            });
        }

        // Register the event handling method to the event listener
        EventListenerFactory factory = new EventListenerFactory();
        factory.addEventCallbackHandler(
                appHandlers.callbackEventInvocations.entrySet().stream().collect(
                        Collectors.toMap(Map.Entry::getKey, ee -> methodToCallbackEventHandler(ee.getKey(),
                                ee.getValue()))));
        return factory;
    }

    /**
     * Find annotations and wrap them into processing classes
     *
     * @param o bean object
     * @return List of packaging classes corresponding to annotations
     */
    private List<BaseInvocation> findInvocations(Object o) {
        final List<BaseInvocation> invocations = new ArrayList<>();
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
            Parameter[] parameters = m.getParameters();
            if (parameters == null) {
                return null;
            }
            Parameter eventParam = null;
            for (Parameter p : parameters) {
                boolean equalAssign = BaseEvent.class.isAssignableFrom(p.getType()) && BaseEvent.class != p.getType();
                if (equalAssign) {
                    if (eventParam != null) {
                        throw new IllegalStateException("DingTalkEventListener annotated method does not allow multiple parameters: " + o.getClass().getName() + "." + m.getName());
                    }
                    eventParam = p;
                }
            }
            // If the parameter is null, it should not represent the correct processing method
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
     * Temporary container class for the entire event store
     */
    private static class AppHandlers {
        Map<Class<? extends BaseEvent>, DingTalkEventInvocation> callbackEventInvocations = new HashMap<>();
    }
}

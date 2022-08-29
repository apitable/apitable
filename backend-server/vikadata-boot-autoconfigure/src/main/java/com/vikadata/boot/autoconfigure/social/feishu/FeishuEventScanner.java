package com.vikadata.boot.autoconfigure.social.feishu;

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

import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuCardActionListener;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventHandler;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventListener;
import com.vikadata.social.feishu.CardEvent;
import com.vikadata.social.feishu.FeishuCardActionHandler;
import com.vikadata.social.feishu.FeishuEventCallbackHandler;
import com.vikadata.social.feishu.FeishuV3ContactEventCallbackHandler;
import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.card.element.ActionElement;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

import org.springframework.context.ApplicationContext;

/**
 * 应用启动后，飞书事件监听器扫描
 * 扫描特定的注解
 * 并放入容器管理
 *
 * @author Shawn Deng
 * @date 2020-11-23 18:45:37
 */
public class FeishuEventScanner {

    private static final Logger log = LoggerFactory.getLogger(FeishuEventScanner.class);

    private final ApplicationContext applicationContext;

    public FeishuEventScanner(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    private static Object doInvoke(BaseInvocation inv, Object[] params) {
        try {
            return inv.getMethod().invoke(inv.getObject(), params);
        } catch (IllegalAccessException ex) {
            throw new RuntimeException(ex);
        } catch (InvocationTargetException ex) {
            throw new RuntimeException(ex.getTargetException());
        }
    }

    public EventListenerFactory scan() {
        // 获取标注 FeishuEventHandler 注解的类
        Map<String, Object> beans = applicationContext.getBeansWithAnnotation(FeishuEventHandler.class);

        if (beans.isEmpty()) {
            log.warn("您似乎未提供飞书的事件订阅的处理机制，请问是正确的吗？");
        }

        final AppHandlers appHandlers = new AppHandlers();

        // 解析注解类里面的方法，只有被标注的注解才能被扫描入容器
        for (Object bean : beans.values()) {
            // 所有注解的方法
            List<BaseInvocation> invocations = findInvocations(bean);
            // 遍历监听器方法列表
            invocations.forEach(invocation -> {
                if (invocation instanceof FeishuEventInvocation) {
                    // 事件订阅方法
                    final FeishuEventInvocation eventInvocation = (FeishuEventInvocation) invocation;
                    if (BaseEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        // 如果是事件订阅回调
                        if (null != appHandlers.callbackEventInvocations.putIfAbsent((Class<? extends BaseEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    } else if (BaseV3ContactEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        // 如果是事件订阅回调
                        if (null != appHandlers.callbackNewContactEventInvocations.putIfAbsent((Class<? extends BaseV3ContactEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    } else if (CardEvent.class == eventInvocation.getEventType()) {
                        // 如果是消息卡片事件
                        if (appHandlers.cardEventInvocation != null) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                        appHandlers.cardEventInvocation = eventInvocation;
                    } else {
                        throw new IllegalStateException("unreachable code, unknown eventType: " + eventInvocation.getEventType().getName());
                    }
                } else if (invocation instanceof FeishuCardActionInvocation) {
                    // 消息交互方法
                    final FeishuCardActionInvocation cardActionInvocation = (FeishuCardActionInvocation) invocation;
                    if (null != appHandlers.cardActionInvocations.putIfAbsent(cardActionInvocation.getCardActionAnnotation().methodName(), cardActionInvocation)) {
                        throw new IllegalStateException("duplicate handler for card method " + cardActionInvocation.getCardActionAnnotation().methodName());
                    }
                } else {
                    // 不会发生的
                    throw new IllegalStateException("未知的方法类型");
                }
            });
        }

        // 往事件监听器里注册事件处理方法
        EventListenerFactory factory = new EventListenerFactory();
        factory.addEventCallbackHandler(
            appHandlers.callbackEventInvocations.entrySet().stream().collect(
                Collectors.toMap(Map.Entry::getKey, ee -> methodToCallbackEventHandler(ee.getKey(), ee.getValue()))));
        factory.addV3ContactEventCallbackHandler(
            appHandlers.callbackNewContactEventInvocations.entrySet().stream().collect(
                Collectors.toMap(Map.Entry::getKey, ee -> methodToNewContactCallbackEventHandler(ee.getKey(), ee.getValue()))));
        factory.setCardEventHandler(methodToCardEventHandler(appHandlers.cardEventInvocation, appHandlers.cardActionInvocations));
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
        if (m.isAnnotationPresent(FeishuEventListener.class)) {
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
                // 参数是继承 BaseNewContactEvent 类
                boolean equalNewContactAssign = BaseV3ContactEvent.class.isAssignableFrom(p.getType()) && BaseV3ContactEvent.class != p.getType();
                if (equalAssign || equalNewContactAssign || CardEvent.class == p.getType()) {
                    if (eventParam != null) {
                        throw new IllegalStateException("FeishuEventListener 注解的方法不允许存在多个参数: " + o.getClass().getName() + "." + m.getName());
                    }
                    eventParam = p;
                }
            }
            // 参数为空则不应该代表正确的处理方法
            if (eventParam == null) {
                return null;
            }
            // 消息卡片事件必须指定返回类型为 Card 对象
            if (CardEvent.class == eventParam.getType()) {
                if (m.getReturnType() != Card.class) {
                    throw new IllegalStateException("CardEvent 注解的方法必须返回 Card 对象, 方法名: " + m.getName());
                }
            }
            return new FeishuEventInvocation(m, o, eventParam.getType());
        } else if (m.isAnnotationPresent(FeishuCardActionListener.class)) {
            // 消息卡片交互处理的方法
            if (m.getReturnType() != Card.class) {
                throw new IllegalStateException("FeishuCardActionListener 注解的方法必须返回 Card 对象, 方法名: " + m.getName());
            }
            return new FeishuCardActionInvocation(m, o);
        }
        return null;
    }

    private <T extends BaseEvent> FeishuEventCallbackHandler<T> methodToCallbackEventHandler(Class<T> eventType, BaseInvocation invocation) {

        return (e) -> {
            Parameter[] parameters = invocation.getMethod().getParameters();

            Object[] params = new Object[parameters.length];

            for (int i = 0; i < params.length; i++) {
                if (parameters[i].getType() == eventType) {
                    params[i] = e;
                }
            }

            return doInvoke(invocation, params);
        };
    }

    private <T extends BaseV3ContactEvent> FeishuV3ContactEventCallbackHandler<T> methodToNewContactCallbackEventHandler(Class<T> eventType, BaseInvocation invocation) {

        return (e) -> {
            Parameter[] parameters = invocation.getMethod().getParameters();

            Object[] params = new Object[parameters.length];

            for (int i = 0; i < params.length; i++) {
                if (parameters[i].getType() == eventType) {
                    params[i] = e;
                }
            }

            return doInvoke(invocation, params);
        };
    }

    private FeishuCardActionHandler methodToCardEventHandler(FeishuEventInvocation cardEventInvocation, Map<String, FeishuCardActionInvocation> cardActionInvocations) {
        if (cardEventInvocation == null && cardActionInvocations.size() == 0) {
            return null;
        }

        return (e) -> {
            BaseInvocation invocation = null;
            {
                String methodName = null;
                if (e.getAction().getValue() != null) {
                    methodName = getActionMethodName(e);
                }

                if (methodName != null) {
                    invocation = cardActionInvocations.get(methodName);
                }
            }

            if (invocation == null) {
                invocation = cardEventInvocation;
            }

            if (invocation == null) {
                return null;
            }

            Parameter[] parameters = invocation.getMethod().getParameters();

            Object[] params = new Object[parameters.length];

            for (int i = 0; i < params.length; i++) {
                if (parameters[i].getType() == CardEvent.class) {
                    params[i] = e;
                }
            }

            return (Card) doInvoke(invocation, params);
        };
    }

    public String getActionMethodName(CardEvent cardEvent) {
        CardEvent.Action action = cardEvent.getAction();
        if (action != null) {

            Map<String, String> value = action.getValue();
            if (value != null) {
                return value.get(ActionElement.METHOD_NAME_KEY);
            }
        }
        return null;
    }

    /**
     * 整个事件存储的临时容器类
     */
    private static class AppHandlers {

        FeishuEventInvocation cardEventInvocation;

        Map<String, FeishuCardActionInvocation> cardActionInvocations = new HashMap<>(16);

        Map<Class<? extends BaseEvent>, FeishuEventInvocation> callbackEventInvocations = new HashMap<>(16);

        Map<Class<? extends BaseV3ContactEvent>, FeishuEventInvocation> callbackNewContactEventInvocations = new HashMap<>(16);
    }
}

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
 * scan feishu event every
 *
 * @author Shawn Deng
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
        // get annotation with FeishuEventHandler
        Map<String, Object> beans = applicationContext.getBeansWithAnnotation(FeishuEventHandler.class);

        if (beans.isEmpty()) {
            log.warn("It seems that you do not provide the processing mechanism for event subscription of feishu. Is it correct？");
        }

        final AppHandlers appHandlers = new AppHandlers();

        for (Object bean : beans.values()) {
            List<BaseInvocation> invocations = findInvocations(bean);
            invocations.forEach(invocation -> {
                if (invocation instanceof FeishuEventInvocation) {
                    final FeishuEventInvocation eventInvocation = (FeishuEventInvocation) invocation;
                    if (BaseEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        if (null != appHandlers.callbackEventInvocations.putIfAbsent((Class<? extends BaseEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    } else if (BaseV3ContactEvent.class.isAssignableFrom(eventInvocation.getEventType())) {
                        if (null != appHandlers.callbackNewContactEventInvocations.putIfAbsent((Class<? extends BaseV3ContactEvent>) eventInvocation.getEventType(), eventInvocation)) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                    } else if (CardEvent.class == eventInvocation.getEventType()) {
                        if (appHandlers.cardEventInvocation != null) {
                            throw new IllegalStateException("duplicate handler for " + eventInvocation.getEventType().getSimpleName());
                        }
                        appHandlers.cardEventInvocation = eventInvocation;
                    } else {
                        throw new IllegalStateException("unreachable code, unknown eventType: " + eventInvocation.getEventType().getName());
                    }
                } else if (invocation instanceof FeishuCardActionInvocation) {
                    final FeishuCardActionInvocation cardActionInvocation = (FeishuCardActionInvocation) invocation;
                    if (null != appHandlers.cardActionInvocations.putIfAbsent(cardActionInvocation.getCardActionAnnotation().methodName(), cardActionInvocation)) {
                        throw new IllegalStateException("duplicate handler for card method " + cardActionInvocation.getCardActionAnnotation().methodName());
                    }
                } else {
                    // It won't happen
                    throw new IllegalStateException("Unknown event type");
                }
            });
        }

        // Register the event handling method to the event listener
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
     * Find annotations and wrap them into processing classes
     *
     * @param o bean object
     * @return list of wrapper class
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
        if (m.isAnnotationPresent(FeishuEventListener.class)) {
            Parameter[] parameters = m.getParameters();
            if (parameters == null) {
                return null;
            }
            Parameter eventParam = null;
            for (Parameter p : parameters) {
                boolean equalAssign = BaseEvent.class.isAssignableFrom(p.getType()) && BaseEvent.class != p.getType();
                boolean equalNewContactAssign = BaseV3ContactEvent.class.isAssignableFrom(p.getType()) && BaseV3ContactEvent.class != p.getType();
                if (equalAssign || equalNewContactAssign || CardEvent.class == p.getType()) {
                    if (eventParam != null) {
                        throw new IllegalStateException("FeishuEventListener does not allow multiple parameters: " + o.getClass().getName() + "." + m.getName());
                    }
                    eventParam = p;
                }
            }
            if (eventParam == null) {
                return null;
            }
            if (CardEvent.class == eventParam.getType()) {
                if (m.getReturnType() != Card.class) {
                    throw new IllegalStateException("CardEvent must return Card object, method name: " + m.getName());
                }
            }
            return new FeishuEventInvocation(m, o, eventParam.getType());
        } else if (m.isAnnotationPresent(FeishuCardActionListener.class)) {
            if (m.getReturnType() != Card.class) {
                throw new IllegalStateException("FeishuCardActionListener must return Card object, method name: " + m.getName());
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
     * Temporary container class for the entire event store
     */
    private static class AppHandlers {

        FeishuEventInvocation cardEventInvocation;

        Map<String, FeishuCardActionInvocation> cardActionInvocations = new HashMap<>(16);

        Map<Class<? extends BaseEvent>, FeishuEventInvocation> callbackEventInvocations = new HashMap<>(16);

        Map<Class<? extends BaseV3ContactEvent>, FeishuEventInvocation> callbackNewContactEventInvocations = new HashMap<>(16);
    }
}

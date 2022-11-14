package com.vikadata.api.shared.aspect;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;

/**
 * <p>
 * AOP base class
 * </p>
 *
 * @author Shawn Deng
 */
public abstract class BaseAspectSupport {

    /**
     * resolve method
     *
     * @param point aop point
     * @return Method
     */
    protected Method resolveMethod(ProceedingJoinPoint point) {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Class<?> targetClass = point.getTarget().getClass();

        Method method = getDeclaredMethod(targetClass, signature.getName(),
                signature.getMethod().getParameterTypes());
        if (method == null) {
            throw new IllegalStateException("Unable to resolve target method: " + signature.getMethod().getName());
        }
        return method;
    }

    /**
     * Get the specified method of the class
     *
     * @param clazz          class
     * @param methodName           method name
     * @param parameterTypes parameter type
     * @return Method
     */
    private Method getDeclaredMethod(Class<?> clazz, String methodName, Class<?>... parameterTypes) {
        try {
            return clazz.getDeclaredMethod(methodName, parameterTypes);
        }
        catch (NoSuchMethodException e) {
            Class<?> superClass = clazz.getSuperclass();
            if (superClass != null) {
                return getDeclaredMethod(superClass, methodName, parameterTypes);
            }
        }
        return null;
    }
}

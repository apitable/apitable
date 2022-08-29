package com.vikadata.api.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;

import java.lang.reflect.Method;

/**
 * <p>
 * AOP 基类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/9 14:19
 */
public abstract class BaseAspectSupport {

	/**
	 * 解析方法
	 *
	 * @param point 切面点
	 * @return Method
	 */
	protected Method resolveMethod(ProceedingJoinPoint point) {
		MethodSignature signature = (MethodSignature) point.getSignature();
		Class<?> targetClass = point.getTarget().getClass();

		Method method = getDeclaredMethod(targetClass, signature.getName(),
			signature.getMethod().getParameterTypes());
		if (method == null) {
			throw new IllegalStateException("无法解析目标方法: " + signature.getMethod().getName());
		}
		return method;
	}

	/**
	 * 获取类的指定方法
	 *
	 * @param clazz          类
	 * @param name           方法名
	 * @param parameterTypes 方法参数类型
	 * @return Method
	 */
	private Method getDeclaredMethod(Class<?> clazz, String name, Class<?>... parameterTypes) {
		try {
			return clazz.getDeclaredMethod(name, parameterTypes);
		} catch (NoSuchMethodException e) {
			Class<?> superClass = clazz.getSuperclass();
			if (superClass != null) {
				return getDeclaredMethod(superClass, name, parameterTypes);
			}
		}
		return null;
	}
}

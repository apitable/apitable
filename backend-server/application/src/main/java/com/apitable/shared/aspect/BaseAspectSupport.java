/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.aspect;

import java.lang.reflect.Method;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;

/**
 * <p>
 * AOP base class.
 * </p>
 *
 * @author Shawn Deng
 */
public abstract class BaseAspectSupport {

    /**
     * resolve method.
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
            throw new IllegalStateException(
                "Unable to resolve target method: " + signature.getMethod().getName());
        }
        return method;
    }

    /**
     * Get the specified method of the class.
     *
     * @param clazz          class
     * @param methodName     method name
     * @param parameterTypes parameter type
     * @return Method
     */
    private Method getDeclaredMethod(Class<?> clazz, String methodName,
                                     Class<?>... parameterTypes) {
        try {
            return clazz.getDeclaredMethod(methodName, parameterTypes);
        } catch (NoSuchMethodException e) {
            Class<?> superClass = clazz.getSuperclass();
            if (superClass != null) {
                return getDeclaredMethod(superClass, methodName, parameterTypes);
            }
        }
        return null;
    }
}

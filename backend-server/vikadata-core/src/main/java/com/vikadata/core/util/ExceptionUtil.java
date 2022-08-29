package com.vikadata.core.util;

import java.util.Collection;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.core.exception.BaseException;
import com.vikadata.core.exception.BusinessException;

/**
 * <p>
 * 业务异常工具类
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/10/17 18:37
 */
public class ExceptionUtil {

    /**
     * 断定目标值为true.为false则抛出业务异常
     *
     * @param expression 表达式
     * @param e          异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:23
     */
    public static void isTrue(boolean expression, BaseException e) {
        if (!expression) {
            throw new BusinessException(e);
        }
    }

    /**
     * 断定目标值为false.为true则抛出业务异常
     *
     * @param expression 表达式
     * @param e          异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:23
     */
    public static void isFalse(boolean expression, BaseException e) {
        if (expression) {
            throw new BusinessException(e);
        }
    }

    /**
     * 断定目标值为null.不为null则抛出业务异常
     *
     * @param obj 对象
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNull(Object obj, BaseException e) {
        if (ObjectUtil.isNotNull(obj)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 断定目标值不为null.为null则抛出业务异常
     *
     * @param obj 对象
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotNull(Object obj, BaseException e) {
        if (ObjectUtil.isNull(obj)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 字符串是否为空，空的定义如下:<br>
     * 1、为null <br>
     * 2、为""<br>
     * 为空抛出业务异常
     *
     * @param str 被检测的字符串
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(CharSequence str, BaseException e) {
        if (StrUtil.isNotEmpty(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 字符串是否为非空白 空白的定义如下： <br>
     * 1、不为null <br>
     * 2、不为""<br>
     * 为空抛出业务异常
     *
     * @param str 被检测的字符串
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(CharSequence str, BaseException e) {
        if (StrUtil.isEmpty(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 字符串是否为空白 空白的定义如下： <br>
     * 1、为null <br>
     * 2、为不可见字符（如空格）<br>
     * 3、""<br>
     * 不为空白抛出业务异常
     *
     * @param str 被检测的字符串
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isBlank(CharSequence str, BaseException e) {
        if (StrUtil.isNotBlank(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 字符串是否为非空白 空白的定义如下： <br>
     * 1、不为null <br>
     * 2、不为不可见字符（如空格）<br>
     * 3、不为""<br>
     * 为空白抛出业务异常
     *
     * @param str 被检测的字符串
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotBlank(CharSequence str, BaseException e) {
        if (StrUtil.isBlank(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 集合是否不为空
     * 为空抛出业务异常
     *
     * @param collection 集合
     * @param e          异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(Collection<?> collection, BaseException e) {
        if (CollUtil.isEmpty(collection)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 集合是否不为空
     * 为空抛出业务异常
     *
     * @param map 集合
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(Map<?, ?> map, BaseException e) {
        if (CollUtil.isEmpty(map)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Iterable是否不为空
     * 为空抛出业务异常
     *
     * @param iterable Iterable对象
     * @param e        异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(Iterable<?> iterable, BaseException e) {
        if (CollUtil.isEmpty(iterable)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Iterator是否不为空
     * 为空抛出业务异常
     *
     * @param iterator Iterator对象
     * @param e        异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(Iterator<?> iterator, BaseException e) {
        if (CollUtil.isNotEmpty(iterator)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Enumeration是否不为空
     * 为空抛出业务异常
     *
     * @param enumeration Enumeration对象
     * @param e           异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isNotEmpty(Enumeration<?> enumeration, BaseException e) {
        if (CollUtil.isNotEmpty(enumeration)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 集合是否为空
     * 不为空抛出业务异常
     *
     * @param collection 集合
     * @param e          异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(Collection<?> collection, BaseException e) {
        if (CollUtil.isNotEmpty(collection)) {
            throw new BusinessException(e);
        }
    }

    /**
     * 集合是否为空
     * 不为空抛出业务异常
     *
     * @param map 集合
     * @param e   异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(Map<?, ?> map, BaseException e) {
        if (CollUtil.isNotEmpty(map)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Iterable是否为空
     * 不为空抛出业务异常
     *
     * @param iterable Iterable对象
     * @param e        异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(Iterable<?> iterable, BaseException e) {
        if (CollUtil.isNotEmpty(iterable)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Iterator是否为空
     * 不为空抛出业务异常
     *
     * @param iterator Iterator对象
     * @param e        异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(Iterator<?> iterator, BaseException e) {
        if (CollUtil.isNotEmpty(iterator)) {
            throw new BusinessException(e);
        }
    }

    /**
     * Enumeration是否为空
     * 不为空抛出业务异常
     *
     * @param enumeration Enumeration对象
     * @param e           异常枚举
     * @author Shawn Deng
     * @date 2018/10/17 18:26
     */
    public static void isEmpty(Enumeration<?> enumeration, BaseException e) {
        if (CollUtil.isNotEmpty(enumeration)) {
            throw new BusinessException(e);
        }
    }

}

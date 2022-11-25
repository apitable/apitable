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
 * Business Exception Tool
 *
 * </p>
 *
 */
public class ExceptionUtil {

    /**
     * if expression is false, throw exception.
     *
     * @param expression    if expression is false, throw exception.
     * @param e             will be wrapped business exception
     */
    public static void isTrue(boolean expression, BaseException e) {
        if (!expression) {
            throw new BusinessException(e);
        }
    }

    /**
     * if expression is true, throw exception.
     *
     * @param expression    if expression is true, throw exception.
     * @param e             will be wrapped business exception
     */
    public static void isFalse(boolean expression, BaseException e) {
        if (expression) {
            throw new BusinessException(e);
        }
    }

    /**
     * if obj is not null, throw exception.
     *
     * @param obj   the object to check
     * @param e     will be wrapped business exception
     */
    public static void isNull(Object obj, BaseException e) {
        if (ObjectUtil.isNotNull(obj)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if obj is null, throw exception.
     *
     * @param obj   the object to check
     * @param e     will be wrapped business exception
     */
    public static void isNotNull(Object obj, BaseException e) {
        if (ObjectUtil.isNull(obj)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the string is no empty, throw exception.
     *
     * empty is defined as follows:<br>
     * 1、str object is null <br>
     * 2、str equal to ""<br>
     *
     * @param str   the string to check
     * @param e     will be wrapped business exception
     */
    public static void isEmpty(CharSequence str, BaseException e) {
        if (StrUtil.isNotEmpty(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the string is empty, throw exception.
     *
     * empty is defined as follows:<br>
     * 1、str object is null <br>
     * 2、str equal to ""<br>
     *
     * @param str   the string to check
     * @param e     will be wrapped business exception
     */
    public static void isNotEmpty(CharSequence str, BaseException e) {
        if (StrUtil.isEmpty(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     *
     * if the string is no blank, throw exception.
     *
     * blank is defined as follows:<br>
     * 1、str object is null <br>
     * 2、str equal to ""<br>
     * 3、invisible characters (such as spaces)
     *
     * @param str   the string to check
     * @param e     will be wrapped business exception
     */
    public static void isBlank(CharSequence str, BaseException e) {
        if (StrUtil.isNotBlank(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the string is blank, throw exception.
     *
     * blank is defined as follows:<br>
     * 1、str object is null <br>
     * 2、str equal to ""<br>
     * 3、invisible characters (such as spaces)
     *
     * @param str   the string to check
     * @param e     will be wrapped business exception
     */
    public static void isNotBlank(CharSequence str, BaseException e) {
        if (StrUtil.isBlank(str)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the collection is empty, throw exception.
     *
     * @param collection    collection
     * @param e             exception
     */
    public static void isNotEmpty(Collection<?> collection, BaseException e) {
        if (CollUtil.isEmpty(collection)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the map is empty, throw exception.
     *
     * @param map   map
     * @param e     exception
     */
    public static void isNotEmpty(Map<?, ?> map, BaseException e) {
        if (CollUtil.isEmpty(map)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if iterable is empty, throw exception.
     *
     * @param iterable  iterable object
     * @param e         exception
     */
    public static void isNotEmpty(Iterable<?> iterable, BaseException e) {
        if (CollUtil.isEmpty(iterable)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if iterator is empty, throw exception.
     *
     * @param iterator  iterator object
     * @param e         exception
     */
    public static void isNotEmpty(Iterator<?> iterator, BaseException e) {
        if (CollUtil.isNotEmpty(iterator)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if enumeration is empty, throw exception.
     *
     * @param enumeration   enumeration object
     * @param e             exception
     */
    public static void isNotEmpty(Enumeration<?> enumeration, BaseException e) {
        if (CollUtil.isNotEmpty(enumeration)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the collection is no empty, throw exception.
     *
     * @param collection    collection
     * @param e             exception
     */
    public static void isEmpty(Collection<?> collection, BaseException e) {
        if (CollUtil.isNotEmpty(collection)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if the map is no empty, throw exception.
     *
     * @param map   map
     * @param e     exception
     */
    public static void isEmpty(Map<?, ?> map, BaseException e) {
        if (CollUtil.isNotEmpty(map)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if iterable is no empty, throw exception.
     *
     * @param iterable  iterable object
     * @param e         exception
     */
    public static void isEmpty(Iterable<?> iterable, BaseException e) {
        if (CollUtil.isNotEmpty(iterable)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if iterator is no empty, throw exception.
     *
     * @param iterator  iterator object
     * @param e         exception
     */
    public static void isEmpty(Iterator<?> iterator, BaseException e) {
        if (CollUtil.isNotEmpty(iterator)) {
            throw new BusinessException(e);
        }
    }

    /**
     * if enumeration is no empty, throw exception.
     *
     * @param enumeration   enumeration object
     * @param e             exception
     */
    public static void isEmpty(Enumeration<?> enumeration, BaseException e) {
        if (CollUtil.isNotEmpty(enumeration)) {
            throw new BusinessException(e);
        }
    }

}

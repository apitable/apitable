package com.vikadata.core.util;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.Objects;

/**
 * <p>
 * 日期时间工具类
 * </p>
 * @author 刘斌华
 * @date 2022-05-10 09:21:31
 */
public class DateTimeUtil {

    /**
     * HH:mmZ
     */
    public static final DateTimeFormatter HOUR_MINUTE_ZONE = DateTimeFormatter.ofPattern("HH:mmZ");

    /**
     * HH:mm:ssZ
     */
    public static final DateTimeFormatter HOUR_MINUTE_SECOND_ZONE = DateTimeFormatter.ofPattern("HH:mm:ssZ");

    /**
     * 获取当前时间的 {@link LocalTime}
     *
     * @param zoneOffset 时区 offset
     * @return 当前时间
     * @author 刘斌华
     * @date 2022-08-01 16:24:42
     */
    public static LocalTime localTimeNow(int zoneOffset) {
        return LocalTime.now(ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * 字符串转换为 {@link LocalTime}
     *
     * @param source 时间字符串
     * @param formatter 格式
     * @return 字符串对应的 {@link LocalTime}
     * @author 刘斌华
     * @date 2022-08-01 16:27:30
     */
    public static LocalTime localTimeFromSource(String source, DateTimeFormatter formatter) {
        return LocalTime.parse(source, formatter);
    }

    /**
     * 获取当前时间的 {@link LocalDateTime}
     *
     * @param zoneOffset 时区 offset
     * @return 当前时间
     * @author 刘斌华
     * @date 2022-05-10 11:24:40
     */
    public static LocalDateTime localDateTimeNow(int zoneOffset) {
        return LocalDateTime.now(ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * 获取当前偏移的时间 {@link LocalDateTime}
     *
     * @param zoneOffset 时区 offset
     * @param plusDays 偏移的天数
     * @param plusHours 偏移的小时数
     * @param plusMinutes 偏移的分钟数
     * @param plusSeconds 偏移的秒数
     * @return 偏移后的时间
     * @author 刘斌华
     * @date 2022-05-10 11:31:29
     */
    public static LocalDateTime localDateTimeFromNow(int zoneOffset, int plusDays, int plusHours, int plusMinutes, int plusSeconds) {
        LocalDateTime now = localDateTimeNow(zoneOffset);
        if (plusDays != 0) {
            now = now.plusDays(plusDays);
        }
        if (plusHours != 0) {
            now = now.plusHours(plusHours);
        }
        if (plusMinutes != 0) {
            now = now.plusMinutes(plusMinutes);
        }
        if (plusSeconds != 0) {
            now = now.plusSeconds(plusSeconds);
        }

        return now;
    }

    /**
     * 将 Unix 时间戳转换为 {@link LocalDateTime}
     *
     * @param epochSeconds Unix 时间戳。单位：秒
     * @param zoneOffset 转换后时区 offset
     * @return 转换后的时间
     * @author 刘斌华
     * @date 2022-05-10 09:27:05
     */
    public static LocalDateTime localDateTimeFromSeconds(Long epochSeconds, int zoneOffset) {
        return localDateTimeFromSeconds(epochSeconds, zoneOffset, false);
    }

    /**
     * 将 Unix 时间戳转换为 {@link LocalDateTime}
     *
     * @param epochSeconds Unix 时间戳。单位：秒
     * @param zoneOffset 转换后时区 offset
     * @param allowZero 为 false 时若传过来的时间戳为 0 则作为 null 处理
     * @return 转换后的时间
     * @author 刘斌华
     * @date 2022-05-10 09:27:05
     */
    public static LocalDateTime localDateTimeFromSeconds(Long epochSeconds, int zoneOffset, boolean allowZero) {
        if (Objects.isNull(epochSeconds) || epochSeconds == 0L && !allowZero) {
            return null;
        }

        return LocalDateTime.ofEpochSecond(epochSeconds, 0, ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * 计算两个自然时间的相差值
     *
     * @param startTime 开始时间
     * @param endTime 结束事件
     * @param field 计算差值的单位
     * @return long 自然时间的相差值
     * @author 刘斌华
     * @date 2022-08-11 18:50:39
     */
    public static long between(TemporalAccessor startTime, TemporalAccessor endTime, ChronoField field) {
        return endTime.getLong(field) - startTime.getLong(field);
    }

}

package com.vikadata.api.support.serializer;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * <p>
 * 日期转换UTC日期格式
 * 转换的时间是东八区+8时区时间，转成UTC的时候要减8，转为格林尼治0时区
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/28 18:24
 */
public class ChinaLocalDateTimeToUtcSerializer extends StdSerializer<LocalDateTime> {

    protected ChinaLocalDateTimeToUtcSerializer(Class<LocalDateTime> t) {
        super(t);
    }

    protected ChinaLocalDateTimeToUtcSerializer() {
        this(null);
    }

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        // 设置当前时区时间
        ZonedDateTime dateAndTime = ZonedDateTime.of(value, ZoneId.of("Asia/Shanghai"));
        ZonedDateTime utcDate = dateAndTime.withZoneSameInstant(ZoneOffset.UTC);
        gen.writeString(utcDate.format(DateTimeFormatter.ofPattern(DatePattern.UTC_MS_PATTERN)));
    }
}

package com.vikadata.api.cache.bean;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * 帐号关联dto
 * </p>
 *
 * @author Chambers
 * @date 2020/2/28
 */
@Data
public class AccountLinkDto {

    /**
     * 关联类型：0钉钉；1微信, 2
     */
    private Integer type;

    /**
     * 帐号昵称
     */
    private String nickName;

    /**
     * 绑定时间
     */
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createTime;
}

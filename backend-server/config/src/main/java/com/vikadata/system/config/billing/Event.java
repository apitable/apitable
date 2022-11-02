package com.vikadata.system.config.billing;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import com.vikadata.system.config.UnixTimestampDeserializer;

@Data
public class Event {

    private String id;

    @JsonDeserialize(using = UnixTimestampDeserializer.class)
    private LocalDate startDate;

    @JsonDeserialize(using = UnixTimestampDeserializer.class)
    private LocalDate endDate;

    private String eventName;
}

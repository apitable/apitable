package com.vikadata.api.shared.sysconfig.billing;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import com.vikadata.api.shared.sysconfig.UnixTimestampDeserializer;

@Data
public class Event {

    private String id;

    @JsonDeserialize(using = UnixTimestampDeserializer.class)
    private LocalDate startDate;

    @JsonDeserialize(using = UnixTimestampDeserializer.class)
    private LocalDate endDate;

    private String eventName;
}

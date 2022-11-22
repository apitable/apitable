package com.vikadata.api.shared.sysconfig;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import lombok.Data;

@Data
public class FeatureSetting {

    private Integer capacity;

    private Integer nodes;

    @JsonProperty("endDate")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate endDate;
}

package com.vikadata.api.shared.sysconfig;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class UnixTimestampDeserializer extends JsonDeserializer<LocalDate> {

    @Override
    public LocalDate deserialize(JsonParser jp, DeserializationContext context) throws IOException {
        String timestamp = jp.getText().trim();
        try {
            return Instant.ofEpochMilli(Long.parseLong(timestamp)).atZone(ZoneOffset.ofHours(8)).toLocalDate();
        }
        catch (NumberFormatException e) {
            return null;
        }
    }
}

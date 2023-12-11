package com.apitable.core.support.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * string or array to string array deserializer.
 */
public class StringOrArrayToStringArrayDeserializer extends JsonDeserializer<List<String>> {
    
    @Override
    public List<String> deserialize(JsonParser jsonParser,
                                    DeserializationContext deserializationContext) throws
        IOException {
        if (jsonParser.currentToken() == JsonToken.VALUE_STRING) {
            // If it's a string value, process it
            String rawValue = jsonParser.getValueAsString();
            // Assuming keys are comma-separated
            String[] keyArray = rawValue.split(",");

            return Arrays.asList(keyArray);
        } else if (jsonParser.currentToken() == JsonToken.START_ARRAY) {
            // If it's a JSON array, process it accordingly
            List<String> keysList = new ArrayList<>();
            while (jsonParser.nextToken() != JsonToken.END_ARRAY) {
                String key = jsonParser.getText();
                keysList.add(key);
            }
            return keysList;
        } else {
            throw new IOException("Unexpected JSON format");
        }
    }
}

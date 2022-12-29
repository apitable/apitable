package com.vikadata.core.support.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <p>
 *  String array to Long array
 * </p>
 *
 */
public class StringArrayToLongArrayDeserializer extends JsonDeserializer<List<Long>> {

    @Override
    public List<Long> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        ObjectMapper mapper = (ObjectMapper) parser.getCodec();
        JsonNode node = mapper.readTree(parser);
        List<Long> result = new ArrayList<>();
        if (node != null) {
            if (node instanceof ArrayNode) {
                ArrayNode arrayNode = (ArrayNode) node;
                for (JsonNode elementNode : arrayNode) {
                    result.add(mapper.readValue(elementNode.traverse(mapper), Long.class));
                }
            } else {
                result.add(mapper.readValue(node.traverse(mapper), Long.class));
            }
        }
        return Collections.unmodifiableList(result);
    }
}

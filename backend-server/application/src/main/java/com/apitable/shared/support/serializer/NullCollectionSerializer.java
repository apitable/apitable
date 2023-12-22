package com.apitable.shared.support.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.util.Collection;

/**
 * null to empty collection serialization.
 */
public class NullCollectionSerializer extends JsonSerializer<Collection<?>> {

    @Override
    public void serialize(Collection<?> value, JsonGenerator gen, SerializerProvider serializers)
        throws IOException {
        gen.writeStartArray();
        gen.writeEndArray();
    }
}

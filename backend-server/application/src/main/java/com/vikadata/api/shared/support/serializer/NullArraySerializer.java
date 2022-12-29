package com.vikadata.api.shared.support.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * Empty array serialization
 * </p>
 *
 * @author Chambers
 */
public class NullArraySerializer extends JsonSerializer<Object> {

	@Override
	public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if (value == null) {
			gen.writeStartArray();
			gen.writeEndArray();
		} else {
			gen.writeObject(value);
		}

	}
}

package com.vikadata.api.shared.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * <p>
 * multi value map util
 * </p>
 *
 * @author Chambers
 */
public class MultiValueMapUtils {

    public static void accumulatedValueIfAbsent(Map<String, List<String>> map, String key, String value) {
        if (!map.containsKey(key)) {
            List<String> values = new ArrayList<>();
            values.add(value);
            map.put(key, values);
            return;
        }
        List<String> values = map.get(key);
        if (!values.contains(value)) {
            values.add(value);
        }
    }
}

package com.apitable.shared.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Decoder util.
 *
 * @author Shawn Deng
 */
public class DecoderUtil {

    /**
     * decode character.
     *
     * @param encodeString encode string
     * @return decoded string
     */
    public static String decode(String encodeString) {
        try {
            return URLDecoder.decode(encodeString, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {

            return null;
        }
    }
}

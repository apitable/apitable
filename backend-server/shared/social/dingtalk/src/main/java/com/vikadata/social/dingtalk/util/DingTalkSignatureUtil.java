package com.vikadata.social.dingtalk.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Map.Entry;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 *  DingTalk Signature Tool
 */
public class DingTalkSignatureUtil {
    private static final String DEFAULT_ENCODING = "UTF-8";

    /**
     * Signature method
     */
    private static final String ALGORITHM = "HmacSHA256";

    private static final String NEW_LINE = "\n";

    public static String getCanonicalStringForIsv(Long timestamp, String suiteTicket) {
        StringBuilder canonicalString = new StringBuilder();
        canonicalString.append(timestamp);
        if (suiteTicket != null) {
            canonicalString.append(NEW_LINE).append(suiteTicket);
        }

        return canonicalString.toString();
    }

    public static String computeSignature(String secret, String canonicalString) {
        try {
            byte[] signData = sign(secret.getBytes(DEFAULT_ENCODING), canonicalString.getBytes(DEFAULT_ENCODING));
            return new String(Base64.getEncoder().encode(signData));
        }
        catch (UnsupportedEncodingException ex) {
            throw new RuntimeException("Unsupported algorithm: " + DEFAULT_ENCODING, ex);
        }
    }

    /**
     * The param parameter is converted into the query standard string of the url, and the default encoding is UTF-8
     *
     * @param params params map
     * @return query string
     */
    public static String paramToQueryString(Map<String, String> params) {
        return paramToQueryString(params, "utf-8");
    }

    public static String paramToQueryString(Map<String, String> params, String charset) {

        if (params == null || params.isEmpty()) {
            return null;
        }

        StringBuilder paramString = new StringBuilder();
        boolean first = true;
        for (Entry<String, String> p : params.entrySet()) {
            String key = p.getKey();
            String value = p.getValue();

            if (!first) {
                paramString.append("&");
            }

            // Urlencode each request parameter
            paramString.append(urlEncode(key, charset));
            if (value != null) {
                paramString.append("=").append(urlEncode(value, charset));
            }

            first = false;
        }

        return paramString.toString();
    }

    public static String urlEncode(String value, String encoding) {
        if (value == null) {
            return "";
        }
        try {
            String encoded = URLEncoder.encode(value, encoding);
            return encoded.replace("+", "%20").replace("*", "%2A")
                    .replace("~", "%7E").replace("/", "%2F");
        }
        catch (UnsupportedEncodingException e) {
            throw new IllegalArgumentException("FailedToEncodeUri", e);
        }
    }

    private static byte[] sign(byte[] key, byte[] data) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            mac.init(new SecretKeySpec(key, ALGORITHM));
            return mac.doFinal(data);
        }
        catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("Unsupported algorithm: " + ALGORITHM, ex);
        }
        catch (InvalidKeyException ex) {
            throw new RuntimeException("Invalid key: " + Arrays.toString(key), ex);
        }
    }
}

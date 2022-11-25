package com.vikadata.core.util;

import java.io.InputStream;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;

/**
 * <p>
 * Abstract Algorithm Tools
 * </p>
 *
 */
public class DigestUtil {

    /**
     * The principle of synchronous generation of Content-MD5: first calculate the MD5 encrypted binary array (128 bits),
     * and then perform Base64 encoding.
     */
    public static String md5Hex(InputStream is) {
        Digester md5 = new Digester(DigestAlgorithm.MD5);
        byte[] bytes = md5.digest(is);
        return Base64.encode(bytes);
    }

    /**
     * The first 32 bytes of the created file are encoded in Base64
     */
    public static String createHeadSum(InputStream is) {
        // get the first 32 bytes of the resource file, encoded in Base64
        byte[] bytes = IoUtil.readBytes(is);
        return Base64.encode(ArrayUtil.resize(bytes, 32));
    }
}

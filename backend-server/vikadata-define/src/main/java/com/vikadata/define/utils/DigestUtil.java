package com.vikadata.define.utils;

import java.io.InputStream;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;

/**
 * <p>
 * 摘要算法工具
 * </p>
 *
 * @author Chambers
 * @date 2019/12/25
 */
public class DigestUtil {

    /**
     * 同步生成Content-MD5的原理：先计算MD5加密的二进制数组(128位),  再进行Base64编码。
     */
    public static String md5Hex(InputStream is) {
        Digester md5 = new Digester(DigestAlgorithm.MD5);
        byte[] bytes = md5.digest(is);
        return Base64.encode(bytes);
    }

    /**
     * 创建文件前32个字节，Base64编码
     */
    public static String createHeadSum(InputStream is) {
        // 取资源文件前32个字节，Base64编码
        byte[] bytes = IoUtil.readBytes(is);
        return Base64.encode(ArrayUtil.resize(bytes, 32));
    }
}

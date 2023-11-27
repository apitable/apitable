/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.core.util;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;
import java.io.InputStream;

/**
 * <p>
 * Abstract Algorithm Tools.
 * </p>
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
     * The first 32 bytes of the created file are encoded in Base64.
     *
     * @param is input stream
     */
    public static String createHeadSum(InputStream is) {
        // get the first 32 bytes of the resource file, encoded in Base64
        byte[] bytes = IoUtil.readBytes(is);
        return Base64.encode(ArrayUtil.resize(bytes, 32));
    }
}

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

import cn.hutool.core.util.IdUtil;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * <p>
 * Document related tools.
 * </p>
 */
public class FileTool {

    // temporary folder Name
    private static final String TMP_FOLDER_NAME = "apitable.tmp";

    // upload temporary folder name
    private static final String UPLOAD_TEMP = "upload";

    // default suffix for temporary files
    private static final String TMP_SUFFIX = ".tmp";

    /**
     * identify coding.
     *
     * @param in input stream
     * @return coding string
     */
    public static String identifyCoding(InputStream in) {
        String charset = "GBK";
        byte[] first3Bytes = new byte[3];
        try (BufferedInputStream bis = new BufferedInputStream(in)) {
            bis.mark(0);
            int read = bis.read(first3Bytes, 0, 3);
            byte byte0xff = (byte) 0xFF;
            byte byte0xfe = (byte) 0xFE;
            byte byte0xef = (byte) 0xEF;
            byte byte0xbb = (byte) 0xBB;
            byte byte0xbf = (byte) 0xBF;
            int midIndex = 2;
            if (read != -1) {
                if (first3Bytes[0] == byte0xff && first3Bytes[1] == byte0xfe) {
                    // UTF-16LE
                    charset = "Unicode";
                } else if (first3Bytes[0] == byte0xfe && first3Bytes[1] == byte0xff) {
                    // UTF-16BE
                    charset = "Unicode";
                } else if (first3Bytes[0] == byte0xef && first3Bytes[1] == byte0xbb
                    && first3Bytes[midIndex] == byte0xbf) {
                    charset = "UTF8";
                } else {
                    bis.reset();
                    while ((read = bis.read()) != -1) {
                        if (read >= 0xF0) {
                            break;
                        }
                        if (0x80 <= read && read <= 0xBF) {
                            // The single occurrence of BF below is also GBK
                            break;
                        }
                        if (0xC0 <= read && read <= 0xDF) {
                            read = bis.read();
                            if (0x80 > read || read > 0xBF) {
                                break;
                            }
                            // Double byte (0xC0-0xDF) (0x80-0xBF), which may also be in GB encoding
                        } else if (0xE0 <= read) {
                            read = bis.read();
                            if (0x80 <= read && read <= 0xBF) {
                                read = bis.read();
                                if (0x80 <= read && read <= 0xBF) {
                                    charset = "UTF-8";
                                }
                            }
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return charset;
    }

    /**
     * Get temporary file path (absolute path).
     *
     * @return Temporary file path
     */
    public static String getTmpDirPath() {
        return System.getProperty("java.io.tmpdir");
    }

    /**
     * Create and upload temporary files.
     *
     * @return temporary files
     * @throws IOException io exception
     */
    public static Path createUploadTempFile() throws IOException {
        return createUploadTempFile(IdUtil.objectId(), TMP_SUFFIX);
    }

    /**
     * Create and upload temporary files.
     *
     * @param prefix – Prefix string used to generate file names; May be null
     * @param suffix – The suffix string used to generate the file name; May be null, use ". tmp" in this case
     * @return temporary files
     * @throws IOException io exception
     */
    public static Path createUploadTempFile(String prefix, String suffix) throws IOException {
        return createTempFile(prefix, suffix, TMP_FOLDER_NAME, UPLOAD_TEMP);
    }

    /**
     * Create temporary file.
     *
     * @param prefix Prefix string used to generate file names; May be null
     * @param suffix The suffix string used to generate the file name; May be null, use ". tmp" in this case
     * @param more   The additional string to concatenate to form the path string
     * @return temporary file
     * @throws IOException io exception
     */
    public static Path createTempFile(String prefix, String suffix, String... more)
        throws IOException {
        Path tempPath = Files.createDirectories(Paths.get(getTmpDirPath(), more));
        return Files.createTempFile(tempPath, prefix, suffix);
    }

    /**
     * Calculate file size.
     * <p>
     * Note: the flow will be destroyed after calculation
     * </p>
     *
     * @param in input stream
     * @return size
     */
    public static long calculateSize(InputStream in) {
        long size = 0;
        int chunk;
        try {
            byte[] buffer = new byte[1024];
            while ((chunk = in.read(buffer)) != -1) {
                size += chunk;
            }
        } catch (IOException e) {
            throw new RuntimeException("Calculate Stream Size Exception");
        }
        return size;
    }

}

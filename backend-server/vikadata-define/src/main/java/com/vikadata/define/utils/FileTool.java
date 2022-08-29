package com.vikadata.define.utils;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import cn.hutool.core.util.IdUtil;

/**
 * <p>
 * 文件相关工具
 * </p>
 *
 * @author Chambers
 * @date 2020/1/7
 */
public class FileTool {

    // vika临时文件夹名称
    private static final String VIKA_TMP = "vika.tmp";

    // 上传临时文件夹名称
    private static final String UPLOAD_TEMP = "upload";

    // 临时文件默认后缀
    private static final String TMP_SUFFIX = ".tmp";

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
                    //UTF-16LE
                    charset = "Unicode";
                }
                else if (first3Bytes[0] == byte0xfe && first3Bytes[1] == byte0xff) {
                    //UTF-16BE
                    charset = "Unicode";
                }
                else if (first3Bytes[0] == byte0xef && first3Bytes[1] == byte0xbb && first3Bytes[midIndex] == byte0xbf) {
                    charset = "UTF8";
                }
                else {
                    bis.reset();
                    while ((read = bis.read()) != -1) {
                        if (read >= 0xF0) {
                            break;
                        }
                        if (0x80 <= read && read <= 0xBF) {
                            //单独出现BF以下的，也算是GBK
                            break;
                        }
                        if (0xC0 <= read && read <= 0xDF) {
                            read = bis.read();
                            if (0x80 > read || read > 0xBF) {
                                break;
                            }
                            //双字节 (0xC0 - 0xDF) (0x80 - 0xBF),也可能在GB编码内
                        }
                        else if (0xE0 <= read) {
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
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return charset;
    }

    /**
     * 获取临时文件路径（绝对路径）
     *
     * @return 临时文件路径
     */
    public static String getTmpDirPath() {
        return System.getProperty("java.io.tmpdir");
    }

    /**
     * 创建上传临时文件
     *
     * @return 临时文件
     * @throws IOException
     */
    public static Path createUploadTempFile() throws IOException {
        return createUploadTempFile(IdUtil.objectId(), TMP_SUFFIX);
    }

    /**
     * 创建上传临时文件
     *
     * @param prefix – 用于生成文件名的前缀字符串； 可能为null
     * @param suffix – 用于生成文件名的后缀字符串； 可能为null ，在这种情况下使用“ .tmp ”
     * @return 临时文件
     * @throws IOException
     */
    public static Path createUploadTempFile(String prefix, String suffix) throws IOException {
        return createTempFile(prefix, suffix, VIKA_TMP, UPLOAD_TEMP);
    }

    /**
     * 创建临时文件
     * @param prefix 用于生成文件名的前缀字符串； 可能为null
     * @param suffix 用于生成文件名的后缀字符串； 可能为null ，在这种情况下使用“ .tmp ”
     * @param more   要连接的附加字符串以形成路径字符串
     * @return 临时文件
     * @throws IOException
     */
    public static Path createTempFile(String prefix, String suffix, String... more) throws IOException {
        Path tempPath = Files.createDirectories(Paths.get(getTmpDirPath(), more));
        return Files.createTempFile(tempPath, prefix, suffix);
    }

    /**
     * 计算文件大小
     * <p>
     *     注意：计算后会破坏流
     * </p>
     * @param in 输入流
     * @return 大小
     */
    public static long calculateSize(InputStream in) {
        long size = 0;
        int chunk;
        try {
            byte[] buffer = new byte[1024];
            while ((chunk = in.read(buffer)) != -1) {
                size += chunk;
            }
        }
        catch (IOException e) {
            throw new RuntimeException("Calculate Stream Size Exception");
        }
        return size;
    }

}

package com.vikadata.define.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ObjectUtil;

/**
 * <p>
 * 输入流缓存
 * 考虑大量图片处理时候内存是否爆满
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/3 18:29
 */
public class InputStreamCache implements AutoCloseable {

    /**
     * 将InputStream中的字节保存到ByteArrayOutputStream中。
     */
    private ByteArrayOutputStream byteArrayOutputStream = null;

    /**
     * 自动转存的临时文件
     */
    private File location = null;

    /**
     * 默认缓存大小 8192
     */
    public static final int DEFAULT_BUFFER_SIZE = 2 << 12;

    /**
     * 自动转存文件大小
     */
    private final long AUTO_TRANSFER_TO_TEMP_SIZE = 50 * 1024 * 1024;

    /**
     * 文件大小
     */
    private long fileSize;

    /**
     * 是否自动转存
     */
    private boolean autoTransfer;

    public InputStreamCache(InputStream inputStream) {
        this(inputStream, -1);
    }

    public InputStreamCache(InputStream inputStream, long fileSize) {
        this.fileSize = fileSize;

        try {
            Objects.requireNonNull(inputStream);

            // 判断大小是否自定转存为临时文件
            if (fileSize >= AUTO_TRANSFER_TO_TEMP_SIZE) {
                location = this.saveToTemp(inputStream);
                this.autoTransfer = true;
            }
            else {
                if (fileSize <= 0) {
                    byteArrayOutputStream = new ByteArrayOutputStream();
                }
                else {
                    byteArrayOutputStream = new ByteArrayOutputStream((int) fileSize);
                }
                byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
                int len;

                while ((len = inputStream.read(buffer)) > -1) {
                    byteArrayOutputStream.write(buffer, 0, len);
                }
                byteArrayOutputStream.flush();
            }
        }
        catch (IOException e) {
            throw new RuntimeException("Cache Stream Read Exception");
        }
    }

    /**
     * 获取可重复使用流
     *
     * @return 可重复使用流
     */
    public InputStream getInputStream() {
        if (this.autoTransfer) {
            if (ObjectUtil.isNull(location)) {
                return null;
            }
            return IoUtil.toStream(location);
        }
        else {
            if (ObjectUtil.isNull(byteArrayOutputStream)) {
                return null;
            }
            // 返回新的字节流
            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        }
    }

    /**
     * 获取文件大小，可能为：0
     *
     * @return long 文件大小
     */
    public long getFileSize() {
        return this.getFileSize(false);
    }

    /**
     * 获取文件大小，compute=true,可能为：0
     * @param compute 是否计算
     * @return long 文件大小
     */
    public long getFileSize(boolean compute) {
        if (this.fileSize <= 0 && compute) {
            return FileTool.calculateSize(getInputStream());
        }
        return this.fileSize;
    }

    /**
     * 获取自动转存状态
     *
     * @return 是否自动转存为临时文件
     */
    public boolean getAutoTransferStatus() {
        return this.autoTransfer;
    }

    /**
     * 保存临时文件
     *
     * @param inputStream 输入流
     * @return 临时文件
     */
    private File saveToTemp(InputStream inputStream) {
        // 转存文件
        File tempFile;
        try {
            tempFile = FileTool.createUploadTempFile().toFile();
            return FileUtil.writeFromStream(inputStream, tempFile);
        }
        catch (IOException e) {
            throw new RuntimeException("Cache Stream Read Exception");
        }
    }

    @Override
    public void close() {
        if (null == location || !getAutoTransferStatus()) {
            return;
        }
        if (FileUtil.exist(location) && location.delete()) {
            location.deleteOnExit();
        }
    }
}

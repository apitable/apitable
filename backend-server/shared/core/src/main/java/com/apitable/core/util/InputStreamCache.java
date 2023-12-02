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

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ObjectUtil;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/**
 * <p>
 * Input stream cache.
 * Consider whether the memory is full when processing a large number of images.
 * </p>
 */
public class InputStreamCache implements AutoCloseable {

    /**
     * save the bytes in the InputStream to the ByteArrayOutputStream.
     */
    private ByteArrayOutputStream byteArrayOutputStream = null;

    /**
     * automatic transfer of temporary files.
     */
    private File location = null;

    /**
     * default cache size 8192.
     */
    public static final int DEFAULT_BUFFER_SIZE = 2 << 12;

    /**
     * Auto-dump file size.
     */
    private static final long AUTO_TRANSFER_TO_TEMP_SIZE = 50 * 1024 * 1024;

    /**
     * file size.
     */
    private final long fileSize;

    /**
     * Whether to automatically transfer.
     */
    private boolean autoTransfer;

    public InputStreamCache(InputStream inputStream) {
        this(inputStream, -1);
    }

    /**
     * Constructor.
     *
     * @param inputStream input stream
     * @param fileSize    file size
     */
    public InputStreamCache(InputStream inputStream, long fileSize) {
        this.fileSize = fileSize;

        try {
            Objects.requireNonNull(inputStream);

            // Determines whether the size is self-determined and saved as a temporary file
            if (fileSize >= AUTO_TRANSFER_TO_TEMP_SIZE) {
                location = this.saveToTemp(inputStream);
                this.autoTransfer = true;
            } else {
                if (fileSize <= 0) {
                    byteArrayOutputStream = new ByteArrayOutputStream();
                } else {
                    byteArrayOutputStream = new ByteArrayOutputStream((int) fileSize);
                }
                byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
                int len;

                while ((len = inputStream.read(buffer)) > -1) {
                    byteArrayOutputStream.write(buffer, 0, len);
                }
                byteArrayOutputStream.flush();
            }
        } catch (IOException e) {
            throw new RuntimeException("Cache Stream Read Exception");
        }
    }

    /**
     * Get reusable stream.
     *
     * @return reusable stream
     */
    public InputStream getInputStream() {
        if (this.autoTransfer) {
            if (ObjectUtil.isNull(location)) {
                return null;
            }
            return IoUtil.toStream(location);
        } else {
            if (ObjectUtil.isNull(byteArrayOutputStream)) {
                return null;
            }
            // return a new byte stream
            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        }
    }

    /**
     * Get the file size, which may be: 0.
     *
     * @return long file size
     */
    public long getFileSize() {
        return this.getFileSize(false);
    }

    /**
     * Get the file size, compute=true, possibly: 0.
     *
     * @param compute calculate or not
     * @return long file size
     */
    public long getFileSize(boolean compute) {
        if (this.fileSize <= 0 && compute) {
            return FileTool.calculateSize(getInputStream());
        }
        return this.fileSize;
    }

    /**
     * Get automatic deposit status.
     *
     * @return Auto save as temporary file
     */
    public boolean getAutoTransferStatus() {
        return this.autoTransfer;
    }

    /**
     * Save temporary file.
     *
     * @param inputStream input stream
     * @return temporary file
     */
    private File saveToTemp(InputStream inputStream) {
        // transfer file
        File tempFile;
        try {
            tempFile = FileTool.createUploadTempFile().toFile();
            return FileUtil.writeFromStream(inputStream, tempFile);
        } catch (IOException e) {
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

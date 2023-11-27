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

import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Optional;
import java.util.Scanner;

/**
 * <p>
 * MimeType Matching tool.
 * </p>
 */
public class MimeTypeMapping {

    /**
     * Hashmaps with registered extensions and mime types.
     */
    private static final HashMap<String, String> fileExtensionToMimeType;

    /**
     * Hashmaps with registered extensions and mime types.
     */
    private static final HashMap<String, String> mimeTypeToFileExtension;

    static {
        String[] lines = readMimeTypeLines();

        final int expectedMimeTypesCount = lines.length;
        fileExtensionToMimeType = new HashMap<>(expectedMimeTypesCount);
        mimeTypeToFileExtension = new HashMap<>(expectedMimeTypesCount);

        for (String line : lines) {
            registerMimeTypeLine(line);
        }
    }

    /**
     * Get mime type that matches filename extension.
     * </p>
     * For example, {@code extensionToMimeType("jpeg")} will result in "image/jpeg".
     *
     * @param extension filename extension to find mime type for
     * @return mime type, if there exists known mime type for specified extension or {@code null} if no mime type is known
     */
    public static String extensionToMimeType(String extension) {
        return fileExtensionToMimeType.get(extension);
    }

    /**
     * Get filename extension that matches mime type.
     * </p>
     * For example, {@code mimeTypeToExtension("image/jpeg")} will result in "jpeg"
     * without dot symbol before extension.
     *
     * @param mimeType mime type to find filename extension for
     * @return filename extension, if there exists known extension for specified mime type or {@code null} if no extension is known
     */
    public static String mimeTypeToExtension(String mimeType) {
        String suffix = mimeTypeToFileExtension.get(mimeType);
        return Optional.ofNullable(suffix).orElse(mimeType);
    }

    /**
     * Get text of mime.types file as array of strings.
     * </p>
     * mime.types file must packaged as resource. It is not read from filesystem.
     *
     * @return Array of lines from mime.types text file
     */
    private static String[] readMimeTypeLines() {
        InputStream mimeTypeStream = MimeTypeMapping.class.getResourceAsStream("/mime/mime.types");

        Scanner s = new Scanner(mimeTypeStream);
        s.useDelimiter("\\A");
        String body = s.hasNext() ? s.next() : "";
        s.close();

        return body.split("\n");
    }

    /**
     * Split single lime from mime.types file and register its values in hashmaps.
     */
    private static void registerMimeTypeLine(String line) {
        line = line.trim();

        if (line.isEmpty()) {
            // Skip empty lines
            return;
        }

        //noinspection AlibabaUndefineMagicConstant
        if (line.charAt(0) == '#') {
            // Skip comments
            return;
        }

        String[] parts = line.split("\\s+");

        if (parts.length < 2) {
            // Skip lines without mimeType and file extension association
            return;
        }

        String mimeType = parts[0];
        String[] extensions = Arrays.copyOfRange(parts, 1, parts.length);

        register(mimeType, extensions);
    }

    /**
     * Register mime type and associated filename extensions in hashmaps.
     */
    private static void register(String mimeType, String[] extensions) {
        for (String extension : extensions) {
            if (!fileExtensionToMimeType.containsKey(extension)) {
                fileExtensionToMimeType.put(extension, mimeType);
            }

            if (!mimeTypeToFileExtension.containsKey(mimeType)) {
                mimeTypeToFileExtension.put(mimeType, extension);
            }
        }
    }
}

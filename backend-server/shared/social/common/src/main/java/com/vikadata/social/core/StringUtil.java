package com.vikadata.social.core;

/**
 * string util
 * @author Shawn Deng
 */
public class StringUtil {

    private static final String SLASH = "/";

    public static String trimSlash(String path) {
        // Clear the first slash
        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        if (path.length() == 0) {
            return path;
        }

        // Clear last slash
        int endPos = path.length() - 1;
        while (endPos >= 0 && path.charAt(endPos) == '/') {
            endPos--;
        }

        return path.substring(0, endPos + 1);
    }

    public static String fixBasePath(String path) {
        String basePath = path;
        if (SLASH.equals(basePath)) {
            throw new IllegalStateException("It cannot be set as a root path request to avoid affecting the application: " + path);
        }

        // Remove symbols with duplicate suffixes
        while (basePath.endsWith(SLASH)) {
            basePath = basePath.substring(0, basePath.length() - 1);
        }

        if (basePath.length() == 0) {
            throw new IllegalStateException("You have not set the application request basic path, path: " + path);
        }

        // Prefix autocompletion
        if (!basePath.startsWith(SLASH)) {
            basePath = SLASH + basePath;
        }

        return basePath;
    }
}

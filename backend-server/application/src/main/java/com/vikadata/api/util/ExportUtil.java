package com.vikadata.api.util;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import com.vikadata.core.util.HttpContextUtil;

/**
 * <p>
 * export util
 * </p>
 *
 * @author Chambers
 */
public class ExportUtil {

    public static void exportBytes(byte[] bytes, String filename, String contentType) throws IOException {
        HttpServletResponse response = HttpContextUtil.getResponse();
        OutputStream out = null;
        try {
            if (response != null) {
                if (contentType != null) {
                    response.setContentType(contentType);
                }
                response.setHeader("content-disposition", "attachment;filename=" + filename);
                out = response.getOutputStream();
                out.write(bytes);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
}

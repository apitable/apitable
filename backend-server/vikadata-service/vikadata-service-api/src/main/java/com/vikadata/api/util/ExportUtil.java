package com.vikadata.api.util;

import com.vikadata.core.util.HttpContextUtil;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

/**
 * <p>
 * 通用输出工具类
 * </p>
 *
 * @author Chambers
 * @date 2019/12/13
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

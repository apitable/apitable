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

package com.apitable.shared.util;

import com.apitable.core.util.HttpContextUtil;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

/**
 * <p>
 * export util.
 * </p>
 *
 * @author Chambers
 */
public class ExportUtil {

    /**
     * export bytes.
     *
     * @param bytes       bytes
     * @param filename    filename
     * @param contentType content type
     * @throws IOException throws exception if error
     */
    public static void exportBytes(byte[] bytes, String filename, String contentType)
        throws IOException {
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
            // ignore
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
}

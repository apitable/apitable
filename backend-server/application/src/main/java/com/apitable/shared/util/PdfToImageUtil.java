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

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * PDF to Image util.
 * </p>
 *
 * @author Shawn Deng
 */
public class PdfToImageUtil {

    private static final Logger LOG = LoggerFactory.getLogger(PdfToImageUtil.class);

    /**
     * <p>
     * Convert pdf to image.
     * </p>
     *
     * @param pdfIn pdf input stream
     * @return image input stream
     */
    public static InputStream convert(InputStream pdfIn) {
        PDDocument document = null;
        try {
            document = Loader.loadPDF(new RandomAccessReadBuffer(pdfIn));
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImage(0, 0.5f);
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "JPEG", os);
            return new ByteArrayInputStream(os.toByteArray());
        } catch (IOException e) {
            LOG.error("unable to load pdf", e);
            return null;
        } finally {
            if (document != null) {
                try {
                    document.close();
                } catch (IOException e) {
                    LOG.error("close pd document stream exception", e);
                }
            }
        }
    }
}

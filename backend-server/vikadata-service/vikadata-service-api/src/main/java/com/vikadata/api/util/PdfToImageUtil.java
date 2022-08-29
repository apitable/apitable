package com.vikadata.api.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * PDF 转 Image 工具
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/3 19:17
 */
public class PdfToImageUtil {

    private static final Logger LOG = LoggerFactory.getLogger(PdfToImageUtil.class);

    public static InputStream convert(InputStream pdfIn) {
        PDDocument document = null;
        try {
            document = PDDocument.load(pdfIn);
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImage(0, 0.5f);
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "JPEG", os);
            return new ByteArrayInputStream(os.toByteArray());
        }
        catch (IOException e) {
            LOG.error("无法加载PDF", e);
            return null;
        }
        finally {
            if (document != null) {
                try {
                    document.close();
                }
                catch (IOException e) {
                    e.printStackTrace();
                    LOG.error("关闭PDDocument流异常", e);
                }
            }
        }
    }
}

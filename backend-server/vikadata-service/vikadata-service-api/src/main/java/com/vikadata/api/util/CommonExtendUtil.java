package com.vikadata.api.util;

import cn.hutool.core.util.StrUtil;
import com.vikadata.api.constants.FileSuffixConstants;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

/**
 * 通用扩展工具类
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public class CommonExtendUtil {


    /**
     * 数组字符串（包括中括号[]）转换为字符串数组String[]
     *
     * @param object 数组字符串
     * @return 随机字符串
     */
    public static String[] arrayStrConvertToArray(String object) {
        String replace = object.replaceAll("[\\[\\]]", "").replaceAll("\"", "");
        return replace.split(",");

    }

    public static String uploadFilePath(String spaceId, String filePrefix, String fileSuffix) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String path = formatter.format(LocalDate.now());
        String customPath = spaceId;
        if (StrUtil.isBlank(spaceId)) {
            customPath = isImage(fileSuffix) ? "image" : "file";
        }
        String newFileName = StrUtil.join(".", filePrefix, fileSuffix);
        return StrUtil.format("{}/{}/{}", customPath, path, newFileName);
    }

    private static boolean isImage(String fileSuffix) {
        List<String> list = Arrays.asList(FileSuffixConstants.BMP, FileSuffixConstants.JPG, FileSuffixConstants.JPEG,
            FileSuffixConstants.PNG, FileSuffixConstants.GIF);
        return list.contains(fileSuffix);
    }
}

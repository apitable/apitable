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

package com.apitable.starter.oss.core;

import cn.hutool.core.date.DateUtil;
import com.qiniu.cdn.CdnManager;
import com.qiniu.common.QiniuException;
import java.time.Instant;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * oss signature template.
 */
public class OssSignatureTemplate {

    private String encryptKey;

    private Integer expireSecond;

    public OssSignatureTemplate() {
    }

    public OssSignatureTemplate(String encryptKey, Integer expireSecond) {
        this.encryptKey = encryptKey;
        this.expireSecond = expireSecond;
    }

    public String getSignatureUrl(String host, String fileName) {
        return this.getSignatureUrl(host, fileName, Long.valueOf(expireSecond));
    }

    /**
     * Get the signed URL of the file.
     *
     * @param host     domain name
     * @param fileName file name
     * @param expires  expiration time
     * @return signed URL
     */
    public String getSignatureUrl(String host, String fileName, Long expires) {
        fileName = regexSignatureUrl(fileName);
        // timestamp anti leech
        try {
            Date expireDate = Date.from(Instant.now().plusSeconds(expires));
            return CdnManager.createTimestampAntiLeechUrl(host, fileName, null,
                encryptKey, DateUtil.toInstant(expireDate).getEpochSecond());
        } catch (QiniuException e) {
            // ignore
            return null;
        }
    }

    /**
     * Regularly signed URL，
     * Remove the domain name part and the question mark and its following content in the file name.
     *
     * @param fileName file name
     * @return regular signed URL
     */
    public String regexSignatureUrl(String fileName) {
        // Create the first regular expression pattern to match the domain name part
        String domainRegex = "https://[^/]+/";
        Pattern pattern = Pattern.compile(domainRegex);

        // Create Matcher object
        Matcher matcher = pattern.matcher(fileName);

        // Replace the matching domain name part with an empty string
        String result = matcher.replaceAll("");

        String questionMarkRegex = "\\?.*";
        pattern = Pattern.compile(questionMarkRegex);

        matcher = pattern.matcher(result);

        // Replace the matching question mark and its following content with an empty string
        result = matcher.replaceAll("");
        return result;
    }
}

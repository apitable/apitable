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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    public String getSignatureUrl(String host, String fileName, Long expires) {
        // timestamp anti leech
        try {
            Date expireDate = Date.from(Instant.now().plusSeconds(expires));
            return CdnManager.createTimestampAntiLeechUrl(host, fileName, null,
                encryptKey, DateUtil.toInstant(expireDate).getEpochSecond());
        } catch (QiniuException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> getSignatureUrls(String host, List<String> resourceKeys) {
        List signatureUrls = new ArrayList<>();
        for (String key : resourceKeys) {
            String signatureUrl = this.getSignatureUrl(host, key);
            if (signatureUrl != null) {
                signatureUrls.add(signatureUrl);
            }
        }
        return signatureUrls;
    }
}

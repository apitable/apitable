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

package com.apitable.starter.oss.core.qiniu;

import com.qiniu.util.Auth;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssClientRequestFactory;

public class QiniuOssClientRequestFactory implements OssClientRequestFactory {

    private final Auth auth;

    private final String regionId;

    private final String downloadDomain;

    private final String callbackUrl;

    private final String callbackBodyType;

    private final String uploadUrl;

    public QiniuOssClientRequestFactory(Auth auth, String regionId, String downloadDomain, String callbackUrl, String callbackBodyType, String uploadUrl) {
        this.auth = auth;
        this.regionId = regionId;
        this.downloadDomain = downloadDomain;
        this.callbackUrl = callbackUrl;
        this.callbackBodyType = callbackBodyType;
        this.uploadUrl = uploadUrl;
    }

    @Override
    public OssClientRequest createClient() {
        return new QiniuOssClientRequest(auth, regionId, downloadDomain, callbackUrl, callbackBodyType, uploadUrl, true);
    }
}

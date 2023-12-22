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

package com.apitable.starter.mail.core;

import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.ses.v20201002.SesClient;

/**
 * tencent ses client accessor.
 */
public abstract class TencentSesClientAccessor {

    private static final String ENDPOINT = "ses.tencentcloudapi.com";

    private final String region;

    private final String secretId;

    private final String secretKey;

    protected String from;

    protected String reply;

    /**
     * constructor.
     *
     * @param region    region
     * @param secretId  secret id
     * @param secretKey secret key
     * @param from      from
     * @param reply     reply
     */
    public TencentSesClientAccessor(String region, String secretId, String secretKey, String from,
                                    String reply) {
        this.region = region;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.from = from;
        this.reply = reply;
    }

    protected SesClient getClient() {
        // instantiate an authentication object
        Credential cred = new Credential(secretId, secretKey);

        // instantiate a http option
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setEndpoint(ENDPOINT);

        // Instantiate a client option
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setHttpProfile(httpProfile);

        // instantiate the client object of the requested product
        return new SesClient(cred, region, clientProfile);
    }
}

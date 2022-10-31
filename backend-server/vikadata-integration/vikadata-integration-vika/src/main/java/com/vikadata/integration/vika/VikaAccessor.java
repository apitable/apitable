package com.vikadata.integration.vika;

import cn.vika.client.api.VikaApiClient;
import cn.vika.client.api.http.ApiCredential;
import cn.vika.client.api.http.ApiHttpClient;
import cn.vika.client.api.http.ApiHttpClient.ApiVersion;

/**
 * <p>
 * vika sdk abstract class
 * </p>
 *
 */
public abstract class VikaAccessor {

    private final String hostUrl;

    private final String token;

    public VikaAccessor(String hostUrl, String token) {
        this.hostUrl = hostUrl;
        this.token = token;
    }

    protected VikaApiClient getClient() {
        ApiCredential credential = new ApiCredential(token);
        return hostUrl != null && !hostUrl.isEmpty() ? new VikaApiClient(hostUrl, credential) : new VikaApiClient(credential);
    }

    protected VikaApiClient getClient(String host, String token) {
        ApiCredential credential = new ApiCredential(token);
        return new VikaApiClient(host, credential);
    }

    protected ExecuteCommandApi getExecuteCommandApi() {
        ApiCredential credential = new ApiCredential(token);
        return new ExecuteCommandApi(new ApiHttpClient(ApiVersion.V1, hostUrl, credential));
    }

    protected String getHostUrl() {
        return hostUrl;
    }
}

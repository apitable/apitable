package com.vikadata.integration.vika;

import java.util.Map;

import cn.vika.client.api.exception.ApiException;
import cn.vika.client.api.http.AbstractApi;
import cn.vika.client.api.http.ApiHttpClient;
import cn.vika.client.api.model.HttpResult;
import cn.vika.core.http.GenericTypeReference;
import cn.vika.core.http.HttpHeader;

/**
 * <p>
 *  the api for operate executeCommand
 * </p>
 *
 * @author Pengap
 * @date 2022/2/18 14:27:29
 */
public class ExecuteCommandApi extends AbstractApi {

    private static final String PATH = "/datasheets/%s/executeCommand";

    public ExecuteCommandApi(ApiHttpClient apiHttpClient) {
        super(apiHttpClient);
    }

    public <T> HttpResult<T> executeCommand(String datasheetId, Map<String, Object> request) throws ApiException {
        return getDefaultHttpClient().post(String.format(PATH, datasheetId), new HttpHeader(), request, new GenericTypeReference<HttpResult<T>>() {});
    }

}

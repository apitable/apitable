package com.vikadata.integration.yozo;

import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class YozoTemplate {

    private YozoConfig config;

    private RestTemplate restTemplate;

    public YozoTemplate(YozoConfig config) {
        this.config = config;
        restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new OkHttp3ClientHttpRequestFactory());
    }

    public YozoConfig getConfig() {
        return config;
    }

    public String preview(String fileUrl) throws YozoApiException {
        String officePreviewApiUrl = config.getUri().getPreview() + "?k=%s&url=%s";
        String previewApiUrl = String.format(officePreviewApiUrl, config.getKey(), fileUrl);
        try {
            YozoPreviewResponse response = restTemplate.getForObject(previewApiUrl, YozoPreviewResponse.class);
            handleResponse(response);
            if (response.getData() == null) {
                throw new YozoApiException("file preview failed");
            }
            return response.getData().getData();
        }
        catch (RestClientException exception) {
            // request was aborted
            throw new YozoApiException("request was aborted", exception);
        }
    }

    protected <T extends YozoBaseResponse> void handleResponse(T response) {
        if (response == null) {
            throw new YozoApiException("no response content");
        }
        if (response.getErrorCode() != 0) {
            throw new YozoApiException(String.format("request was aborted, ErrorCode: %d, Message: %s", response.getErrorCode(), response.getMessage()));
        }
    }
}

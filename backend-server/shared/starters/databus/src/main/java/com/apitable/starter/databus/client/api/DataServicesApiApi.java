package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;

import com.apitable.starter.databus.client.model.ApiResponseDatasheetPackSO;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@jakarta.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class DataServicesApiApi {
    private ApiClient apiClient;

    public DataServicesApiApi() {
        this(new ApiClient());
    }

    public DataServicesApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * 
     * 
     * <p><b>200</b> - get data pack data
     * @param id datasheet id (required)
     * @param userId  (optional)
     * @param spaceId  (optional)
     * @param viewId  (optional)
     * @return ApiResponseDatasheetPackSO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseDatasheetPackSO getDatasheetPack(String id, String userId, String spaceId, String viewId) throws RestClientException {
        return getDatasheetPackWithHttpInfo(id, userId, spaceId, viewId).getBody();
    }

    /**
     * 
     * 
     * <p><b>200</b> - get data pack data
     * @param id datasheet id (required)
     * @param userId  (optional)
     * @param spaceId  (optional)
     * @param viewId  (optional)
     * @return ResponseEntity&lt;ApiResponseDatasheetPackSO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseDatasheetPackSO> getDatasheetPackWithHttpInfo(String id, String userId, String spaceId, String viewId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'id' is set
        if (id == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'id' when calling getDatasheetPack");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("id", id);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "userId", userId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "spaceId", spaceId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "viewId", viewId));


        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseDatasheetPackSO> localReturnType = new ParameterizedTypeReference<ApiResponseDatasheetPackSO>() {};
        return apiClient.invokeAPI("/databus/get_datasheet_pack/{id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * 
     * 
     * <p><b>200</b> - Patch completed
     * <p><b>406</b> - Not accepted
     * @param dstId  (optional)
     * @param userId  (optional)
     * @param spaceId  (optional)
     * @param viewId  (optional)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getRecords(String dstId, String userId, String spaceId, String viewId) throws RestClientException {
        getRecordsWithHttpInfo(dstId, userId, spaceId, viewId);
    }

    /**
     * 
     * 
     * <p><b>200</b> - Patch completed
     * <p><b>406</b> - Not accepted
     * @param dstId  (optional)
     * @param userId  (optional)
     * @param spaceId  (optional)
     * @param viewId  (optional)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getRecordsWithHttpInfo(String dstId, String userId, String spaceId, String viewId) throws RestClientException {
        Object localVarPostBody = null;
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "dstId", dstId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "userId", userId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "spaceId", spaceId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "viewId", viewId));


        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/get_records", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

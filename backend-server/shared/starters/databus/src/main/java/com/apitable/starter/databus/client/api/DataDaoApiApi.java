package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;

import com.apitable.starter.databus.client.model.ApiResponseAiPO;

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
public class DataDaoApiApi {
    private ApiClient apiClient;

    public DataDaoApiApi() {
        this(new ApiClient());
    }

    public DataDaoApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get AI&#39;s binding datasheet ids by AI ID
     * Get AI&#39;s binding datasheet ids by AI ID
     * <p><b>200</b> - Get AI&#39;s datasheets success
     * @param aiId ai id (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetAiDatasheetIds(String aiId) throws RestClientException {
        daoGetAiDatasheetIdsWithHttpInfo(aiId);
    }

    /**
     * Get AI&#39;s binding datasheet ids by AI ID
     * Get AI&#39;s binding datasheet ids by AI ID
     * <p><b>200</b> - Get AI&#39;s datasheets success
     * @param aiId ai id (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetAiDatasheetIdsWithHttpInfo(String aiId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'aiId' is set
        if (aiId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'aiId' when calling daoGetAiDatasheetIds");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("ai_id", aiId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/get_ai_datasheet_ids/{ai_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get AI Node by AI ID
     * Get AI Node by AI ID
     * <p><b>200</b> - Get AI Node success
     * @param aiId ai id (required)
     * @param nodeId node id (required)
     * @return ApiResponseAiPO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAiPO daoGetAiNode(String aiId, String nodeId) throws RestClientException {
        return daoGetAiNodeWithHttpInfo(aiId, nodeId).getBody();
    }

    /**
     * Get AI Node by AI ID
     * Get AI Node by AI ID
     * <p><b>200</b> - Get AI Node success
     * @param aiId ai id (required)
     * @param nodeId node id (required)
     * @return ResponseEntity&lt;ApiResponseAiPO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAiPO> daoGetAiNodeWithHttpInfo(String aiId, String nodeId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'aiId' is set
        if (aiId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'aiId' when calling daoGetAiNode");
        }
        
        // verify the required parameter 'nodeId' is set
        if (nodeId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'nodeId' when calling daoGetAiNode");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "ai_id", aiId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "node_id", nodeId));


        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAiPO> localReturnType = new ParameterizedTypeReference<ApiResponseAiPO>() {};
        return apiClient.invokeAPI("/databus/dao/get_ai_node", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get AI Entity by AI ID
     * Get AI Entity by AI ID
     * <p><b>200</b> - Get AI success
     * @param aiId ai id (required)
     * @return ApiResponseAiPO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAiPO daoGetAiPo(String aiId) throws RestClientException {
        return daoGetAiPoWithHttpInfo(aiId).getBody();
    }

    /**
     * Get AI Entity by AI ID
     * Get AI Entity by AI ID
     * <p><b>200</b> - Get AI success
     * @param aiId ai id (required)
     * @return ResponseEntity&lt;ApiResponseAiPO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAiPO> daoGetAiPoWithHttpInfo(String aiId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'aiId' is set
        if (aiId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'aiId' when calling daoGetAiPo");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("ai_id", aiId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAiPO> localReturnType = new ParameterizedTypeReference<ApiResponseAiPO>() {};
        return apiClient.invokeAPI("/databus/dao/get_ai/{ai_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get Datasheet&#39;s Revision number
     * Get Datasheet&#39;s Revision number
     * <p><b>200</b> - Get Revision number success
     * @param datasheetId datasheet_id (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetRevision(String datasheetId) throws RestClientException {
        daoGetRevisionWithHttpInfo(datasheetId);
    }

    /**
     * Get Datasheet&#39;s Revision number
     * Get Datasheet&#39;s Revision number
     * <p><b>200</b> - Get Revision number success
     * @param datasheetId datasheet_id (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetRevisionWithHttpInfo(String datasheetId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'datasheetId' is set
        if (datasheetId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'datasheetId' when calling daoGetRevision");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("datasheet_id", datasheetId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/get_revision/{datasheet_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

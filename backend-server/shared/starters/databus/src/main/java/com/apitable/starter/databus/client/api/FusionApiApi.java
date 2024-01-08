package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;
import com.apitable.starter.databus.client.model.ApiResponseRecordDTOs;
import com.apitable.starter.databus.client.model.CellFormatEnum;
import com.apitable.starter.databus.client.model.FieldCreateRo;
import com.apitable.starter.databus.client.model.FieldKeyEnum;
import com.apitable.starter.databus.client.model.ListVO;
import com.apitable.starter.databus.client.model.RecordUpdateRO;
import com.apitable.starter.databus.client.model.SortRO;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

@jakarta.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class FusionApiApi {
    private ApiClient apiClient;

    public FusionApiApi() {
        this(new ApiClient());
    }

    public FusionApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Add multiple rows to a specified datasheet
     * Add multiple rows to a specified datasheet  Up to 10 records can be created in a single request. You need to bring &#x60;Content-Type: application/json&#x60; in the Request Header to submit data in raw json format. The POST data is a JSON object, which should contain an array: &#x60;records&#x60;, the records array contains multiple records to be created. The object &#x60;fields&#x60; contains the values of the fields to be created in a record, and can contain any number of field values, not necessarily all of them. If there are field defaults set, field values that are not passed in will be saved according to the default values at the time the fields were set.
     * <p><b>200</b> - Add multiple rows to a specified datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void addRecords(String dstId, String authorization, RecordUpdateRO recordUpdateRO) throws RestClientException {
        addRecordsWithHttpInfo(dstId, authorization, recordUpdateRO);
    }

    /**
     * Add multiple rows to a specified datasheet
     * Add multiple rows to a specified datasheet  Up to 10 records can be created in a single request. You need to bring &#x60;Content-Type: application/json&#x60; in the Request Header to submit data in raw json format. The POST data is a JSON object, which should contain an array: &#x60;records&#x60;, the records array contains multiple records to be created. The object &#x60;fields&#x60; contains the values of the fields to be created in a record, and can contain any number of field values, not necessarily all of them. If there are field defaults set, field values that are not passed in will be saved according to the default values at the time the fields were set.
     * <p><b>200</b> - Add multiple rows to a specified datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> addRecordsWithHttpInfo(String dstId, String authorization, RecordUpdateRO recordUpdateRO) throws RestClientException {
        Object localVarPostBody = recordUpdateRO;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling addRecords");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling addRecords");
        }
        
        // verify the required parameter 'recordUpdateRO' is set
        if (recordUpdateRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'recordUpdateRO' when calling addRecords");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/records", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Create Datasheet
     * Create Datasheet  Create Datasheet and their fields
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createDatasheet(String spaceId, String authorization) throws RestClientException {
        createDatasheetWithHttpInfo(spaceId, authorization);
    }

    /**
     * Create Datasheet
     * Create Datasheet  Create Datasheet and their fields
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createDatasheetWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createDatasheet");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createDatasheet");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/datasheets", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_fields
     * create_fields  create_fields
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param fieldCreateRo  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createFields(String spaceId, String dstId, String authorization, FieldCreateRo fieldCreateRo) throws RestClientException {
        createFieldsWithHttpInfo(spaceId, dstId, authorization, fieldCreateRo);
    }

    /**
     * create_fields
     * create_fields  create_fields
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param fieldCreateRo  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createFieldsWithHttpInfo(String spaceId, String dstId, String authorization, FieldCreateRo fieldCreateRo) throws RestClientException {
        Object localVarPostBody = fieldCreateRo;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createFields");
        }
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling createFields");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createFields");
        }
        
        // verify the required parameter 'fieldCreateRo' is set
        if (fieldCreateRo == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'fieldCreateRo' when calling createFields");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/datasheets/{dst_id}/fields", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Delete field
     * Delete field  Delete field
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param dstId dst_id (required)
     * @param fieldId field_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteFields(String spaceId, String dstId, String fieldId, String authorization) throws RestClientException {
        deleteFieldsWithHttpInfo(spaceId, dstId, fieldId, authorization);
    }

    /**
     * Delete field
     * Delete field  Delete field
     * <p><b>200</b> - Get Datasheet Fields
     * @param spaceId space_id (required)
     * @param dstId dst_id (required)
     * @param fieldId field_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteFieldsWithHttpInfo(String spaceId, String dstId, String fieldId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling deleteFields");
        }
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling deleteFields");
        }
        
        // verify the required parameter 'fieldId' is set
        if (fieldId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'fieldId' when calling deleteFields");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteFields");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("dst_id", dstId);
        uriVariables.put("field_id", fieldId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/datasheets/{dst_id}/fields/{field_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Delete records
     * Delete records  Delete a number of records from a datasheet
     * <p><b>200</b> - Get Datasheet successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteRecords(String dstId, String authorization) throws RestClientException {
        deleteRecordsWithHttpInfo(dstId, authorization);
    }

    /**
     * Delete records
     * Delete records  Delete a number of records from a datasheet
     * <p><b>200</b> - Get Datasheet successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteRecordsWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling deleteRecords");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteRecords");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/records", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Create the op of the resource
     * Create the op of the resource  For flexibility reasons and for internal automation testing, provide an interface to freely create commands
     * <p><b>200</b> - execute_command successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void executeCommand(String dstId, String authorization) throws RestClientException {
        executeCommandWithHttpInfo(dstId, authorization);
    }

    /**
     * Create the op of the resource
     * Create the op of the resource  For flexibility reasons and for internal automation testing, provide an interface to freely create commands
     * <p><b>200</b> - execute_command successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> executeCommandWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling executeCommand");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling executeCommand");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/executeCommand", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Query all fields of a datasheet
     * Query all fields of a datasheet  All lines of the doc comment will be included to operation description.
     * <p><b>200</b> - Get Datasheet Fields
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getFields(String dstId, String authorization) throws RestClientException {
        getFieldsWithHttpInfo(dstId, authorization);
    }

    /**
     * Query all fields of a datasheet
     * Query all fields of a datasheet  All lines of the doc comment will be included to operation description.
     * <p><b>200</b> - Get Datasheet Fields
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getFieldsWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling getFields");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getFields");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/fields", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get_nodes
     * get_nodes  Query the list of space station level 1 document nodes
     * <p><b>200</b> - get_nodes successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getNodes(String spaceId, String authorization) throws RestClientException {
        getNodesWithHttpInfo(spaceId, authorization);
    }

    /**
     * get_nodes
     * get_nodes  Query the list of space station level 1 document nodes
     * <p><b>200</b> - get_nodes successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getNodesWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling getNodes");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getNodes");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/nodes", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get_presigned_url
     * get_presigned_url  Get the pre-signed URL of the datasheet attachment
     * <p><b>200</b> - get_presigned_url successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getPresignedUrl(String dstId, String authorization) throws RestClientException {
        getPresignedUrlWithHttpInfo(dstId, authorization);
    }

    /**
     * get_presigned_url
     * get_presigned_url  Get the pre-signed URL of the datasheet attachment
     * <p><b>200</b> - get_presigned_url successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getPresignedUrlWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling getPresignedUrl");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getPresignedUrl");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/attachments/presignedUrl", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get multiple records of a datasheet
     * Get multiple records of a datasheet
     * <p><b>200</b> - Get Datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param pageSize  (optional)
     * @param maxRecords  (optional)
     * @param pageNum  (optional)
     * @param sort  (optional)
     * @param recordIds  (optional)
     * @param viewId  (optional)
     * @param fields  (optional)
     * @param filterByFormula  (optional)
     * @param cellFormat  (optional)
     * @param fieldKey  (optional)
     * @return ApiResponseRecordDTOs
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseRecordDTOs getRecordByDatasheetId(String dstId, String authorization, Integer pageSize, Integer maxRecords, Integer pageNum, List<SortRO> sort, List<String> recordIds, String viewId, List<String> fields, String filterByFormula, CellFormatEnum cellFormat, FieldKeyEnum fieldKey) throws RestClientException {
        return getRecordByDatasheetIdWithHttpInfo(dstId, authorization, pageSize, maxRecords, pageNum, sort, recordIds, viewId, fields, filterByFormula, cellFormat, fieldKey).getBody();
    }

    /**
     * Get multiple records of a datasheet
     * Get multiple records of a datasheet
     * <p><b>200</b> - Get Datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param pageSize  (optional)
     * @param maxRecords  (optional)
     * @param pageNum  (optional)
     * @param sort  (optional)
     * @param recordIds  (optional)
     * @param viewId  (optional)
     * @param fields  (optional)
     * @param filterByFormula  (optional)
     * @param cellFormat  (optional)
     * @param fieldKey  (optional)
     * @return ResponseEntity&lt;ApiResponseRecordDTOs&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseRecordDTOs> getRecordByDatasheetIdWithHttpInfo(String dstId, String authorization, Integer pageSize, Integer maxRecords, Integer pageNum, List<SortRO> sort, List<String> recordIds, String viewId, List<String> fields, String filterByFormula, CellFormatEnum cellFormat, FieldKeyEnum fieldKey) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling getRecordByDatasheetId");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getRecordByDatasheetId");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "pageSize", pageSize));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "maxRecords", maxRecords));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "pageNum", pageNum));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(ApiClient.CollectionFormat.valueOf("multi".toUpperCase(Locale.ROOT)), "sort", sort));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(ApiClient.CollectionFormat.valueOf("multi".toUpperCase(Locale.ROOT)), "recordIds", recordIds));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "viewId", viewId));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(ApiClient.CollectionFormat.valueOf("multi".toUpperCase(Locale.ROOT)), "fields", fields));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "filterByFormula", filterByFormula));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "cellFormat", cellFormat));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "fieldKey", fieldKey));


        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseRecordDTOs> localReturnType = new ParameterizedTypeReference<ApiResponseRecordDTOs>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/records", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get_spaces
     * get_spaces  Query space list
     * <p><b>200</b> - get_spaces successfully
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getSpaces(String authorization) throws RestClientException {
        getSpacesWithHttpInfo(authorization);
    }

    /**
     * get_spaces
     * get_spaces  Query space list
     * <p><b>200</b> - get_spaces successfully
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getSpacesWithHttpInfo(String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getSpaces");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/spaces", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Query all views of a datasheet
     * Query all views of a datasheet  A datasheet can create up to 30 views and return them all at once when requesting a view, without paging.
     * <p><b>200</b> - Get Datasheet Fields
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getViews(String dstId, String authorization) throws RestClientException {
        getViewsWithHttpInfo(dstId, authorization);
    }

    /**
     * Query all views of a datasheet
     * Query all views of a datasheet  A datasheet can create up to 30 views and return them all at once when requesting a view, without paging.
     * <p><b>200</b> - Get Datasheet Fields
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getViewsWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling getViews");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getViews");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Query Node Details
     * Query Node Details  Query the details of the specified file node
     * <p><b>200</b> - node_detail successfully
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void nodeDetail(String nodeId, String authorization) throws RestClientException {
        nodeDetailWithHttpInfo(nodeId, authorization);
    }

    /**
     * Query Node Details
     * Query Node Details  Query the details of the specified file node
     * <p><b>200</b> - node_detail successfully
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> nodeDetailWithHttpInfo(String nodeId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'nodeId' is set
        if (nodeId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'nodeId' when calling nodeDetail");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling nodeDetail");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("node_id", nodeId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/nodes/{node_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Update Records
     * Update Records  Update several records of a datasheet. When submitted using the PUT method, only the fields that are specified will have their data updated, and fields that are not specified will retain their old values.
     * <p><b>200</b> - Get Datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @param viewId  (optional)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateRecordsPatch(String dstId, String authorization, RecordUpdateRO recordUpdateRO, String viewId) throws RestClientException {
        updateRecordsPatchWithHttpInfo(dstId, authorization, recordUpdateRO, viewId);
    }

    /**
     * Update Records
     * Update Records  Update several records of a datasheet. When submitted using the PUT method, only the fields that are specified will have their data updated, and fields that are not specified will retain their old values.
     * <p><b>200</b> - Get Datasheet
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @param viewId  (optional)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateRecordsPatchWithHttpInfo(String dstId, String authorization, RecordUpdateRO recordUpdateRO, String viewId) throws RestClientException {
        Object localVarPostBody = recordUpdateRO;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling updateRecordsPatch");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateRecordsPatch");
        }
        
        // verify the required parameter 'recordUpdateRO' is set
        if (recordUpdateRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'recordUpdateRO' when calling updateRecordsPatch");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "viewId", viewId));


        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/records", HttpMethod.PATCH, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Update Records
     * Update Records  Update several records of a datasheet. When submitted using the PUT method, only the fields that are specified will have their data updated, and fields that are not specified will retain their old values.
     * <p><b>200</b> - Update records successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @param viewId  (optional)
     * @return ListVO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ListVO updateRecordsPut(String dstId, String authorization, RecordUpdateRO recordUpdateRO, String viewId) throws RestClientException {
        return updateRecordsPutWithHttpInfo(dstId, authorization, recordUpdateRO, viewId).getBody();
    }

    /**
     * Update Records
     * Update Records  Update several records of a datasheet. When submitted using the PUT method, only the fields that are specified will have their data updated, and fields that are not specified will retain their old values.
     * <p><b>200</b> - Update records successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @param recordUpdateRO  (required)
     * @param viewId  (optional)
     * @return ResponseEntity&lt;ListVO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ListVO> updateRecordsPutWithHttpInfo(String dstId, String authorization, RecordUpdateRO recordUpdateRO, String viewId) throws RestClientException {
        Object localVarPostBody = recordUpdateRO;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling updateRecordsPut");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateRecordsPut");
        }
        
        // verify the required parameter 'recordUpdateRO' is set
        if (recordUpdateRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'recordUpdateRO' when calling updateRecordsPut");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "viewId", viewId));


        if (authorization != null)
        localVarHeaderParams.add("Authorization", apiClient.parameterToString(authorization));

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ListVO> localReturnType = new ParameterizedTypeReference<ListVO>() {};
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/records", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

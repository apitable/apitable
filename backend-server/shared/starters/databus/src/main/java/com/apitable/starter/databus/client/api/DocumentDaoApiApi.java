package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;

import com.apitable.starter.databus.client.model.DocumentOperationRO;
import com.apitable.starter.databus.client.model.DocumentPropsRO;
import com.apitable.starter.databus.client.model.DocumentRO;

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
public class DocumentDaoApiApi {
    private ApiClient apiClient;

    public DocumentDaoApiApi() {
        this(new ApiClient());
    }

    public DocumentDaoApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * create document operation success
     * create document operation success
     * <p><b>200</b> - create document operation successfully
     * @param documentName document name (required)
     * @param documentOperationRO  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoCreateDocumentOperation(String documentName, DocumentOperationRO documentOperationRO) throws RestClientException {
        daoCreateDocumentOperationWithHttpInfo(documentName, documentOperationRO);
    }

    /**
     * create document operation success
     * create document operation success
     * <p><b>200</b> - create document operation successfully
     * @param documentName document name (required)
     * @param documentOperationRO  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoCreateDocumentOperationWithHttpInfo(String documentName, DocumentOperationRO documentOperationRO) throws RestClientException {
        Object localVarPostBody = documentOperationRO;
        
        // verify the required parameter 'documentName' is set
        if (documentName == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentName' when calling daoCreateDocumentOperation");
        }
        
        // verify the required parameter 'documentOperationRO' is set
        if (documentOperationRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentOperationRO' when calling daoCreateDocumentOperation");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("document_name", documentName);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/documents/{document_name}/operations", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Create or update document
     * Create or update document
     * <p><b>200</b> - Create or update document successfully
     * @param documentName document name (required)
     * @param documentRO  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoCreateOrUpdateDocument(String documentName, DocumentRO documentRO) throws RestClientException {
        daoCreateOrUpdateDocumentWithHttpInfo(documentName, documentRO);
    }

    /**
     * Create or update document
     * Create or update document
     * <p><b>200</b> - Create or update document successfully
     * @param documentName document name (required)
     * @param documentRO  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoCreateOrUpdateDocumentWithHttpInfo(String documentName, DocumentRO documentRO) throws RestClientException {
        Object localVarPostBody = documentRO;
        
        // verify the required parameter 'documentName' is set
        if (documentName == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentName' when calling daoCreateOrUpdateDocument");
        }
        
        // verify the required parameter 'documentRO' is set
        if (documentRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentRO' when calling daoCreateOrUpdateDocument");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("document_name", documentName);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/documents/{document_name}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get document data
     * Get document data
     * <p><b>200</b> - Get document data successfully
     * @param documentName document name (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetDocumentData(String documentName) throws RestClientException {
        daoGetDocumentDataWithHttpInfo(documentName);
    }

    /**
     * Get document data
     * Get document data
     * <p><b>200</b> - Get document data successfully
     * @param documentName document name (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetDocumentDataWithHttpInfo(String documentName) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'documentName' is set
        if (documentName == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentName' when calling daoGetDocumentData");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("document_name", documentName);

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
        return apiClient.invokeAPI("/databus/dao/documents/{document_name}/data", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get new document name
     * Get new document name
     * <p><b>200</b> - Get new document name successfully
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetNewDocumentName() throws RestClientException {
        daoGetNewDocumentNameWithHttpInfo();
    }

    /**
     * Get new document name
     * Get new document name
     * <p><b>200</b> - Get new document name successfully
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetNewDocumentNameWithHttpInfo() throws RestClientException {
        Object localVarPostBody = null;
        

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
        return apiClient.invokeAPI("/databus/dao/documents/name", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * batch update document props
     * batch update document props
     * <p><b>200</b> - batch update document props successfully
     * @param documentPropsRO  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoUpdateDocumentProps(DocumentPropsRO documentPropsRO) throws RestClientException {
        daoUpdateDocumentPropsWithHttpInfo(documentPropsRO);
    }

    /**
     * batch update document props
     * batch update document props
     * <p><b>200</b> - batch update document props successfully
     * @param documentPropsRO  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoUpdateDocumentPropsWithHttpInfo(DocumentPropsRO documentPropsRO) throws RestClientException {
        Object localVarPostBody = documentPropsRO;
        
        // verify the required parameter 'documentPropsRO' is set
        if (documentPropsRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'documentPropsRO' when calling daoUpdateDocumentProps");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/documents/props", HttpMethod.PATCH, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

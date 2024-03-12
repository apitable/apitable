package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;


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
public class EnterpriseFusionApiApi {
    private ApiClient apiClient;

    public EnterpriseFusionApiApi() {
        this(new ApiClient());
    }

    public EnterpriseFusionApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * batch_delete_view
     * batch_delete_view  Batch delete views in a specified datasheet
     * <p><b>200</b> - batch_delete_view successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void batchDeleteView(String dstId, String authorization) throws RestClientException {
        batchDeleteViewWithHttpInfo(dstId, authorization);
    }

    /**
     * batch_delete_view
     * batch_delete_view  Batch delete views in a specified datasheet
     * <p><b>200</b> - batch_delete_view successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> batchDeleteViewWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling batchDeleteView");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling batchDeleteView");
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
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * copy_view
     * copy_view  copy a view at a specified datasheet
     * <p><b>200</b> - copy_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void copyView(String dstId, String viewId, String authorization) throws RestClientException {
        copyViewWithHttpInfo(dstId, viewId, authorization);
    }

    /**
     * copy_view
     * copy_view  copy a view at a specified datasheet
     * <p><b>200</b> - copy_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> copyViewWithHttpInfo(String dstId, String viewId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling copyView");
        }
        
        // verify the required parameter 'viewId' is set
        if (viewId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'viewId' when calling copyView");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling copyView");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);
        uriVariables.put("view_id", viewId);

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
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views/{view_id}/duplicate", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_chat_completion
     * create_chat_completion  Creates a model response for the given chat conversation
     * <p><b>200</b> - create_chat_completion successfully
     * @param aiId ai_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createChatCompletion(String aiId, String authorization) throws RestClientException {
        createChatCompletionWithHttpInfo(aiId, authorization);
    }

    /**
     * create_chat_completion
     * create_chat_completion  Creates a model response for the given chat conversation
     * <p><b>200</b> - create_chat_completion successfully
     * @param aiId ai_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createChatCompletionWithHttpInfo(String aiId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'aiId' is set
        if (aiId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'aiId' when calling createChatCompletion");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createChatCompletion");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("ai_id", aiId);

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
        return apiClient.invokeAPI("/fusion/v3/ai/{ai_id}/chat/completions", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_embed_link
     * create_embed_link  Creates an \&quot;embed link\&quot; for the specified node
     * <p><b>200</b> - create_embed_link successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createEmbedLink(String spaceId, String nodeId, String authorization) throws RestClientException {
        createEmbedLinkWithHttpInfo(spaceId, nodeId, authorization);
    }

    /**
     * create_embed_link
     * create_embed_link  Creates an \&quot;embed link\&quot; for the specified node
     * <p><b>200</b> - create_embed_link successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createEmbedLinkWithHttpInfo(String spaceId, String nodeId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createEmbedLink");
        }
        
        // verify the required parameter 'nodeId' is set
        if (nodeId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'nodeId' when calling createEmbedLink");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createEmbedLink");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/nodes/{node_id}/embedlinks", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_member
     * create_member  Create a member for a specified space
     * <p><b>200</b> - create_member successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createMember(String spaceId, String authorization) throws RestClientException {
        createMemberWithHttpInfo(spaceId, authorization);
    }

    /**
     * create_member
     * create_member  Create a member for a specified space
     * <p><b>200</b> - create_member successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createMemberWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createMember");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createMember");
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/members", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_role
     * create_role  Create a role for a specified space.
     * <p><b>200</b> - create_role successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createRole(String spaceId, String authorization) throws RestClientException {
        createRoleWithHttpInfo(spaceId, authorization);
    }

    /**
     * create_role
     * create_role  Create a role for a specified space.
     * <p><b>200</b> - create_role successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createRoleWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createRole");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createRole");
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/roles", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_team
     * create_team  Create a team for a specified space.
     * <p><b>200</b> - create_team successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createTeam(String spaceId, String authorization) throws RestClientException {
        createTeamWithHttpInfo(spaceId, authorization);
    }

    /**
     * create_team
     * create_team  Create a team for a specified space.
     * <p><b>200</b> - create_team successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createTeamWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling createTeam");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createTeam");
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/teams", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_view
     * create_view  Add a view to a specified datasheet
     * <p><b>200</b> - create_view successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createView(String dstId, String authorization) throws RestClientException {
        createViewWithHttpInfo(dstId, authorization);
    }

    /**
     * create_view
     * create_view  Add a view to a specified datasheet
     * <p><b>200</b> - create_view successfully
     * @param dstId dst_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createViewWithHttpInfo(String dstId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling createView");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createView");
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
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create_widget
     * create_widget  Add a widget to a specified dashboard
     * <p><b>200</b> - create_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void createWidget(String dashboardId, String authorization) throws RestClientException {
        createWidgetWithHttpInfo(dashboardId, authorization);
    }

    /**
     * create_widget
     * create_widget  Add a widget to a specified dashboard
     * <p><b>200</b> - create_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> createWidgetWithHttpInfo(String dashboardId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dashboardId' is set
        if (dashboardId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dashboardId' when calling createWidget");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling createWidget");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dashboard_id", dashboardId);

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
        return apiClient.invokeAPI("/fusion/v3/dashboards/{dashboard_id}/widgets", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_embed_link
     * delete_embed_link  Removes the specified Advanced Embed link. After deleted, the link cannot be accessed.
     * <p><b>200</b> - delete_embed_link successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param linkId link_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteEmbedLink(String spaceId, String nodeId, String linkId, String authorization) throws RestClientException {
        deleteEmbedLinkWithHttpInfo(spaceId, nodeId, linkId, authorization);
    }

    /**
     * delete_embed_link
     * delete_embed_link  Removes the specified Advanced Embed link. After deleted, the link cannot be accessed.
     * <p><b>200</b> - delete_embed_link successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param linkId link_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteEmbedLinkWithHttpInfo(String spaceId, String nodeId, String linkId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling deleteEmbedLink");
        }
        
        // verify the required parameter 'nodeId' is set
        if (nodeId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'nodeId' when calling deleteEmbedLink");
        }
        
        // verify the required parameter 'linkId' is set
        if (linkId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'linkId' when calling deleteEmbedLink");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteEmbedLink");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("node_id", nodeId);
        uriVariables.put("link_id", linkId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/nodes/{node_id}/embedlinks/{link_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_member
     * delete_member  Delete a member for a specified space.
     * <p><b>200</b> - delete_member successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteMember(String spaceId, String unitId, String authorization) throws RestClientException {
        deleteMemberWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * delete_member
     * delete_member  Delete a member for a specified space.
     * <p><b>200</b> - delete_member successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteMemberWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling deleteMember");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling deleteMember");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteMember");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/members/{unit_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_role
     * delete_role  Delete a role for a specified space
     * <p><b>200</b> - delete_role successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteRole(String spaceId, String unitId, String authorization) throws RestClientException {
        deleteRoleWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * delete_role
     * delete_role  Delete a role for a specified space
     * <p><b>200</b> - delete_role successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteRoleWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling deleteRole");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling deleteRole");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteRole");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/roles/{unit_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_team
     * delete_team  Delete a team for a specified space
     * <p><b>200</b> - delete_team successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteTeam(String spaceId, String unitId, String authorization) throws RestClientException {
        deleteTeamWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * delete_team
     * delete_team  Delete a team for a specified space
     * <p><b>200</b> - delete_team successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteTeamWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling deleteTeam");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling deleteTeam");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteTeam");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/teams/{unit_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_view
     * delete_view  Delete a view in a specified datasheet
     * <p><b>200</b> - delete_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteView(String dstId, String viewId, String authorization) throws RestClientException {
        deleteViewWithHttpInfo(dstId, viewId, authorization);
    }

    /**
     * delete_view
     * delete_view  Delete a view in a specified datasheet
     * <p><b>200</b> - delete_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteViewWithHttpInfo(String dstId, String viewId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling deleteView");
        }
        
        // verify the required parameter 'viewId' is set
        if (viewId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'viewId' when calling deleteView");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteView");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);
        uriVariables.put("view_id", viewId);

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
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views/{view_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * delete_widget
     * delete_widget  delete widget in a specified dashboard
     * <p><b>200</b> - delete_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param widgetId widget_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void deleteWidget(String dashboardId, String widgetId, String authorization) throws RestClientException {
        deleteWidgetWithHttpInfo(dashboardId, widgetId, authorization);
    }

    /**
     * delete_widget
     * delete_widget  delete widget in a specified dashboard
     * <p><b>200</b> - delete_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param widgetId widget_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> deleteWidgetWithHttpInfo(String dashboardId, String widgetId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dashboardId' is set
        if (dashboardId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dashboardId' when calling deleteWidget");
        }
        
        // verify the required parameter 'widgetId' is set
        if (widgetId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'widgetId' when calling deleteWidget");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling deleteWidget");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dashboard_id", dashboardId);
        uriVariables.put("widget_id", widgetId);

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
        return apiClient.invokeAPI("/fusion/v3/dashboards/{dashboard_id}/widgets/{widget_id}", HttpMethod.DELETE, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get_embed_link_list
     * get_embed_link_list  Get all embedded links for a specified node
     * <p><b>200</b> - get_embed_link_list successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void getEmbedLinkList(String spaceId, String nodeId, String authorization) throws RestClientException {
        getEmbedLinkListWithHttpInfo(spaceId, nodeId, authorization);
    }

    /**
     * get_embed_link_list
     * get_embed_link_list  Get all embedded links for a specified node
     * <p><b>200</b> - get_embed_link_list successfully
     * @param spaceId space_id (required)
     * @param nodeId node_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> getEmbedLinkListWithHttpInfo(String spaceId, String nodeId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling getEmbedLinkList");
        }
        
        // verify the required parameter 'nodeId' is set
        if (nodeId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'nodeId' when calling getEmbedLinkList");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling getEmbedLinkList");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/nodes/{node_id}/embedlinks", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * member_detail
     * member_detail  Get member details information
     * <p><b>200</b> - member_detail successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void memberDetail(String spaceId, String unitId, String authorization) throws RestClientException {
        memberDetailWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * member_detail
     * member_detail  Get member details information
     * <p><b>200</b> - member_detail successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> memberDetailWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling memberDetail");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling memberDetail");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling memberDetail");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/members/{unit_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * role_list
     * role_list  Get roles for a specified space
     * <p><b>200</b> - role_list successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void roleList(String spaceId, String authorization) throws RestClientException {
        roleListWithHttpInfo(spaceId, authorization);
    }

    /**
     * role_list
     * role_list  Get roles for a specified space
     * <p><b>200</b> - role_list successfully
     * @param spaceId space_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> roleListWithHttpInfo(String spaceId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling roleList");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling roleList");
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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/roles", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * role_unit_list
     * role_unit_list  Get the organizational units under the specified role unitId, the returned data includes teams and members.
     * <p><b>200</b> - role_unit_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void roleUnitList(String spaceId, String unitId, String authorization) throws RestClientException {
        roleUnitListWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * role_unit_list
     * role_unit_list  Get the organizational units under the specified role unitId, the returned data includes teams and members.
     * <p><b>200</b> - role_unit_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> roleUnitListWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling roleUnitList");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling roleUnitList");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling roleUnitList");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/roles/{unit_id}/units", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * sub_team_list
     * sub_team_list  Get the list of sub teams of a team by UnitId.
     * <p><b>200</b> - sub_team_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void subTeamList(String spaceId, String unitId, String authorization) throws RestClientException {
        subTeamListWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * sub_team_list
     * sub_team_list  Get the list of sub teams of a team by UnitId.
     * <p><b>200</b> - sub_team_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> subTeamListWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling subTeamList");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling subTeamList");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling subTeamList");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/teams/{unit_id}/children", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * team_member_list
     * team_member_list  List members under team.
     * <p><b>200</b> - team_member_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void teamMemberList(String spaceId, String unitId, String authorization) throws RestClientException {
        teamMemberListWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * team_member_list
     * team_member_list  List members under team.
     * <p><b>200</b> - team_member_list successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> teamMemberListWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling teamMemberList");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling teamMemberList");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling teamMemberList");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/teams/{unit_id}/members", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * update_member
     * update_member  Update a member for a specified space.
     * <p><b>200</b> - update_member successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateMember(String spaceId, String unitId, String authorization) throws RestClientException {
        updateMemberWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * update_member
     * update_member  Update a member for a specified space.
     * <p><b>200</b> - update_member successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateMemberWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling updateMember");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling updateMember");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateMember");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/members/{unit_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * update_role
     * update_role  Update roles for a specified space
     * <p><b>200</b> - update_role successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateRole(String spaceId, String unitId, String authorization) throws RestClientException {
        updateRoleWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * update_role
     * update_role  Update roles for a specified space
     * <p><b>200</b> - update_role successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateRoleWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling updateRole");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling updateRole");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateRole");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/roles/{unit_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * update_team
     * update_team  Update a for a specified space
     * <p><b>200</b> - update_team successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateTeam(String spaceId, String unitId, String authorization) throws RestClientException {
        updateTeamWithHttpInfo(spaceId, unitId, authorization);
    }

    /**
     * update_team
     * update_team  Update a for a specified space
     * <p><b>200</b> - update_team successfully
     * @param spaceId space_id (required)
     * @param unitId unit_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateTeamWithHttpInfo(String spaceId, String unitId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling updateTeam");
        }
        
        // verify the required parameter 'unitId' is set
        if (unitId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'unitId' when calling updateTeam");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateTeam");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);
        uriVariables.put("unit_id", unitId);

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
        return apiClient.invokeAPI("/fusion/v3/spaces/{space_id}/teams/{unit_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * update_view
     * update_view  update a view in a specified datasheet
     * <p><b>200</b> - update_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateView(String dstId, String viewId, String authorization) throws RestClientException {
        updateViewWithHttpInfo(dstId, viewId, authorization);
    }

    /**
     * update_view
     * update_view  update a view in a specified datasheet
     * <p><b>200</b> - update_view successfully
     * @param dstId dst_id (required)
     * @param viewId view_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateViewWithHttpInfo(String dstId, String viewId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dstId' is set
        if (dstId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dstId' when calling updateView");
        }
        
        // verify the required parameter 'viewId' is set
        if (viewId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'viewId' when calling updateView");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateView");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dst_id", dstId);
        uriVariables.put("view_id", viewId);

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
        return apiClient.invokeAPI("/fusion/v3/datasheets/{dst_id}/views/{view_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * update_widget
     * update_widget  modify widget in a specified dashboard
     * <p><b>200</b> - update_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param widgetId widget_id (required)
     * @param authorization Current csrf token of user (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void updateWidget(String dashboardId, String widgetId, String authorization) throws RestClientException {
        updateWidgetWithHttpInfo(dashboardId, widgetId, authorization);
    }

    /**
     * update_widget
     * update_widget  modify widget in a specified dashboard
     * <p><b>200</b> - update_widget successfully
     * @param dashboardId dashboard_id (required)
     * @param widgetId widget_id (required)
     * @param authorization Current csrf token of user (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> updateWidgetWithHttpInfo(String dashboardId, String widgetId, String authorization) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'dashboardId' is set
        if (dashboardId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'dashboardId' when calling updateWidget");
        }
        
        // verify the required parameter 'widgetId' is set
        if (widgetId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'widgetId' when calling updateWidget");
        }
        
        // verify the required parameter 'authorization' is set
        if (authorization == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'authorization' when calling updateWidget");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("dashboard_id", dashboardId);
        uriVariables.put("widget_id", widgetId);

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
        return apiClient.invokeAPI("/fusion/v3/dashboards/{dashboard_id}/widgets/{widget_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

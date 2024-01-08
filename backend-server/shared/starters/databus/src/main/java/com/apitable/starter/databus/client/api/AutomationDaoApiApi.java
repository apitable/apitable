package com.apitable.starter.databus.client.api;

import com.apitable.starter.databus.client.ApiClient;

import com.apitable.starter.databus.client.model.ApiResponseAutomationActionPO;
import com.apitable.starter.databus.client.model.ApiResponseAutomationRobotIntroductionSO;
import com.apitable.starter.databus.client.model.ApiResponseAutomationRobotRunNumsSO;
import com.apitable.starter.databus.client.model.ApiResponseAutomationRunHistoryPO;
import com.apitable.starter.databus.client.model.ApiResponseAutomationSO;
import com.apitable.starter.databus.client.model.ApiResponseAutomationTriggerSO;
import com.apitable.starter.databus.client.model.ApiResponseEmptySO;
import com.apitable.starter.databus.client.model.AutomationHistoryStatusRO;
import com.apitable.starter.databus.client.model.AutomationRobotActionRO;
import com.apitable.starter.databus.client.model.AutomationRobotCopyRO;
import com.apitable.starter.databus.client.model.AutomationRobotTriggerRO;
import com.apitable.starter.databus.client.model.AutomationRobotUpdateRO;

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
public class AutomationDaoApiApi {
    private ApiClient apiClient;

    public AutomationDaoApiApi() {
        this(new ApiClient());
    }

    public AutomationDaoApiApi(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public void setApiClient(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Create automation robot
     * Create automation robot
     * <p><b>200</b> - Create automation robot successfully
     * @param automationRobotCopyRO  (required)
     * @return ApiResponseEmptySO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseEmptySO daoCopyAutomationRobot(List<AutomationRobotCopyRO> automationRobotCopyRO) throws RestClientException {
        return daoCopyAutomationRobotWithHttpInfo(automationRobotCopyRO).getBody();
    }

    /**
     * Create automation robot
     * Create automation robot
     * <p><b>200</b> - Create automation robot successfully
     * @param automationRobotCopyRO  (required)
     * @return ResponseEntity&lt;ApiResponseEmptySO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseEmptySO> daoCopyAutomationRobotWithHttpInfo(List<AutomationRobotCopyRO> automationRobotCopyRO) throws RestClientException {
        Object localVarPostBody = automationRobotCopyRO;
        
        // verify the required parameter 'automationRobotCopyRO' is set
        if (automationRobotCopyRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'automationRobotCopyRO' when calling daoCopyAutomationRobot");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseEmptySO> localReturnType = new ParameterizedTypeReference<ApiResponseEmptySO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/copy", HttpMethod.POST, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * create automation run history task success todo
     * create automation run history task success todo
     * <p><b>200</b> - create automation run history task success
     * @param robotId robot id (required)
     * @param body  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoCreateAutomationRunHistory(String robotId, Object body) throws RestClientException {
        daoCreateAutomationRunHistoryWithHttpInfo(robotId, body);
    }

    /**
     * create automation run history task success todo
     * create automation run history task success todo
     * <p><b>200</b> - create automation run history task success
     * @param robotId robot id (required)
     * @param body  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoCreateAutomationRunHistoryWithHttpInfo(String robotId, Object body) throws RestClientException {
        Object localVarPostBody = body;
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoCreateAutomationRunHistory");
        }
        
        // verify the required parameter 'body' is set
        if (body == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'body' when calling daoCreateAutomationRunHistory");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

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
        return apiClient.invokeAPI("/databus/dao/automations/{robot_id}/histories", HttpMethod.POST, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Add or create automation robot action
     * Add or create automation robot action
     * <p><b>200</b> - Update automation robot action successfully
     * <p><b>201</b> - Create automation robot action successfully
     * @param robotId robot id (required)
     * @param automationRobotActionRO  (required)
     * @return ApiResponseAutomationActionPO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationActionPO daoCreateOrUpdateAutomationRobotAction(String robotId, AutomationRobotActionRO automationRobotActionRO) throws RestClientException {
        return daoCreateOrUpdateAutomationRobotActionWithHttpInfo(robotId, automationRobotActionRO).getBody();
    }

    /**
     * Add or create automation robot action
     * Add or create automation robot action
     * <p><b>200</b> - Update automation robot action successfully
     * <p><b>201</b> - Create automation robot action successfully
     * @param robotId robot id (required)
     * @param automationRobotActionRO  (required)
     * @return ResponseEntity&lt;ApiResponseAutomationActionPO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationActionPO> daoCreateOrUpdateAutomationRobotActionWithHttpInfo(String robotId, AutomationRobotActionRO automationRobotActionRO) throws RestClientException {
        Object localVarPostBody = automationRobotActionRO;
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoCreateOrUpdateAutomationRobotAction");
        }
        
        // verify the required parameter 'automationRobotActionRO' is set
        if (automationRobotActionRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'automationRobotActionRO' when calling daoCreateOrUpdateAutomationRobotAction");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAutomationActionPO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationActionPO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/{robot_id}/actions", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Add or create automation robot trigger
     * Add or create automation robot trigger
     * <p><b>200</b> - Update automation robot trigger successfully
     * <p><b>201</b> - Create automation robot trigger successfully
     * @param robotId robot id (required)
     * @param automationRobotTriggerRO  (required)
     * @return ApiResponseAutomationTriggerSO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationTriggerSO daoCreateOrUpdateAutomationRobotTrigger(String robotId, AutomationRobotTriggerRO automationRobotTriggerRO) throws RestClientException {
        return daoCreateOrUpdateAutomationRobotTriggerWithHttpInfo(robotId, automationRobotTriggerRO).getBody();
    }

    /**
     * Add or create automation robot trigger
     * Add or create automation robot trigger
     * <p><b>200</b> - Update automation robot trigger successfully
     * <p><b>201</b> - Create automation robot trigger successfully
     * @param robotId robot id (required)
     * @param automationRobotTriggerRO  (required)
     * @return ResponseEntity&lt;ApiResponseAutomationTriggerSO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationTriggerSO> daoCreateOrUpdateAutomationRobotTriggerWithHttpInfo(String robotId, AutomationRobotTriggerRO automationRobotTriggerRO) throws RestClientException {
        Object localVarPostBody = automationRobotTriggerRO;
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoCreateOrUpdateAutomationRobotTrigger");
        }
        
        // verify the required parameter 'automationRobotTriggerRO' is set
        if (automationRobotTriggerRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'automationRobotTriggerRO' when calling daoCreateOrUpdateAutomationRobotTrigger");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAutomationTriggerSO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationTriggerSO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/{robot_id}/triggers", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation task input and output todo
     * Get automation task input and output todo
     * <p><b>200</b> - Get automation run history task context
     * @param taskId task id (required)
     * @param actionId action id (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetAutomationRunContext(String taskId, String actionId) throws RestClientException {
        daoGetAutomationRunContextWithHttpInfo(taskId, actionId);
    }

    /**
     * Get automation task input and output todo
     * Get automation task input and output todo
     * <p><b>200</b> - Get automation run history task context
     * @param taskId task id (required)
     * @param actionId action id (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetAutomationRunContextWithHttpInfo(String taskId, String actionId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'taskId' is set
        if (taskId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'taskId' when calling daoGetAutomationRunContext");
        }
        
        // verify the required parameter 'actionId' is set
        if (actionId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'actionId' when calling daoGetAutomationRunContext");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("task_id", taskId);
        uriVariables.put("action_id", actionId);

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
        return apiClient.invokeAPI("/databus/dao/automations/histories/{task_id}/contexts/{action_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation run history list
     * Get automation run history list
     * <p><b>200</b> - Get automation run history list
     * @param pageSize  (required)
     * @param pageNum  (required)
     * @param robotId robot id (required)
     * @return ApiResponseAutomationRunHistoryPO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationRunHistoryPO daoGetAutomationRunHistory(Integer pageSize, Integer pageNum, String robotId) throws RestClientException {
        return daoGetAutomationRunHistoryWithHttpInfo(pageSize, pageNum, robotId).getBody();
    }

    /**
     * Get automation run history list
     * Get automation run history list
     * <p><b>200</b> - Get automation run history list
     * @param pageSize  (required)
     * @param pageNum  (required)
     * @param robotId robot id (required)
     * @return ResponseEntity&lt;ApiResponseAutomationRunHistoryPO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationRunHistoryPO> daoGetAutomationRunHistoryWithHttpInfo(Integer pageSize, Integer pageNum, String robotId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'pageSize' is set
        if (pageSize == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'pageSize' when calling daoGetAutomationRunHistory");
        }
        
        // verify the required parameter 'pageNum' is set
        if (pageNum == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'pageNum' when calling daoGetAutomationRunHistory");
        }
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoGetAutomationRunHistory");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "page_size", pageSize));
        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "page_num", pageNum));


        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAutomationRunHistoryPO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationRunHistoryPO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/{robot_id}/histories", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation run task details todo
     * Get automation run task details todo
     * <p><b>200</b> - Get automation run history detail
     * @param taskId task id (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetAutomationRunHistoryDetail(String taskId) throws RestClientException {
        daoGetAutomationRunHistoryDetailWithHttpInfo(taskId);
    }

    /**
     * Get automation run task details todo
     * Get automation run task details todo
     * <p><b>200</b> - Get automation run history detail
     * @param taskId task id (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetAutomationRunHistoryDetailWithHttpInfo(String taskId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'taskId' is set
        if (taskId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'taskId' when calling daoGetAutomationRunHistoryDetail");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("task_id", taskId);

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
        return apiClient.invokeAPI("/databus/dao/automations/histories/{task_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation robot detail.
     * Get automation robot detail.
     * <p><b>200</b> - get automation detail
     * @param robotId Automation robot id (required)
     * @return ApiResponseAutomationSO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationSO daoGetRobotByRobotId(String robotId) throws RestClientException {
        return daoGetRobotByRobotIdWithHttpInfo(robotId).getBody();
    }

    /**
     * Get automation robot detail.
     * Get automation robot detail.
     * <p><b>200</b> - get automation detail
     * @param robotId Automation robot id (required)
     * @return ResponseEntity&lt;ApiResponseAutomationSO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationSO> daoGetRobotByRobotIdWithHttpInfo(String robotId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoGetRobotByRobotId");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

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

        ParameterizedTypeReference<ApiResponseAutomationSO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationSO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/{robot_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation robot running times.
     * Get automation robot running times.
     * <p><b>200</b> - get automation robot running times
     * @param spaceId  space id (required)
     * @return ApiResponseAutomationRobotRunNumsSO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationRobotRunNumsSO daoGetRobotRunsBySpaceId(String spaceId) throws RestClientException {
        return daoGetRobotRunsBySpaceIdWithHttpInfo(spaceId).getBody();
    }

    /**
     * Get automation robot running times.
     * Get automation robot running times.
     * <p><b>200</b> - get automation robot running times
     * @param spaceId  space id (required)
     * @return ResponseEntity&lt;ApiResponseAutomationRobotRunNumsSO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationRobotRunNumsSO> daoGetRobotRunsBySpaceIdWithHttpInfo(String spaceId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'spaceId' is set
        if (spaceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'spaceId' when calling daoGetRobotRunsBySpaceId");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("space_id", spaceId);

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

        ParameterizedTypeReference<ApiResponseAutomationRobotRunNumsSO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationRobotRunNumsSO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/runs/{space_id}", HttpMethod.GET, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get automations triggers todo
     * get automations triggers todo
     * <p><b>200</b> - get automations triggers
     * @param resourceId  (required)
     * @return ApiResponseAutomationRobotIntroductionSO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseAutomationRobotIntroductionSO daoGetRobotsByResourceId(String resourceId) throws RestClientException {
        return daoGetRobotsByResourceIdWithHttpInfo(resourceId).getBody();
    }

    /**
     * get automations triggers todo
     * get automations triggers todo
     * <p><b>200</b> - get automations triggers
     * @param resourceId  (required)
     * @return ResponseEntity&lt;ApiResponseAutomationRobotIntroductionSO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseAutomationRobotIntroductionSO> daoGetRobotsByResourceIdWithHttpInfo(String resourceId) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'resourceId' is set
        if (resourceId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'resourceId' when calling daoGetRobotsByResourceId");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(null, "resource_id", resourceId));


        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseAutomationRobotIntroductionSO> localReturnType = new ParameterizedTypeReference<ApiResponseAutomationRobotIntroductionSO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * get automations triggers todo
     * get automations triggers todo
     * <p><b>200</b> - get automations triggers
     * @param robotIds  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoGetRobotsTriggers(List<String> robotIds) throws RestClientException {
        daoGetRobotsTriggersWithHttpInfo(robotIds);
    }

    /**
     * get automations triggers todo
     * get automations triggers todo
     * <p><b>200</b> - get automations triggers
     * @param robotIds  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoGetRobotsTriggersWithHttpInfo(List<String> robotIds) throws RestClientException {
        Object localVarPostBody = null;
        
        // verify the required parameter 'robotIds' is set
        if (robotIds == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotIds' when calling daoGetRobotsTriggers");
        }
        

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        localVarQueryParams.putAll(apiClient.parameterToMultiValueMap(ApiClient.CollectionFormat.valueOf("multi".toUpperCase(Locale.ROOT)), "robot_ids", robotIds));


        final String[] localVarAccepts = {  };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = {  };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<Void> localReturnType = new ParameterizedTypeReference<Void>() {};
        return apiClient.invokeAPI("/databus/dao/automations/triggers", HttpMethod.GET, Collections.<String, Object>emptyMap(), localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Update automation robot
     * Update automation robot
     * <p><b>200</b> - Update automation robot successfully
     * @param robotId robot id (required)
     * @param automationRobotUpdateRO  (required)
     * @return ApiResponseEmptySO
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ApiResponseEmptySO daoUpdateAutomationRobot(String robotId, AutomationRobotUpdateRO automationRobotUpdateRO) throws RestClientException {
        return daoUpdateAutomationRobotWithHttpInfo(robotId, automationRobotUpdateRO).getBody();
    }

    /**
     * Update automation robot
     * Update automation robot
     * <p><b>200</b> - Update automation robot successfully
     * @param robotId robot id (required)
     * @param automationRobotUpdateRO  (required)
     * @return ResponseEntity&lt;ApiResponseEmptySO&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<ApiResponseEmptySO> daoUpdateAutomationRobotWithHttpInfo(String robotId, AutomationRobotUpdateRO automationRobotUpdateRO) throws RestClientException {
        Object localVarPostBody = automationRobotUpdateRO;
        
        // verify the required parameter 'robotId' is set
        if (robotId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'robotId' when calling daoUpdateAutomationRobot");
        }
        
        // verify the required parameter 'automationRobotUpdateRO' is set
        if (automationRobotUpdateRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'automationRobotUpdateRO' when calling daoUpdateAutomationRobot");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("robot_id", robotId);

        final MultiValueMap<String, String> localVarQueryParams = new LinkedMultiValueMap<String, String>();
        final HttpHeaders localVarHeaderParams = new HttpHeaders();
        final MultiValueMap<String, String> localVarCookieParams = new LinkedMultiValueMap<String, String>();
        final MultiValueMap<String, Object> localVarFormParams = new LinkedMultiValueMap<String, Object>();

        final String[] localVarAccepts = { 
            "application/json"
         };
        final List<MediaType> localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);
        final String[] localVarContentTypes = { 
            "application/json"
         };
        final MediaType localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

        String[] localVarAuthNames = new String[] {  };

        ParameterizedTypeReference<ApiResponseEmptySO> localReturnType = new ParameterizedTypeReference<ApiResponseEmptySO>() {};
        return apiClient.invokeAPI("/databus/dao/automations/robots/{robot_id}", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
    /**
     * Get automation task input and output todo
     * Get automation task input and output todo
     * <p><b>200</b> - Get automation run history task context
     * @param taskId task id (required)
     * @param automationHistoryStatusRO  (required)
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public void daoUpdateAutomationRunHistoryStatus(String taskId, AutomationHistoryStatusRO automationHistoryStatusRO) throws RestClientException {
        daoUpdateAutomationRunHistoryStatusWithHttpInfo(taskId, automationHistoryStatusRO);
    }

    /**
     * Get automation task input and output todo
     * Get automation task input and output todo
     * <p><b>200</b> - Get automation run history task context
     * @param taskId task id (required)
     * @param automationHistoryStatusRO  (required)
     * @return ResponseEntity&lt;Void&gt;
     * @throws RestClientException if an error occurs while attempting to invoke the API
     */
    public ResponseEntity<Void> daoUpdateAutomationRunHistoryStatusWithHttpInfo(String taskId, AutomationHistoryStatusRO automationHistoryStatusRO) throws RestClientException {
        Object localVarPostBody = automationHistoryStatusRO;
        
        // verify the required parameter 'taskId' is set
        if (taskId == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'taskId' when calling daoUpdateAutomationRunHistoryStatus");
        }
        
        // verify the required parameter 'automationHistoryStatusRO' is set
        if (automationHistoryStatusRO == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Missing the required parameter 'automationHistoryStatusRO' when calling daoUpdateAutomationRunHistoryStatus");
        }
        
        // create path and map variables
        final Map<String, Object> uriVariables = new HashMap<String, Object>();
        uriVariables.put("task_id", taskId);

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
        return apiClient.invokeAPI("/databus/dao/automations/histories/{task_id}/status", HttpMethod.PUT, uriVariables, localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localReturnType);
    }
}

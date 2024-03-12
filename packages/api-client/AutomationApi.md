# .AutomationApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAction**](AutomationApi.md#createAction) | **POST** /automation/{resourceId}/actions | Create automation action
[**createTrigger**](AutomationApi.md#createTrigger) | **POST** /automation/{resourceId}/triggers | Create automation robot trigger
[**deleteAction**](AutomationApi.md#deleteAction) | **DELETE** /automation/{resourceId}/actions/{actionId} | Delete automation action
[**deleteRobot**](AutomationApi.md#deleteRobot) | **DELETE** /automation/{resourceId}/robots/{robotId} | Delete automation robot
[**deleteTrigger**](AutomationApi.md#deleteTrigger) | **DELETE** /automation/{resourceId}/triggers/{triggerId} | Delete automation trigger
[**getNodeRobot**](AutomationApi.md#getNodeRobot) | **GET** /automation/{resourceId}/robots/{robotId} | Get node automation detail. 
[**getResourceRobots**](AutomationApi.md#getResourceRobots) | **GET** /automation/robots | Get automation robots
[**getRunHistory**](AutomationApi.md#getRunHistory) | **GET** /automation/{resourceId}/roots/{robotId}/run-history | Get automation run history
[**modifyRobot**](AutomationApi.md#modifyRobot) | **PATCH** /automation/{resourceId}/robots/{robotId} | Update automation info.
[**updateAction**](AutomationApi.md#updateAction) | **PATCH** /automation/{resourceId}/actions/{actionId} | Update automation action
[**updateTrigger**](AutomationApi.md#updateTrigger) | **PATCH** /automation/{resourceId}/triggers/{triggerId} | Update automation robot trigger


# **createAction**
> ResponseDataListActionVO createAction(createActionRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiCreateActionRequest = {
  // CreateActionRO
  createActionRO: {
    robotId: "arb****",
    input: {},
    prevActionId: "atr",
    actionTypeId: "test",
  },
  // string | node id
  resourceId: "aut****",
  // string | share id
  shareId: "shr****",
};

apiInstance.createAction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createActionRO** | **CreateActionRO**|  |
 **resourceId** | [**string**] | node id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataListActionVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createTrigger**
> ResponseDataListTriggerVO createTrigger(createTriggerRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiCreateTriggerRequest = {
  // CreateTriggerRO
  createTriggerRO: {
    robotId: "arb****",
    input: {},
    relatedResourceId: "dst***/fom***",
    prevTriggerId: "atr",
    triggerTypeId: "test",
  },
  // string | node id
  resourceId: "aut****",
  // string | share id
  shareId: "shr****",
};

apiInstance.createTrigger(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTriggerRO** | **CreateTriggerRO**|  |
 **resourceId** | [**string**] | node id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataListTriggerVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteAction**
> ResponseDataVoid deleteAction()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiDeleteActionRequest = {
  // string | node id
  resourceId: "aut****",
  // string | action id
  actionId: "atr****",
  // string | robot id
  robotId: "arb****",
};

apiInstance.deleteAction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceId** | [**string**] | node id | defaults to undefined
 **actionId** | [**string**] | action id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteRobot**
> ResponseDataVoid deleteRobot()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiDeleteRobotRequest = {
  // string | node id
  resourceId: "aut****",
  // string | robot id
  robotId: "arb****",
};

apiInstance.deleteRobot(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceId** | [**string**] | node id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteTrigger**
> ResponseDataVoid deleteTrigger()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiDeleteTriggerRequest = {
  // string | node id
  resourceId: "aut****",
  // string | trigger id
  triggerId: "atr****",
  // string | robot id
  robotId: "arb****",
};

apiInstance.deleteTrigger(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceId** | [**string**] | node id | defaults to undefined
 **triggerId** | [**string**] | trigger id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getNodeRobot**
> ResponseDataAutomationVO getNodeRobot()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiGetNodeRobotRequest = {
  // string | node id
  resourceId: "aut****",
  // string | robot id
  robotId: "arb****",
  // string | share id
  shareId: "shr****",
};

apiInstance.getNodeRobot(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceId** | [**string**] | node id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataAutomationVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getResourceRobots**
> ResponseDataListAutomationSimpleVO getResourceRobots()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiGetResourceRobotsRequest = {
  // string | node id
  resourceId: "aut****",
  // string | share id
  shareId: "shr****",
};

apiInstance.getResourceRobots(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceId** | [**string**] | node id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataListAutomationSimpleVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getRunHistory**
> ResponseDataListAutomationTaskSimpleVO getRunHistory()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiGetRunHistoryRequest = {
  // number | Current page number, default: 1
  pageNum: 1,
  // string | share id
  shareId: "shr****",
  // string | node id
  resourceId: "aut****",
  // string | robot id
  robotId: "arb****",
  // number | Page size, default: 20 (optional)
  pageSize: 20,
};

apiInstance.getRunHistory(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNum** | [**number**] | Current page number, default: 1 | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined
 **resourceId** | [**string**] | node id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined
 **pageSize** | [**number**] | Page size, default: 20 | (optional) defaults to undefined


### Return type

**ResponseDataListAutomationTaskSimpleVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **modifyRobot**
> ResponseDataVoid modifyRobot(updateRobotRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiModifyRobotRequest = {
  // UpdateRobotRO
  updateRobotRO: {
    name: "test",
    description: "test",
    props: {
      failureNotifyEnable: false,
    },
    isActive: true,
  },
  // string | node id
  resourceId: "aut****",
  // string | robot id
  robotId: "arb****",
  // string | share id
  shareId: "shr****",
};

apiInstance.modifyRobot(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateRobotRO** | **UpdateRobotRO**|  |
 **resourceId** | [**string**] | node id | defaults to undefined
 **robotId** | [**string**] | robot id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateAction**
> ResponseDataListActionVO updateAction(updateActionRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiUpdateActionRequest = {
  // UpdateActionRO
  updateActionRO: {
    robotId: "arb****",
    input: {},
    prevActionId: "atr",
    actionTypeId: "test",
  },
  // string | node id
  resourceId: "aut****",
  // string | action id
  actionId: "atr****",
  // string | share id
  shareId: "shr****",
};

apiInstance.updateAction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateActionRO** | **UpdateActionRO**|  |
 **resourceId** | [**string**] | node id | defaults to undefined
 **actionId** | [**string**] | action id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataListActionVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateTrigger**
> ResponseDataListTriggerVO updateTrigger(updateTriggerRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationApi(configuration);

let body:.AutomationApiUpdateTriggerRequest = {
  // UpdateTriggerRO
  updateTriggerRO: {
    robotId: "arb****",
    input: {},
    relatedResourceId: "dst***/fom***",
    prevTriggerId: "atr",
    triggerTypeId: "test",
  },
  // string | node id
  resourceId: "aut****",
  // string | trigger id
  triggerId: "atr****",
  // string | share id
  shareId: "shr****",
};

apiInstance.updateTrigger(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateTriggerRO** | **UpdateTriggerRO**|  |
 **resourceId** | [**string**] | node id | defaults to undefined
 **triggerId** | [**string**] | trigger id | defaults to undefined
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataListTriggerVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



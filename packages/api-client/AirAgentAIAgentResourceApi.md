# .AirAgentAIAgentResourceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create11**](AirAgentAIAgentResourceApi.md#create11) | **POST** /airagent/ai | Create AI Agent
[**createFeedback**](AirAgentAIAgentResourceApi.md#createFeedback) | **POST** /airagent/ai/{aiId}/feedback | Create Feedback
[**delete18**](AirAgentAIAgentResourceApi.md#delete18) | **DELETE** /airagent/ai/{agentId} | Delete AI Agent
[**getConversationFeedback**](AirAgentAIAgentResourceApi.md#getConversationFeedback) | **GET** /airagent/ai/{aiId}/conversations/{conversationId}/feedback | Retrieve Conversation Feedback
[**getLastTrainingStatus**](AirAgentAIAgentResourceApi.md#getLastTrainingStatus) | **GET** /airagent/ai/{aiId}/training/status | Retrieve Latest Training Status
[**getMessagePagination**](AirAgentAIAgentResourceApi.md#getMessagePagination) | **GET** /airagent/ai/{aiId}/messages | Retrieve Conversation Message
[**getMessagesFeedback**](AirAgentAIAgentResourceApi.md#getMessagesFeedback) | **GET** /airagent/ai/{aiId}/feedback | Retrieve Feedback Pagination
[**getSuggestions**](AirAgentAIAgentResourceApi.md#getSuggestions) | **POST** /airagent/ai/{aiId}/suggestions | Get Suggestions
[**list8**](AirAgentAIAgentResourceApi.md#list8) | **GET** /airagent/ai | Get AI Agent List
[**retrieve**](AirAgentAIAgentResourceApi.md#retrieve) | **GET** /airagent/ai/{agentId} | Retrieve AI Agent
[**sendMessage**](AirAgentAIAgentResourceApi.md#sendMessage) | **POST** /airagent/ai/{aiId}/messages | Send Message
[**train**](AirAgentAIAgentResourceApi.md#train) | **POST** /airagent/ai/{agentId}/train | Train AI Agent
[**trainPredict**](AirAgentAIAgentResourceApi.md#trainPredict) | **POST** /airagent/ai/{agentId}/train/predict | Train Predict
[**update**](AirAgentAIAgentResourceApi.md#update) | **PUT** /airagent/ai/{agentId} | Update AI Agent
[**updateFeedback**](AirAgentAIAgentResourceApi.md#updateFeedback) | **PUT** /airagent/ai/{aiId}/feedback/{feedbackId} | Update Feedback


# **create11**
> ResponseDataAiInfoVO create11(agentCreateRO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiCreate11Request = {
  // AgentCreateRO
  agentCreateRO: {
    preAgentId: "ag_****",
    name: "test",
  },
};

apiInstance.create11(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentCreateRO** | **AgentCreateRO**|  |


### Return type

**ResponseDataAiInfoVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createFeedback**
> ResponseDataFeedback createFeedback(feedbackCreateParam, )

Create Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiCreateFeedbackRequest = {
  // FeedbackCreateParam
  feedbackCreateParam: {
    trainingId: "trainingId_example",
    conversationId: "conversationId_example",
    like: 1,
    messageIndex: 1,
    comment: "comment_example",
  },
  // string
  aiId: "aiId_example",
};

apiInstance.createFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedbackCreateParam** | **FeedbackCreateParam**|  |
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataFeedback**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **delete18**
> ResponseDataVoid delete18()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiDelete18Request = {
  // string | agent id
  agentId: "ag_****",
};

apiInstance.delete18(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentId** | [**string**] | agent id | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getConversationFeedback**
> ResponseDataFeedbackVO getConversationFeedback()

Retrieve Conversation Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiGetConversationFeedbackRequest = {
  // string
  aiId: "aiId_example",
  // string
  conversationId: "conversationId_example",
};

apiInstance.getConversationFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined
 **conversationId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataFeedbackVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getLastTrainingStatus**
> ResponseDataTrainingStatusVO getLastTrainingStatus()

Retrieve Latest Training Status

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiGetLastTrainingStatusRequest = {
  // string
  aiId: "aiId_example",
};

apiInstance.getLastTrainingStatus(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataTrainingStatusVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getMessagePagination**
> ResponseDataPaginationMessage getMessagePagination()

Retrieve Conversation Message

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiGetMessagePaginationRequest = {
  // string
  aiId: "aiId_example",
  // string (optional)
  trainingId: "trainingId_example",
  // string (optional)
  conversationId: "conversationId_example",
  // string (optional)
  cursor: "cursor_example",
  // number (optional)
  limit: 10,
};

apiInstance.getMessagePagination(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined
 **trainingId** | [**string**] |  | (optional) defaults to undefined
 **conversationId** | [**string**] |  | (optional) defaults to undefined
 **cursor** | [**string**] |  | (optional) defaults to undefined
 **limit** | [**number**] |  | (optional) defaults to 10


### Return type

**ResponseDataPaginationMessage**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getMessagesFeedback**
> ResponseDataFeedbackPagination getMessagesFeedback()

Retrieve Feedback Pagination

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiGetMessagesFeedbackRequest = {
  // string
  aiId: "aiId_example",
  // number (optional)
  pageNum: 1,
  // number (optional)
  pageSize: 20,
  // number (optional)
  state: 1,
  // string (optional)
  search: "search_example",
};

apiInstance.getMessagesFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined
 **pageNum** | [**number**] |  | (optional) defaults to 1
 **pageSize** | [**number**] |  | (optional) defaults to 20
 **state** | [**number**] |  | (optional) defaults to undefined
 **search** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataFeedbackPagination**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getSuggestions**
> ResponseDataSuggestionVO getSuggestions(suggestionParams, )

Get Suggestions

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiGetSuggestionsRequest = {
  // SuggestionParams
  suggestionParams: {
    trainingId: "trainingId_example",
    conversationId: "conversationId_example",
    question: "question_example",
    n: 1,
  },
  // string
  aiId: "aiId_example",
};

apiInstance.getSuggestions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **suggestionParams** | **SuggestionParams**|  |
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataSuggestionVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **list8**
> ResponseDataListAgentVO list8()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:any = {};

apiInstance.list8(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataListAgentVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **retrieve**
> ResponseDataAiInfoVO retrieve()

Retrieve AI Info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiRetrieveRequest = {
  // string
  agentId: "agentId_example",
};

apiInstance.retrieve(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataAiInfoVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **sendMessage**
> Array<string> sendMessage(sendMessageParam, )

Send Message

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiSendMessageRequest = {
  // SendMessageParam
  sendMessageParam: {
    conversationId: "conversationId_example",
    content: "content_example",
  },
  // string
  aiId: "aiId_example",
};

apiInstance.sendMessage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sendMessageParam** | **SendMessageParam**|  |
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**Array<string>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **train**
> ResponseDataVoid train()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiTrainRequest = {
  // string
  agentId: "agentId_example",
};

apiInstance.train(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentId** | [**string**] |  | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **trainPredict**
> ResponseDataTrainingPredictResult trainPredict(trainingPredictParams, )

Train Predict

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiTrainPredictRequest = {
  // TrainingPredictParams
  trainingPredictParams: {
    dataSources: [
      {
        nodeId: "nodeId_example",
      },
    ],
  },
  // string
  agentId: "agentId_example",
};

apiInstance.trainPredict(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trainingPredictParams** | **TrainingPredictParams**|  |
 **agentId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataTrainingPredictResult**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **update**
> ResponseDataAiInfoVO update(agentUpdateParams, )

Update AI Info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiUpdateRequest = {
  // AgentUpdateParams
  agentUpdateParams: {
    name: "name_example",
    type: "type_example",
    model: "model_example",
    setting: {
      "key": {},
    },
  },
  // string
  agentId: "agentId_example",
};

apiInstance.update(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentUpdateParams** | **AgentUpdateParams**|  |
 **agentId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataAiInfoVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateFeedback**
> ResponseDataVoid updateFeedback(feedbackUpdateParam, )

Update Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAIAgentResourceApi(configuration);

let body:.AirAgentAIAgentResourceApiUpdateFeedbackRequest = {
  // FeedbackUpdateParam
  feedbackUpdateParam: {
    state: 1,
  },
  // string
  aiId: "aiId_example",
  // number
  feedbackId: 1,
};

apiInstance.updateFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedbackUpdateParam** | **FeedbackUpdateParam**|  |
 **aiId** | [**string**] |  | defaults to undefined
 **feedbackId** | [**number**] |  | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



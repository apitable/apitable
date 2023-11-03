# .AIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createFeedback1**](AIApi.md#createFeedback1) | **POST** /ai/{aiId}/feedback | Create Feedback
[**getConversationFeedback1**](AIApi.md#getConversationFeedback1) | **GET** /ai/{aiId}/conversations/{conversationId}/feedback | Retrieve Conversation Feedback
[**getCreditUsage**](AIApi.md#getCreditUsage) | **GET** /ai/{aiId}/credit/usage | Retrieve Credit Usage
[**getLastTrainingStatus1**](AIApi.md#getLastTrainingStatus1) | **GET** /ai/{aiId}/training/status | Retrieve Latest Training Status
[**getMessagePagination1**](AIApi.md#getMessagePagination1) | **GET** /ai/{aiId}/messages | Retrieve Conversation Message
[**getMessagesFeedback1**](AIApi.md#getMessagesFeedback1) | **GET** /ai/{aiId}/feedback | Retrieve Feedback Pagination
[**getSuggestions1**](AIApi.md#getSuggestions1) | **POST** /ai/{aiId}/suggestions | Get Suggestions
[**retrieve1**](AIApi.md#retrieve1) | **GET** /ai/{aiId} | Retrieve AI Info
[**retrieveSetting**](AIApi.md#retrieveSetting) | **GET** /ai/{aiId}/setting | Retrieve AI Setting
[**retrieveTrainings**](AIApi.md#retrieveTrainings) | **GET** /ai/{aiId}/trainings | Retrieve AI Training List
[**sendMessage1**](AIApi.md#sendMessage1) | **POST** /ai/{aiId}/messages | Send Message
[**train1**](AIApi.md#train1) | **POST** /ai/{aiId}/train | Train
[**trainPredict1**](AIApi.md#trainPredict1) | **POST** /ai/{aiId}/train/predict | Train Predict
[**update1**](AIApi.md#update1) | **PUT** /ai/{aiId} | Update AI Info
[**updateFeedback1**](AIApi.md#updateFeedback1) | **PUT** /ai/{aiId}/feedback/{feedbackId} | Update Feedback


# **createFeedback1**
> ResponseDataFeedback createFeedback1(feedbackCreateParam, )

Create Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiCreateFeedback1Request = {
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

apiInstance.createFeedback1(body).then((data:any) => {
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

# **getConversationFeedback1**
> ResponseDataFeedbackVO getConversationFeedback1()

Retrieve Conversation Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetConversationFeedback1Request = {
  // string
  aiId: "aiId_example",
  // string
  conversationId: "conversationId_example",
};

apiInstance.getConversationFeedback1(body).then((data:any) => {
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

# **getCreditUsage**
> ResponseDataMessageCreditUsageVO getCreditUsage()

Retrieve Latest Training Status

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetCreditUsageRequest = {
  // string
  aiId: "aiId_example",
};

apiInstance.getCreditUsage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataMessageCreditUsageVO**

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

# **getLastTrainingStatus1**
> ResponseDataTrainingStatusVO getLastTrainingStatus1()

Retrieve Latest Training Status

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetLastTrainingStatus1Request = {
  // string
  aiId: "aiId_example",
};

apiInstance.getLastTrainingStatus1(body).then((data:any) => {
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

# **getMessagePagination1**
> ResponseDataPaginationMessage getMessagePagination1()

Retrieve Conversation Message

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetMessagePagination1Request = {
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

apiInstance.getMessagePagination1(body).then((data:any) => {
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

# **getMessagesFeedback1**
> ResponseDataFeedbackPagination getMessagesFeedback1()

Retrieve Feedback Pagination

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetMessagesFeedback1Request = {
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

apiInstance.getMessagesFeedback1(body).then((data:any) => {
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

# **getSuggestions1**
> ResponseDataSuggestionVO getSuggestions1(suggestionParams, )

Get Suggestions

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiGetSuggestions1Request = {
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

apiInstance.getSuggestions1(body).then((data:any) => {
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

# **retrieve1**
> ResponseDataAiInfoVO retrieve1()

Retrieve AI Info by ai id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiRetrieve1Request = {
  // string
  aiId: "aiId_example",
};

apiInstance.retrieve1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined


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

# **retrieveSetting**
> ResponseDataPureJson retrieveSetting()

Retrieve AI Setting by ai id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiRetrieveSettingRequest = {
  // string
  aiId: "aiId_example",
  // string (optional)
  type: "type_example",
};

apiInstance.retrieveSetting(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined
 **type** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataPureJson**

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

# **retrieveTrainings**
> ResponseDataListTrainingInfoVO retrieveTrainings()

Retrieve AI training list by ai id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiRetrieveTrainingsRequest = {
  // string
  aiId: "aiId_example",
};

apiInstance.retrieveTrainings(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataListTrainingInfoVO**

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

# **sendMessage1**
> Array<any> sendMessage1(sendMessageParam, )

Send Message

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiSendMessage1Request = {
  // SendMessageParam
  sendMessageParam: {
    conversationId: "conversationId_example",
    content: "content_example",
  },
  // string
  aiId: "aiId_example",
};

apiInstance.sendMessage1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sendMessageParam** | **SendMessageParam**|  |
 **aiId** | [**string**] |  | defaults to undefined


### Return type

**Array<any>**

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

# **train1**
> ResponseDataVoid train1()

Train

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiTrain1Request = {
  // string
  aiId: "aiId_example",
};

apiInstance.train1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiId** | [**string**] |  | defaults to undefined


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

# **trainPredict1**
> ResponseDataTrainingPredictResult trainPredict1(trainingPredictParams, )

Train Predict

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiTrainPredict1Request = {
  // TrainingPredictParams
  trainingPredictParams: {
    dataSources: [
      {
        nodeId: "nodeId_example",
      },
    ],
  },
  // string
  aiId: "aiId_example",
};

apiInstance.trainPredict1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trainingPredictParams** | **TrainingPredictParams**|  |
 **aiId** | [**string**] |  | defaults to undefined


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

# **update1**
> ResponseDataAiInfoVO update1(aiUpdateParams, )

Update AI Info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiUpdate1Request = {
  // AiUpdateParams
  aiUpdateParams: {
    name: "name_example",
    picture: "picture_example",
    description: "description_example",
    type: "type_example",
    prologue: "prologue_example",
    prompt: "prompt_example",
    model: "model_example",
    setting: {
      "key": {},
    },
    dataSources: [
      {
        nodeId: "nodeId_example",
      },
    ],
  },
  // string
  aiId: "aiId_example",
};

apiInstance.update1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aiUpdateParams** | **AiUpdateParams**|  |
 **aiId** | [**string**] |  | defaults to undefined


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

# **updateFeedback1**
> ResponseDataVoid updateFeedback1(feedbackUpdateParam, )

Update Feedback

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AIApi(configuration);

let body:.AIApiUpdateFeedback1Request = {
  // FeedbackUpdateParam
  feedbackUpdateParam: {
    state: 1,
  },
  // string
  aiId: "aiId_example",
  // number
  feedbackId: 1,
};

apiInstance.updateFeedback1(body).then((data:any) => {
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



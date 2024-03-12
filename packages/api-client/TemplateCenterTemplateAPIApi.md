# .TemplateCenterTemplateAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](TemplateCenterTemplateAPIApi.md#create) | **POST** /template/create | Create Template
[**delete5**](TemplateCenterTemplateAPIApi.md#delete5) | **DELETE** /template/delete/{templateId} | Delete Template
[**directory**](TemplateCenterTemplateAPIApi.md#directory) | **GET** /template/directory | Get Template Directory Info
[**getCategoryContent**](TemplateCenterTemplateAPIApi.md#getCategoryContent) | **GET** /template/categories/{categoryCode} | Get The Template Category Content
[**getCategoryList**](TemplateCenterTemplateAPIApi.md#getCategoryList) | **GET** /template/categoryList | Get Template Category List
[**getSpaceTemplates**](TemplateCenterTemplateAPIApi.md#getSpaceTemplates) | **GET** /spaces/{spaceId}/templates | Get Space Templates
[**globalSearch**](TemplateCenterTemplateAPIApi.md#globalSearch) | **GET** /template/global/search | Template Global Search
[**quote**](TemplateCenterTemplateAPIApi.md#quote) | **POST** /template/quote | Quote Template
[**recommend**](TemplateCenterTemplateAPIApi.md#recommend) | **GET** /template/recommend | Get Template Recommend Content
[**validate**](TemplateCenterTemplateAPIApi.md#validate) | **GET** /template/validate | Check if the template name already exists


# **create**
> ResponseDataString create(createTemplateRo)

Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiCreateRequest = {
  // CreateTemplateRo
  createTemplateRo: {
    name: "This is a template",
    nodeId: "nod10",
    data: true,
  },
};

apiInstance.create(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTemplateRo** | **CreateTemplateRo**|  |


### Return type

**ResponseDataString**

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

# **delete5**
> ResponseDataVoid delete5()

Deletion objects: main administrator, sub-admins with template permissions, creator of the template

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiDelete5Request = {
  // string | Template ID
  templateId: "tplHTbkg7qbNJ",
};

apiInstance.delete5(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateId** | [**string**] | Template ID | defaults to undefined


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

# **directory**
> ResponseDataTemplateDirectoryVo directory()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiDirectoryRequest = {
  // string | Template Id
  templateId: "tplHTbkg7qbNJ",
  // string | Official Template Category Code (optional)
  categoryCode: "tpcEm7VDcbnnr",
  // boolean | Whether it is a private template in the space station (optional)
  isPrivate: true,
};

apiInstance.directory(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateId** | [**string**] | Template Id | defaults to undefined
 **categoryCode** | [**string**] | Official Template Category Code | (optional) defaults to undefined
 **isPrivate** | [**boolean**] | Whether it is a private template in the space station | (optional) defaults to undefined


### Return type

**ResponseDataTemplateDirectoryVo**

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

# **getCategoryContent**
> ResponseDataTemplateCategoryContentVo getCategoryContent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiGetCategoryContentRequest = {
  // string | Template Category Code
  categoryCode: "tpcEm7VDcbnnr",
};

apiInstance.getCategoryContent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryCode** | [**string**] | Template Category Code | defaults to undefined


### Return type

**ResponseDataTemplateCategoryContentVo**

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

# **getCategoryList**
> ResponseDataListTemplateCategoryMenuVo getCategoryList()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:any = {};

apiInstance.getCategoryList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataListTemplateCategoryMenuVo**

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

# **getSpaceTemplates**
> ResponseDataListTemplateVo getSpaceTemplates()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiGetSpaceTemplatesRequest = {
  // string
  spaceId: "spaceId_example",
  // string | Space Id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.getSpaceTemplates(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **xSpaceId** | [**string**] | Space Id | defaults to undefined


### Return type

**ResponseDataListTemplateVo**

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

# **globalSearch**
> ResponseDataTemplateSearchResultVo globalSearch()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiGlobalSearchRequest = {
  // string | Search Keyword
  keyword: "plan",
  // string | Highlight Style Class Name (optional)
  className: "highLight",
};

apiInstance.globalSearch(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | Search Keyword | defaults to undefined
 **className** | [**string**] | Highlight Style Class Name | (optional) defaults to undefined


### Return type

**ResponseDataTemplateSearchResultVo**

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

# **quote**
> ResponseDataNodeInfoVo quote(quoteTemplateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiQuoteRequest = {
  // QuoteTemplateRo
  quoteTemplateRo: {
    templateId: "tplHTbkg7qbNJ",
    parentId: "fodSf4PZBNwut",
    data: true,
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.quote(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **quoteTemplateRo** | **QuoteTemplateRo**|  |
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataNodeInfoVo**

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

# **recommend**
> ResponseDataRecommendVo recommend()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:any = {};

apiInstance.recommend(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataRecommendVo**

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

# **validate**
> ResponseDataBoolean validate()

Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAPIApi(configuration);

let body:.TemplateCenterTemplateAPIApiValidateRequest = {
  // string | Template Name
  name: "i am template",
  // string | Space Id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.validate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | [**string**] | Template Name | defaults to undefined
 **xSpaceId** | [**string**] | Space Id | defaults to undefined


### Return type

**ResponseDataBoolean**

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



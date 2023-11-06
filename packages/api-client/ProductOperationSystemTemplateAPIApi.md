# .ProductOperationSystemTemplateAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTemplateCategory**](ProductOperationSystemTemplateAPIApi.md#createTemplateCategory) | **POST** /ops/templateCategory/create | Create Template Category
[**deleteTemplateCategory**](ProductOperationSystemTemplateAPIApi.md#deleteTemplateCategory) | **DELETE** /ops/templateCategories/{categoryCode} | Delete Template Category
[**publish**](ProductOperationSystemTemplateAPIApi.md#publish) | **POST** /ops/templates/{templateId}/publish | Publish Template in Specified Template Category
[**unpublish**](ProductOperationSystemTemplateAPIApi.md#unpublish) | **POST** /ops/templates/{templateId}/unpublish | UnPublish Template


# **createTemplateCategory**
> ResponseDataString createTemplateCategory(templateCategoryCreateRo)

Only supply to people in template space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ProductOperationSystemTemplateAPIApi(configuration);

let body:.ProductOperationSystemTemplateAPIApiCreateTemplateCategoryRequest = {
  // TemplateCategoryCreateRo
  templateCategoryCreateRo: {
    name: "education",
    i18nName: "en_US | zh_CN",
  },
};

apiInstance.createTemplateCategory(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateCategoryCreateRo** | **TemplateCategoryCreateRo**|  |


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteTemplateCategory**
> ResponseDataVoid deleteTemplateCategory()

Only supply to people in template space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ProductOperationSystemTemplateAPIApi(configuration);

let body:.ProductOperationSystemTemplateAPIApiDeleteTemplateCategoryRequest = {
  // string
  categoryCode: "categoryCode_example",
};

apiInstance.deleteTemplateCategory(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryCode** | [**string**] |  | defaults to undefined


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

# **publish**
> ResponseDataVoid publish(templatePublishRo, )

Only supply to people in template space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ProductOperationSystemTemplateAPIApi(configuration);

let body:.ProductOperationSystemTemplateAPIApiPublishRequest = {
  // TemplatePublishRo
  templatePublishRo: {
    categoryCode: "tpcxxx",
    index: 0,
  },
  // string | template id
  templateId: "tplxxx",
};

apiInstance.publish(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templatePublishRo** | **TemplatePublishRo**|  |
 **templateId** | [**string**] | template id | defaults to undefined


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

# **unpublish**
> ResponseDataVoid unpublish(templateUnpublishRo, )

Only supply to people in template space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ProductOperationSystemTemplateAPIApi(configuration);

let body:.ProductOperationSystemTemplateAPIApiUnpublishRequest = {
  // TemplateUnpublishRo
  templateUnpublishRo: {
    categoryCode: "tpcxxx",
    allCategory: true,
  },
  // string | template id
  templateId: "tplxxx",
};

apiInstance.unpublish(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateUnpublishRo** | **TemplateUnpublishRo**|  |
 **templateId** | [**string**] | template id | defaults to undefined


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



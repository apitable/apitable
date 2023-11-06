# .VCodeSystemVCodeAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_delete**](VCodeSystemVCodeAPIApi.md#_delete) | **POST** /vcode/delete/{code} | Delete VCode
[**create**](VCodeSystemVCodeAPIApi.md#create) | **POST** /vcode/create | Create VCode
[**delete1**](VCodeSystemVCodeAPIApi.md#delete1) | **DELETE** /vcode/delete/{code} | Delete VCode
[**edit**](VCodeSystemVCodeAPIApi.md#edit) | **POST** /vcode/edit/{code} | Edit VCode Setting
[**exchange**](VCodeSystemVCodeAPIApi.md#exchange) | **POST** /vcode/exchange/{code} | Exchange VCode
[**page**](VCodeSystemVCodeAPIApi.md#page) | **GET** /vcode/page | Query VCode Page


# **_delete**
> ResponseDataVoid _delete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiDeleteRequest = {
  // string | VCode
  code: "vc123",
};

apiInstance._delete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | VCode | defaults to undefined


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

# **create**
> ResponseDataListString create(vCodeCreateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiCreateRequest = {
  // VCodeCreateRo
  vCodeCreateRo: {
    count: 1,
    type: 0,
    activityId: 1296402001573097473,
    templateId: 1296405974262652930,
    availableTimes: -1,
    limitTimes: 1,
    expireTime: new Date('1970-01-01T00:00:00.00Z'),
    mobile: "12580",
  },
};

apiInstance.create(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeCreateRo** | **VCodeCreateRo**|  |


### Return type

**ResponseDataListString**

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

# **delete1**
> ResponseDataVoid delete1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiDelete1Request = {
  // string | VCode
  code: "vc123",
};

apiInstance.delete1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | VCode | defaults to undefined


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

# **edit**
> ResponseDataVoid edit(vCodeUpdateRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiEditRequest = {
  // VCodeUpdateRo
  vCodeUpdateRo: {
    templateId: 1296402001573097473,
    availableTimes: 100,
    limitTimes: 5,
    expireTime: new Date('1970-01-01T00:00:00.00Z'),
  },
  // string | VCode
  code: "vc123",
};

apiInstance.edit(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeUpdateRo** | **VCodeUpdateRo**|  |
 **code** | [**string**] | VCode | defaults to undefined


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

# **exchange**
> ResponseDataInteger exchange()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiExchangeRequest = {
  // string | VCode
  code: "vc123",
};

apiInstance.exchange(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | VCode | defaults to undefined


### Return type

**ResponseDataInteger**

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

# **page**
> ResponseDataPageInfoVCodePageVo page()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemVCodeAPIApi(configuration);

let body:.VCodeSystemVCodeAPIApiPageRequest = {
  // Page
  page: {
    records: [
      {},
    ],
    total: 1,
    size: 1,
    current: 1,
    orders: [
      {
        column: "column_example",
        asc: true,
      },
    ],
    optimizeCountSql: true,
    searchCount: true,
    optimizeJoinOfCountSql: true,
    countId: "countId_example",
    maxLimit: 1,
    pages: 1,
  },
  // string | Page Params
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
  // number | Type (0: official invitation code; 2: redemption code) (optional)
  type: 1,
  // string | Activity ID (optional)
  activityId: "1296402001573097473",
};

apiInstance.page(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Page Params | defaults to undefined
 **type** | [**number**] | Type (0: official invitation code; 2: redemption code) | (optional) defaults to undefined
 **activityId** | [**string**] | Activity ID | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoVCodePageVo**

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



# .VCodeSystemCouponAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create1**](VCodeSystemCouponAPIApi.md#create1) | **POST** /vcode/coupon/create | Create Coupon Template
[**delete2**](VCodeSystemCouponAPIApi.md#delete2) | **POST** /vcode/coupon/delete/{templateId} | Delete Coupon Template
[**delete3**](VCodeSystemCouponAPIApi.md#delete3) | **DELETE** /vcode/coupon/delete/{templateId} | Delete Coupon Template
[**edit1**](VCodeSystemCouponAPIApi.md#edit1) | **POST** /vcode/coupon/edit/{templateId} | Edit Coupon Template
[**list**](VCodeSystemCouponAPIApi.md#list) | **GET** /vcode/coupon/list | Query Coupon View List
[**page1**](VCodeSystemCouponAPIApi.md#page1) | **GET** /vcode/coupon/page | Query Coupon Page


# **create1**
> ResponseDataVCodeCouponVo create1(vCodeCouponRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiCreate1Request = {
  // VCodeCouponRo
  vCodeCouponRo: {
    count: 10,
    comment: "Seed user benefit exchange template",
  },
};

apiInstance.create1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeCouponRo** | **VCodeCouponRo**|  |


### Return type

**ResponseDataVCodeCouponVo**

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

# **delete2**
> ResponseDataVoid delete2()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiDelete2Request = {
  // string | Coupon Template ID
  templateId: "12359",
};

apiInstance.delete2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateId** | [**string**] | Coupon Template ID | defaults to undefined


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

# **delete3**
> ResponseDataVoid delete3()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiDelete3Request = {
  // string | Coupon Template ID
  templateId: "12359",
};

apiInstance.delete3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateId** | [**string**] | Coupon Template ID | defaults to undefined


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

# **edit1**
> ResponseDataVoid edit1(vCodeCouponRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiEdit1Request = {
  // VCodeCouponRo
  vCodeCouponRo: {
    count: 10,
    comment: "Seed user benefit exchange template",
  },
  // string | Coupon Template ID
  templateId: "12359",
};

apiInstance.edit1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeCouponRo** | **VCodeCouponRo**|  |
 **templateId** | [**string**] | Coupon Template ID | defaults to undefined


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

# **list**
> ResponseDataListVCodeCouponVo list()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiListRequest = {
  // string | Keyword (optional)
  keyword: "channel",
};

apiInstance.list(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | Keyword | (optional) defaults to undefined


### Return type

**ResponseDataListVCodeCouponVo**

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

# **page1**
> ResponseDataPageInfoVCodeCouponPageVo page1()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeSystemCouponAPIApi(configuration);

let body:.VCodeSystemCouponAPIApiPage1Request = {
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
  // string | Keyword (optional)
  keyword: "channel",
};

apiInstance.page1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Page Params | defaults to undefined
 **keyword** | [**string**] | Keyword | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoVCodeCouponPageVo**

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



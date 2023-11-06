# .VCodeActivityAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create2**](VCodeActivityAPIApi.md#create2) | **POST** /vcode/activity/create | Create Activity
[**delete4**](VCodeActivityAPIApi.md#delete4) | **POST** /vcode/activity/delete/{activityId} | Delete Activity
[**delete5**](VCodeActivityAPIApi.md#delete5) | **DELETE** /vcode/activity/delete/{activityId} | Delete Activity
[**edit2**](VCodeActivityAPIApi.md#edit2) | **POST** /vcode/activity/edit/{activityId} | Edit Activity Info
[**list1**](VCodeActivityAPIApi.md#list1) | **GET** /vcode/activity/list | Query Activity List
[**page2**](VCodeActivityAPIApi.md#page2) | **GET** /vcode/activity/page | Query Activity Page


# **create2**
> ResponseDataVCodeActivityVo create2(vCodeActivityRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiCreate2Request = {
  // VCodeActivityRo
  vCodeActivityRo: {
    name: "XX Channel promotion",
    scene: "XX_channel_popularize",
  },
};

apiInstance.create2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeActivityRo** | **VCodeActivityRo**|  |


### Return type

**ResponseDataVCodeActivityVo**

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

# **delete4**
> ResponseDataVoid delete4()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiDelete4Request = {
  // string | Activity ID
  activityId: "12369",
};

apiInstance.delete4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **activityId** | [**string**] | Activity ID | defaults to undefined


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

# **delete5**
> ResponseDataVoid delete5()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiDelete5Request = {
  // string | Activity ID
  activityId: "12369",
};

apiInstance.delete5(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **activityId** | [**string**] | Activity ID | defaults to undefined


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

# **edit2**
> ResponseDataVoid edit2(vCodeActivityRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiEdit2Request = {
  // VCodeActivityRo
  vCodeActivityRo: {
    name: "XX Channel promotion",
    scene: "XX_channel_popularize",
  },
  // string | Activity ID
  activityId: "12369",
};

apiInstance.edit2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vCodeActivityRo** | **VCodeActivityRo**|  |
 **activityId** | [**string**] | Activity ID | defaults to undefined


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

# **list1**
> ResponseDataListVCodeActivityVo list1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiList1Request = {
  // string | Keyword (optional)
  keyword: "channel",
};

apiInstance.list1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | Keyword | (optional) defaults to undefined


### Return type

**ResponseDataListVCodeActivityVo**

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

# **page2**
> ResponseDataPageInfoVCodeActivityPageVo page2()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .VCodeActivityAPIApi(configuration);

let body:.VCodeActivityAPIApiPage2Request = {
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
  // string | Page params
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
  // string | Keyword (optional)
  keyword: "channel",
};

apiInstance.page2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Page params | defaults to undefined
 **keyword** | [**string**] | Keyword | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoVCodeActivityPageVo**

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



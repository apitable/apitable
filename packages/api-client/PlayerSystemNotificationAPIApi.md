# .PlayerSystemNotificationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create2**](PlayerSystemNotificationAPIApi.md#create2) | **POST** /player/notification/create | Create Notification
[**delete4**](PlayerSystemNotificationAPIApi.md#delete4) | **POST** /player/notification/delete | Delete Notification
[**list2**](PlayerSystemNotificationAPIApi.md#list2) | **GET** /player/notification/list | Get Notification Detail List
[**page**](PlayerSystemNotificationAPIApi.md#page) | **GET** /player/notification/page | Get Notification Page Info
[**read**](PlayerSystemNotificationAPIApi.md#read) | **POST** /player/notification/read | Mark Notification Read
[**statistics1**](PlayerSystemNotificationAPIApi.md#statistics1) | **GET** /player/notification/statistics | Get Notification\&#39; Statistics


# **create2**
> ResponseDataVoid create2(notificationCreateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiCreate2Request = {
  // Array<NotificationCreateRo>
  notificationCreateRo: [
    {
      toUserId: [
        "toUserId_example",
      ],
      toMemberId: [
        "toMemberId_example",
      ],
      toUnitId: [
        "toUnitId_example",
      ],
      fromUserId: "1261273764218",
      nodeId: "nod10",
      spaceId: "spcHKrd0liUcl",
      templateId: "tplxx",
      body: 
        key: {},
      ,
      version: "v0.12.1.release",
      expireAt: "1614587900000",
      notifyId: "1614587900000",
    },
  ],
};

apiInstance.create2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationCreateRo** | **Array<NotificationCreateRo>**|  |


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

# **delete4**
> ResponseDataBoolean delete4(notificationReadRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiDelete4Request = {
  // NotificationReadRo
  notificationReadRo: {
    id: ["124324324","243242"],
    isAll: false,
  },
};

apiInstance.delete4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationReadRo** | **NotificationReadRo**|  |


### Return type

**ResponseDataBoolean**

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

# **list2**
> ResponseDataListNotificationDetailVo list2()

Default: System Notification

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiList2Request = {
  // NotificationListRo
  notificationListRo: {
    isRead: false,
    notifyType: "system",
  },
};

apiInstance.list2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationListRo** | **NotificationListRo** |  | defaults to undefined


### Return type

**ResponseDataListNotificationDetailVo**

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

# **page**
> ResponseDataListNotificationDetailVo page()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiPageRequest = {
  // NotificationPageRo
  notificationPageRo: {
    isRead: false,
    notifyType: "system",
    rowNo: 10,
    pageSize: 20,
  },
};

apiInstance.page(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationPageRo** | **NotificationPageRo** |  | defaults to undefined


### Return type

**ResponseDataListNotificationDetailVo**

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

# **read**
> ResponseDataBoolean read(notificationReadRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiReadRequest = {
  // NotificationReadRo
  notificationReadRo: {
    id: ["124324324","243242"],
    isAll: false,
  },
};

apiInstance.read(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationReadRo** | **NotificationReadRo**|  |


### Return type

**ResponseDataBoolean**

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

# **statistics1**
> ResponseDataNotificationStatisticsVo statistics1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:any = {};

apiInstance.statistics1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataNotificationStatisticsVo**

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



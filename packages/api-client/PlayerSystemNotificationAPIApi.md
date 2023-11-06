# .PlayerSystemNotificationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create5**](PlayerSystemNotificationAPIApi.md#create5) | **POST** /player/notification/create | Create Notification
[**delete10**](PlayerSystemNotificationAPIApi.md#delete10) | **POST** /player/notification/delete | Delete Notification
[**list4**](PlayerSystemNotificationAPIApi.md#list4) | **GET** /player/notification/list | Get Notification Detail List
[**page3**](PlayerSystemNotificationAPIApi.md#page3) | **GET** /player/notification/page | Get Notification Page Info
[**read**](PlayerSystemNotificationAPIApi.md#read) | **POST** /player/notification/read | Mark Notification Read
[**statistics1**](PlayerSystemNotificationAPIApi.md#statistics1) | **GET** /player/notification/statistics | Get Notification\&#39; Statistics


# **create5**
> ResponseDataVoid create5(notificationCreateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiCreate5Request = {
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

apiInstance.create5(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **delete10**
> ResponseDataBoolean delete10(notificationReadRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiDelete10Request = {
  // NotificationReadRo
  notificationReadRo: {
    id: ["124324324","243242"],
    isAll: 0,
  },
};

apiInstance.delete10(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **list4**
> ResponseDataListNotificationDetailVo list4()

Default: System Notification

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiList4Request = {
  // NotificationListRo
  notificationListRo: {
    isRead: 1,
    notifyType: "system",
  },
};

apiInstance.list4(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **page3**
> ResponseDataListNotificationDetailVo page3()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemNotificationAPIApi(configuration);

let body:.PlayerSystemNotificationAPIApiPage3Request = {
  // NotificationPageRo
  notificationPageRo: {
    isRead: 0,
    notifyType: "system",
    rowNo: 10,
    pageSize: 20,
  },
};

apiInstance.page3(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

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
    isAll: 0,
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



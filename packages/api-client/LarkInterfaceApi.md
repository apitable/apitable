# .LarkInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changeAdmin**](LarkInterfaceApi.md#changeAdmin) | **POST** /social/feishu/changeAdmin | Tenant space replacement master administrator
[**getTenantInfo1**](LarkInterfaceApi.md#getTenantInfo1) | **GET** /social/feishu/tenant/{tenantKey} | Get tenant binding information


# **changeAdmin**
> ResponseDataVoid changeAdmin(feishuTenantMainAdminChangeRo)

Replace the master administrator

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .LarkInterfaceApi(configuration);

let body:.LarkInterfaceApiChangeAdminRequest = {
  // FeishuTenantMainAdminChangeRo
  feishuTenantMainAdminChangeRo: {
    tenantKey: "128371293xja",
    spaceId: "spc2123hjhasd",
    memberId: 123456,
  },
};

apiInstance.changeAdmin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feishuTenantMainAdminChangeRo** | **FeishuTenantMainAdminChangeRo**|  |


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

# **getTenantInfo1**
> ResponseDataFeishuTenantDetailVO getTenantInfo1()

Get the space information bound by the tenant

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .LarkInterfaceApi(configuration);

let body:.LarkInterfaceApiGetTenantInfo1Request = {
  // string | Lark Tenant ID
  tenantKey: "18823789",
};

apiInstance.getTenantInfo1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantKey** | [**string**] | Lark Tenant ID | defaults to undefined


### Return type

**ResponseDataFeishuTenantDetailVO**

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



# .ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**eventConfig**](ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi.md#eventConfig) | **PUT** /lark/appInstance/{appInstanceId}/updateEventConfig | Update Event Configuration
[**initConfig**](ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi.md#initConfig) | **PUT** /lark/appInstance/{appInstanceId}/updateBaseConfig | Update basic configuration


# **eventConfig**
> ResponseDataAppInstance eventConfig(feishuAppEventConfigRo, )

Change the event configuration of an application instance

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi(configuration);

let body:.ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiEventConfigRequest = {
  // FeishuAppEventConfigRo
  feishuAppEventConfigRo: {
    eventEncryptKey: "asdj123jl1",
    eventVerificationToken: "12h3khkjhass",
  },
  // string | Application instance ID
  appInstanceId: "ai-1jsjakd1",
};

apiInstance.eventConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feishuAppEventConfigRo** | **FeishuAppEventConfigRo**|  |
 **appInstanceId** | [**string**] | Application instance ID | defaults to undefined


### Return type

**ResponseDataAppInstance**

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

# **initConfig**
> ResponseDataAppInstance initConfig(feishuAppConfigRo, )

Update the basic configuration of the application instance

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi(configuration);

let body:.ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiInitConfigRequest = {
  // FeishuAppConfigRo
  feishuAppConfigRo: {
    appKey: "123456",
    appSecret: "1",
  },
  // string | Application instance ID
  appInstanceId: "ai-1jsjakd1",
};

apiInstance.initConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feishuAppConfigRo** | **FeishuAppConfigRo**|  |
 **appInstanceId** | [**string**] | Application instance ID | defaults to undefined


### Return type

**ResponseDataAppInstance**

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



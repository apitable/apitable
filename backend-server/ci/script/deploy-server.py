#!/usr/bin/python3
# coding=utf-8

import requests
import json
import sys

VIP = sys.argv[1]
Authorization = 'basic YWRtaW46dVZXT3dYNDV5dCNV'
CID = sys.argv[2]
PARTITION = sys.argv[3]
APP_NAME = sys.argv[4]
TENANT = sys.argv[5]

url = '{}/hodor/apis/admin.apps.caicloud.io/v2/clusters/{}/partitions/{}/apps/{}'.format(VIP,CID,PARTITION,APP_NAME)
header = {'Content-Type': 'application/json', 'Cache-Control': 'no-cache','X-Tenant': '{}'.format(TENANT), 'Authorization': '{}'.format(Authorization)}

# 打印响应状态码
print(url, header)

# 请求该接口
response = requests.get(url=url, headers=header)

# 打印响应状态码
print(response.status_code)

result = response.json()

# 打印result
print('==打印result==', result)

if response.status_code == 200:
    # 获取响应数据，并解析JSON，转化为python字典
    # metadata.annotations object, requierd 元数据
    # metadata.labels object, requierd 标签
    # spec.description string, requierd 无状态服务描述
    # sepc.config string, required 无状态服务配置
    result = response.json()
    config = json.loads(result['spec']['config'])
    config_str = result['spec']['config']

    # 构造镜像地址：cargo.vikadata.com/system-tenant_integration/backend-server:0.0.1
    image_url = config['_config']['controllers'][0]['containers'][0]['image']
    old_version = image_url.split(':')[1]
    new_version = sys.argv[6]
    config_str = config_str.replace(old_version, new_version)
    data = {"metadata":{'annotations': result['metadata']['annotations'],
                        'labels': result['metadata']['labels']},
            "spec": {'description': result['spec']['description'], 'config': config_str }
            }
    data_json = json.dumps(data)

    # 调用容器云接口部署服务
    deployment = requests.put(url=url,headers=header,data=json.dumps(data))
    if deployment.status_code == 200:
        # 打印结果
        print(deployment.json())
        print("部署成功")
    else:
        print ("部署失败，请仔细检查后重新提交！~")
else:
    print ("获取服务数据失败，请仔细检查后重新提交！~")


#!/usr/bin/python3
# coding=utf-8

import requests
import json
import sys

if (len(sys.argv)) != 6:
    print("请检查参数")
    sys.exit(0)
DEPLOY_SERVER = sys.argv[1]
EKS_SERVER = sys.argv[2]
NAMESPACE = sys.argv[3]
DEPLOY_NAME = sys.argv[4]
IMAGE_NAME = sys.argv[5]

url = '%s?url=%s&namespace=%s&deployment=%s&image=%s'%(DEPLOY_SERVER,EKS_SERVER,NAMESPACE,DEPLOY_NAME,IMAGE_NAME)
header = {'Content-Type': 'application/json'}

# 打印响应状态码
print(url, header)

# 请求该接口
try:
    response = requests.get(url=url, headers=header)
except:
    print ("滚动更新失败，请仔细检查后重新提交！~")
    sys.exit(0)

# 打印响应状态码
print(response.status_code)


if response.status_code == 200:
    print("滚动更新成功")
else:
    print ("滚动更新失败，请仔细检查后重新提交！~")


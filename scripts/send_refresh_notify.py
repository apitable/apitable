import json
import sys
import time

import requests
from vika import Vika

env = sys.argv[1]

def get_url_host(env):
    if env.startswith('v'):
        return ['https://vika.cn', 'uskF4NhDCsL1a0r1NqPcpQF']
    elif env == 'staging':
        return ['https://staging.vika.ltd', 'uskF4NhDCsL1a0r1NqPcpQF']
    else:
        return ['https://integration.vika.ltd', 'uskbCA3JRBz7NQx3nwI']

# 当前环境主机名
host, api_token = get_url_host(env)
# 发送通知的URL地址
notify_url =  host + "/api/v1/gm/new/player/notify"
# 通知配置Id
notify_config_dst_id = "dstshM1UEnurREjWEU"
# 通知模板Id
notify_template_dst_id = "dst9D01fl6zgciZDXt"

print(notify_url, api_token)

vika = Vika("uskbCA3JRBz7NQx3nwI")
vika.set_api_base("https://integration.vika.ltd")

# 获取通知配置相关信息
notify_config_datasheet = vika.datasheet(notify_config_dst_id, field_key="id")
# 筛选出需要发送的通知
records = notify_config_datasheet.records.filter(fldh0MZQitIOj=True)
notify_config_data = records[0].json()
notify_config_record_id = notify_config_data['fldAXk3HRSccx'][0]

# 获取通知模板相关信息
notify_template_datasheet = vika.datasheet(notify_template_dst_id, field_key="id")
records = notify_template_datasheet.records.filter(_id = notify_config_record_id)
notify_template_data = records[0].json()

data = dict(notify_config_data, **notify_template_data)

req_data = json.dumps({
    'body': {
        'title': data.setdefault("fldsNPyJAh9BE", ""),
        'extras': {
            'platform': data.setdefault("fld8TkpPIIp3t", ""),
            'toast': {
                'hiddenVikaby': data.setdefault("fldTYxFIfMBzc", False),
                'allowPrev': False,
                'duration': 0,
                'content': data.setdefault("fldPgHw4KlIxQ", ""),
                'closable': data.setdefault("fldQKpXjiia4u", True),
                'btnText': data.setdefault("fldPkbLuJ2Wzp", "刷新"),
                'onClose': data.setdefault("fld1A1tXD7NqM", ""),
                'onBtnClick': data.setdefault("fldMAo3fQwF64", "")
            },
            'channel': ','.join(data["fldPRQJDqe6tt"])
        },
    },
    'fromUserId': 0,
    'templateId': str(data['fldlJwXqqc9tV']),
    'expireAt': data.setdefault("fldpXmEuP4uujor", int(time.time()) + 1000000)  
})

print(json.dumps(req_data, indent=4, ensure_ascii=False))
req = requests.post(notify_url, data=req_data, headers={
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + api_token
})
data = req.json()

if (data['success']):
    print("发送消息成功")
else:
    print("发送消息失败：", data['message'])

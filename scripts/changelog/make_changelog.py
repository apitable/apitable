import re
import sys

import requests
from vika import Vika

from const import (BUG_TABLE_BASE_URL, CHANGELOG_DATASHEET_ID,
                   CHANGELOG_TABLE_URL, GITLAB_DATASHEET_PROJ_BASE_URL,
                   GITLAB_TOKEN, INTEGRATION_API_TOKEN, VIKA_BUG_DATASHEET_ID)

vika = Vika(INTEGRATION_API_TOKEN)
vika.set_api_base("https://integration.vika.ltd")


def get_mr_base_info(mr_id):
    url = GITLAB_DATASHEET_PROJ_BASE_URL + "merge_requests/" + mr_id
    headers = {
        "PRIVATE-TOKEN": GITLAB_TOKEN
    }
    response = requests.get(url, headers=headers)
    return response.json()


def get_commit_by_merge_request_id(merge_request_id):
    url = GITLAB_DATASHEET_PROJ_BASE_URL + \
        "merge_requests/" + merge_request_id + "/commits"
    # requests set gitlab token header
    headers = {
        "PRIVATE-TOKEN": GITLAB_TOKEN
    }
    response = requests.get(url, headers=headers)
    return response.json()


def get_commit_message_by_type(commits, type="fix"):
    """
    get commit message by type
    :param type: fix | feat | refactor | doc | style
    :param commits: 
    :return: commits with specified type
    """
    feat_commit_messages = []
    for commit in commits:
        msg = commit["message"]
        if msg.lower().startswith(type):
            feat_commit_messages.append(msg)
    return feat_commit_messages


def get_bug_info_by_id(bug_id):
    """
    bug_id: "3301"
    output: 
        - url: "https://integration.vika.ltd/workbench/dstS94qPZFXjC1LKns/viw6Zho4HahOW/recy3zi0qKlvv"
        - submitter: 胡峰
    """
    bugs = vika.datasheet(VIKA_BUG_DATASHEET_ID, field_key_map={
        "bug_id": "fldmfI2DTSBRj"
    }, field_key="id")
    bug = bugs.records.get(bug_id=bug_id)
    if bug:
        return {
            "url": BUG_TABLE_BASE_URL + "/" + bug._id,
            "submitter": bug.json()["记录人"]["name"]
        }


# 使用正则提取 bug id
def get_bug_id_by_commit_msg(message):
    """
    message: "fix: 修复一个小bug#3301asdasd测试混乱的cmt"
    output: 3301
    """
    pattern = r"#(\d+)"
    match = re.search(pattern, message)
    if match:
        return match.group(1)


def get_enhanced_commit_message_with_bug_id(message):
    """
    将 bugid 替换为 url
    message: "fix: 修复一个小 bug #3301"
    output: "fix: 修复一个小 bug [#3301](https://integration.vika.ltd/workbench/dstS94qPZFXjC1LKns/viw6Zho4HahOW/recy3zi0qKlvv)"
    """
    bug_id = get_bug_id_by_commit_msg(message)
    if bug_id:
        bug_info = get_bug_info_by_id(bug_id)
        if bug_info:
            url = bug_info["url"]
            submitter = bug_info["submitter"]
            return message.replace(f"#{bug_id}", f"[#{bug_id}]({url})  @{submitter}")
    return message


def make_bugfix_log_by_commits(commits):
    bug_commit_messages = get_commit_message_by_type(commits, type="fix")
    head = """
## Fix:
"""
    tmp = ""
    for message in bug_commit_messages:
        msg = get_enhanced_commit_message_with_bug_id(message)
        tmp += "- " + msg
    tmp += "\n"
    if bug_commit_messages:
        print(head+tmp)
    return tmp


def make_feat_log_by_commits(commits):
    feat_commit_messages = get_commit_message_by_type(commits, type="feat")
    head = """
## Feat:
"""
    tmp = ""
    for message in feat_commit_messages:
        tmp += "- " + message
    tmp += "\n"
    if feat_commit_messages:
        print(head+tmp)
    return tmp


def get_today_date():
    import datetime
    return datetime.datetime.now().strftime("%Y-%m-%d")


def make_changelog_meta(mr_id):
    info = get_mr_base_info(mr_id)
    if info:
        # 获取今天的日期
        date = get_today_date()
        # 标题即版本
        version = info["title"]
        author = info["author"]["name"]
        print(f"# {date} {version} 上线通知 via {author}")
        return {
            "version": version,
            "author": author
        }
    print("获取 mr 信息失败")


def create_changelog_record(changelog_info):
    """
    创建 changelog 记录
    changelog_info: {
        "版本": "v0.7.6-release.10",
        "发版人": "谁谁谁",
        "Fix": "- fix: xxxxxx\n- fix: xxxxxx\n",
        "Feature": "- feat: xxxxxx\n- feat: xxxxxx\n"
    }
    """
    changelog_dst = vika.datasheet(CHANGELOG_DATASHEET_ID)
    changelog_info.update({
        "上线类型": "上线通知",
        "钉钉通知": "请小维君通知"
    })
    try:
        res = changelog_dst.records.create(changelog_info)
        print("已创建上线通知记录，点击下方链接，检查修改无误后使用小维君插件发送至钉钉群")
        print(f"{CHANGELOG_TABLE_URL}/{res._id}")
    except:
        print('创建上线通知失败')


if __name__ == "__main__":
    # get merge request id from first cli args
    mr_id = sys.argv[1] if len(sys.argv) > 1 else None
    if mr_id:
        commits = get_commit_by_merge_request_id(mr_id)
        changelog_meta = make_changelog_meta(mr_id)
        bugfix = make_bugfix_log_by_commits(commits)
        feat = make_feat_log_by_commits(commits)
        changelog_info = {
            "版本": changelog_meta["version"],
            "发版人": changelog_meta["author"],
            "Fix": bugfix,
            "Feature": feat
        }
        should_create_changelog = input("是否创建上线通知?(y/n):")
        if should_create_changelog and should_create_changelog.lower() == 'y':
            create_changelog_record(changelog_info=changelog_info)
    else:
        print("请提供 merge request id")

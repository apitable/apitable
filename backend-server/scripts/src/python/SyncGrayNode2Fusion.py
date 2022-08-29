import time

import pymongo
from rich.progress import Progress, TextColumn, BarColumn, TimeRemainingColumn
from vika import Vika

config = {
    'mongo_uri': 'mongodb://root:hrq*btk8MHT2ncz8fqp@'
                 'dds-1udce511b6af52f41677-pub.mongodb.rds.aliyuncs.com:3717,'
                 'dds-1udce511b6af52f42628-pub.mongodb.rds.aliyuncs.com:3717'
                 '/vikadata-integration?authSource=admin&replicaSet=mgset-61255194',
    'mongo_db': 'vikadata-integration',
    'mongo_document': 'vika_datasheet',

    'vika_api_token': 'uskhTNWQsYeSF4l0J6cmQKr',
    'vika_api_base': 'https://integration.vika.ltd',

    'vika_gray_space': 'spczdmQDfBAn5'
}

vika = Vika(config['vika_api_token'], api_base=config['vika_api_base'])

myclient = pymongo.MongoClient(config['mongo_uri'])

mydb = myclient[config['mongo_db']]
vika_datasheet = mydb[config['mongo_document']]

progress = Progress(
    TextColumn("[bold blue]空间站：{task.fields[space_id]} - 同步灰度数表数据", justify="right"),
    BarColumn(bar_width=None),
    "[progress.percentage]{task.percentage:>3.1f}%",
    "•",
    "[progress.detail]{task.completed}/{task.total}",
    "•",
    TimeRemainingColumn(),
)

if __name__ == '__main__':
    """
    暂时用来解决同步内网空间站新建表的灰度问题
    """

    query = {
        'spaceId': config['vika_gray_space'],
        'isDeleted': False
    }

    results = vika_datasheet.find(query)
    results_count = vika_datasheet.count_documents(query)

    with progress:
        task1 = progress.add_task('同步灰度数表', space_id=config['vika_gray_space'],
                                  total=results_count)

        datasheet = vika.datasheet("dst02HDrtyQ649dKT6", field_key="name")
        records = datasheet.records.all()

        for data in results:
            dstId = data.get('datasheetId')
            isDstExist = bool(records.filter(flagID=dstId).count())
            if not isDstExist:
                # 写入新创建的灰度表
                row = datasheet.records.create({
                    'flagID': dstId,
                    'space_id': config['vika_gray_space'],
                    '环境': ['integration'],
                    '灰度类型': 'Fusion'
                })
                # print(row)
                time.sleep(0.2)
            progress.update(task1, advance=1)

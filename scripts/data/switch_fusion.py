from vika.utils import chunks

from db import get_database, get_vika

dbname = get_database()

vika = get_vika()


def switch_fusion_api_dst(space_id, env="integration"):
    """
    灰度完空间站后，空间站里面的 fusion 也需要打到 teamx
    """
    dst = vika.datasheet("dst02HDrtyQ649dKT6")
    all_space_dst_ids = []
    for dst_records in dbname.get_collection('vika_datasheet').find({
            "spaceId":
            space_id,
            "isDeleted":
            False
    }):
        all_space_dst_ids.append(dst_records.get('datasheetId'))
    all_records = dst.records.all()
    print(all_records)
    all_inited_dst_ids = [r.flagID for r in all_records]
    need_init_dst_ids = set(all_space_dst_ids) - set(all_inited_dst_ids)
    need_init_dst_ids = list(need_init_dst_ids)
    need_init_dst_record = [{
        "flagID": dst_id,
        "space_id": space_id,
        "环境": [env],
    } for dst_id in need_init_dst_ids]
    print(need_init_dst_record)
    for batch_records in chunks(need_init_dst_record, 10):
        dst.records.bulk_create(batch_records)


if __name__ == "__main__":
    """
    改下 switch_fusion_api_dst 传入的 spaceId 换成要灰度的
    """
    switch_fusion_api_dst("spc5m6H5ZUQ2z", env="teamx")
    pass

import { FC, useState } from 'react';
import { Card } from 'antd';
import { Popconfirm } from './popconfirm';
import { Button } from '@vikadata/components';
export const PopconfirmUI: FC = () => {
  const [show, setShow] = useState(false);
  const handleVisibleChange = visible => {
    setShow(visible);
  };
  return (
    <div>
      <Card title="用法">
        <ul>
          <li>用户操作需要二次确认时，在元素附近弹出popconfirm提示用户</li>
          <li>当popconfirm出现时页面的「滚动」交互行为是禁止的</li>
          <li>点击空白区域为「关闭」操作</li>
        </ul>
      </Card>
      <Card title="四种布局">
        <Popconfirm 
          title="哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈" 
          content="哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈" 
          trigger="click" 
          onOk={()=>{setShow(false);}} 
          visible={show}
          onVisibleChange={handleVisibleChange}
        >
          <Button>icon+标题+正文+确定+取消</Button>
        </Popconfirm>
        <Popconfirm title="哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈" content="正文" trigger="focus">
          <Button>标题+正文+确定+取消</Button>
        </Popconfirm>
        <Popconfirm title="Title" trigger="click">
          <Button>标题+正文+确定</Button>
        </Popconfirm>
        <Popconfirm content="哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈" trigger="click">
          <Button>正文+确定</Button>
        </Popconfirm>
      </Card>
      <Card title="trigger属性定义了三种触发方式: 鼠标移入、聚集、点击">
        <Popconfirm title="Title" trigger="hover">
          <Button>hover</Button>
        </Popconfirm>
        <Popconfirm title="Title" trigger="focus">
          <Button>focus</Button>
        </Popconfirm>
        <Popconfirm title="Title" trigger="click">
          <Button>click</Button>
        </Popconfirm>
      </Card>
    </div>
  );
};
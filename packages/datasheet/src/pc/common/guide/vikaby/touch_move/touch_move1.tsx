import { FC, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as React from 'react';
import { useSize } from 'ahooks';
import { useMouse, useMount } from 'ahooks';
import styles from './style.module.less';
const initTransform = { x: '0px', y: '0px', rotate: '0deg' };

interface ITouchMove {
  id: string;
  initPosition: {
    left: string;
    top: string;
  };
  sessionStorageKey: string;
  onResize?: () => void;
  onClick?: (e: any) => void; // 单击事件回调
}

interface ISize {
  width: number;
  height: number;
}
interface ITouchState {
  isDragging: boolean,
  originT: {x:number, y:number, w:number, h:number},
  originE: {x:number, y:number},
  position: {left: string, top: string},
  transform: {x: string, y: string, rotate: string},
  prevBodySize: ISize,
}
interface IStickingWall {
  originTW?: number;
  originTH?: number;
}
const CRITICAL_VALUE = 5;
export const TouchMove: FC<ITouchMove> = (props) => {
  const { id, initPosition, sessionStorageKey, onResize, onClick } = props;
  const ref = useRef(null);
  const { clientX, clientY } = useMouse();
  const bodySize = useSize(document.body);
  const [state, setState] = useState<ITouchState>({
    isDragging: false,
    originT: { x:0, y:0,w:0,h:0 },
    originE: { x:0, y:0 },
    position: initPosition,
    transform: initTransform,
    prevBodySize: { width: 0, height: 0 },
  });
  
  useMount(()=>{
    const target = document.querySelector('#'+id) as HTMLDivElement;
    if(!target) return;
    const originTW = target.offsetWidth || 0;
    const originTH = target.offsetWidth || 0;
    setState({
      ...state,
      originT: {
        ...state.originT,
        w: originTW,
        h: originTH,
      },
      prevBodySize: bodySize as ISize || { width: document.body.offsetWidth, height: document.body.offsetHeight },
    });
    stickingWall({ originTW, originTH });
  });
  
  useEffect(()=>{
    if(!state.isDragging) return;
    const curLeft = clientX - (state.originE.x - state.originT.x);
    const curTop = clientY - (state.originE.y - state.originT.y);
    const maxLeft = document.body.offsetWidth - state.originT.w;
    const maxTop = document.body.offsetHeight - state.originT.h;
    const left = curLeft >= 0 ? Math.min(curLeft, maxLeft) : 0;
    const top = curTop >= 0 ? Math.min(curTop, maxTop) : 0;
    const position = { left: left + 'px',top: top + 'px' };
    setState(state => ({
      ...state,
      position,
    }));
  }, [clientX, clientY, state.isDragging, state.originT, state.originE]);
 
  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    const target = document.querySelector('#'+id) as HTMLDivElement;
    if(!target) return;
    setState(state => ({
      ...state,
      isDragging: true,
      originE: { x: clientX, y: clientY },
      originT: {
        x: target.offsetLeft,
        y: target.offsetTop,
        w: target.offsetWidth,
        h: target.offsetHeight,
      },
    }));
  }, [id]);
  
  // 如果贴边，则吸墙
  const stickingWall = useCallback((data: IStickingWall) => {
    const { originTW = state.originT.w, originTH = state.originT.h } = data;
    const { left, top } = state.position;
    if (parseInt(left) < CRITICAL_VALUE) {
      setState(state => ({ ...state,transform: { x: '-50%', y: '0px', rotate: '40deg' }}));
      return;
    }
    if (parseInt(top)< CRITICAL_VALUE) {
      setState(state => ({ ...state,transform: { x: '0px', y: '-50%', rotate: '180deg' }}));
      return;
    }
    if (parseInt(left) > document.body.offsetWidth - originTW - CRITICAL_VALUE) {
      setState(state => ({ ...state,transform: { x: '50%', y: '0px', rotate: '-40deg' }}));
      return;
    }
    if (parseInt(top) > document.body.offsetHeight - originTH - CRITICAL_VALUE) {
      setState(state => ({ ...state,transform: { x: '0px', y: '50%', rotate: '0deg' }}));
      return;
    }
    setState(state => ({ ...state,transform: initTransform }));
  },[state]);

  const handleMouseOut = useCallback(() => {
    if(state.isDragging) return;
    stickingWall({});
  },[stickingWall, state.isDragging]);

  // 存储数据到sessionStorage
  const saveDataToSessionStorage = useCallback(({ left, top }) => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify({
      left,
      top,
    }));
  }, [sessionStorageKey]);

  const handleMouseOver = useCallback(() => {
    if(state.transform.x !== '0px' || state.transform.y !== '0px'){
      setState(state => ({ ...state,transform: initTransform }));
    }
  }, [state.transform]);

  const handleMouseUp = useCallback(e => {
    if(state.originE.x === e.clientX && state.originE.y === e.clientY){
      onClick && onClick(e);
    }else{
      saveDataToSessionStorage({ left: state.position.left, top: state.position.top });
    }
    setState(state => ({
      ...state,
      isDragging: false,
    }));
  }, [state.position, saveDataToSessionStorage, state.originE.x, state.originE.y, onClick]); 

  // 不要监听bodySize，因为useMount时会更新state，但是useMount时不需要执行handleResize里的逻辑，否则会使useMount里的数据更新被覆盖
  const handleResize = useCallback(() => {
    onResize && onResize();
    // 判断当前是否处于贴边状态，如果不是，则返回
    if(state.transform.x === '0px' && state.transform.y === '0px' || !bodySize){
      setState({ ...state, prevBodySize: bodySize as ISize });
      return;
    }
    const curLeft = state.position.left;
    const curTop = state.position.top;

    // 贴在右边
    if(state.transform.x !== '0px' && !state.transform.x.includes('-') && bodySize.width){
      const newLeft = `${bodySize.width - (state.prevBodySize.width - parseInt(curLeft))}px`;
      setState(state => ({
        ...state,
        position: { ...state.position, left: newLeft },
        prevBodySize: bodySize as ISize,
      }));
      saveDataToSessionStorage({ left: newLeft, top: state.position.top });
      return;
    }
    // 贴在底部
    if(state.transform.y !== '0px' && !state.transform.y.includes('-') && bodySize.height){
      const newTop = `${bodySize.height - (state.prevBodySize.height - parseInt(curTop))}px`;
      setState(state => ({
        ...state,
        position: { ...state.position, top: newTop },
        prevBodySize: bodySize as ISize,
      }));
      saveDataToSessionStorage({ left: state.position.left, top: newTop });
      return;
    }
  },[bodySize, state, saveDataToSessionStorage, onResize]);
  const handleCοntextMenu = () => {
    setState(state => ({
      ...state,
      isDragging: false,
    }));
  };
  useEffect(()=> {
    const target = document.querySelector('#'+id) as HTMLDivElement;
    if(!target) return;

    target.addEventListener('mousedown', handleMouseDown);
    target.addEventListener('mouseup', handleMouseUp);
    target.addEventListener('mouseout', handleMouseOut);
    target.addEventListener('mouseover', handleMouseOver);
    target.addEventListener('contextmenu', handleCοntextMenu);
    window.addEventListener('resize', handleResize);
    return () => {
      target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('mouseout', handleMouseOut);
      target.removeEventListener('mouseover', handleMouseOver);
      target.removeEventListener('contextmenu', handleCοntextMenu);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseOut, handleMouseOver, handleResize, id]);
  const touchStyle: React.CSSProperties = useMemo(() => ({
    left: `${state.position.left}`,
    top: `${state.position.top}`,
    transition: state.isDragging ? 'none' : 'all 0.3s',
    transform: `translate(${state.transform.x}, ${state.transform.y})  rotate(${state.transform.rotate})`,
  }), [state.transform, state.position, state.isDragging]);
  return (
    <div
      id={id}
      style={{ ...touchStyle }}
      className={styles.touchMove}
      ref={ref}
    >
      { props.children }
    </div>
  );
};

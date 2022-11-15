import React, { useEffect } from 'react';
import { TitleFavoriteFilled } from '@apitable/icons';

export const IconUseInCanvas = () => {
  useEffect(()=>{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas){
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      const p = new Path2D(TitleFavoriteFilled.toString());
      ctx.fill(p);
    }
  },[]);
  return (
    <div>
      <TitleFavoriteFilled />   
      <canvas id="canvas" height="50" style={{ backgroundColor: '#eee' }}/>
    </div>
  );
};
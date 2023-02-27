/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect } from 'react';
import { StarFilled } from '@apitable/icons';

export const IconUseInCanvas = () => {
  useEffect(()=>{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas){
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      const p = new Path2D(StarFilled.toString());
      ctx.fill(p);
    }
  },[]);
  return (
    <div>
      <StarFilled />   
      <canvas id="canvas" height="50" style={{ backgroundColor: '#eee' }}/>
    </div>
  );
};
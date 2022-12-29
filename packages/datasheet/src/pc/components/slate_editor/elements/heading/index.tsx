import { memo } from 'react';
import Heading, { IHeadingProps, THeadingDepth } from './heading';

const factor = (depth: THeadingDepth) => {
  return memo((props: Omit<IHeadingProps, 'depth'>) => <Heading {...props} depth={depth} />);
};

export const HeadingOne = factor(1);
export const HeadingTwo = factor(2);
export const HeadingThree = factor(3);
export const HeadingFour = factor(4);
export const HeadingFive = factor(5);
export const HeadingSix = factor(6);
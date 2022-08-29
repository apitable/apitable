import { IUseSelectProps, useSelectIndex } from 'hooks';

interface IUseListInteractive {
  activeItemClass: string;
}

type IUnionProps = IUseSelectProps & IUseListInteractive;

export const useListInteractive = (options: IUnionProps) => {
  const { activeItemClass } = options;
  const { index: activeIndex, setIndex: setActiveIndex } = useSelectIndex({ ...options, activeItemClass: `.${activeItemClass}` });

  // TODO: 考虑下怎么结合 Hover 和键盘事件，将两个 class 合成一个
  // 目前将两者分开处理 20201007
  // const onHoverListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (!classList.contains(activeItemClass)) {
  //     classList.add(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  // const onOutListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (classList.contains(activeItemClass)) {
  //     classList.remove(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  return {
    activeIndex: activeIndex,
    setActiveIndex: setActiveIndex,
    // onHoverListItem: onHoverListItem,
    // onOutListItem: onOutListItem,
  };
};

import React,  { Dispatch, SetStateAction, useRef, useState, useEffect, useCallback }  from 'react';
import styles from './index.module.less'
import { _css } from '@/utils/dom'
import bus from '@/utils/bus'
interface Props {
  // props types
 index: number,
 onChangeIndex: Dispatch<SetStateAction<number>>;
 tabTexts: string[],
 name?: string
}

const Tabs: React.FC<Props> = ({
  index,
  onChangeIndex,
  tabTexts,
  name
}) => {
  const tabsRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [lefts, setLefts] = useState<number[]>([])
  const [indicatorSpace, setIndicatorSpace] = useState(0)
  const change = (index: number) => {
    onChangeIndex(index)
    if (indicatorRef.current) {
      _css(indicatorRef.current, 'transition-duration', `300ms`)
      _css(indicatorRef.current, 'left', lefts[index] + 'px')
    }
  }

   // 初始化 Tabs
  const initTabs = () => {
    if (!tabsRef.current || !indicatorRef.current) return;

    const tabs = tabsRef.current;
    const indicator = indicatorRef.current;

    // 获取指示器的宽度
    const indicatorWidth = parseFloat(window.getComputedStyle(indicator).width);

    const leftsArray: number[] = [];
    for (let i = 0; i < tabs.children.length; i++) {
      const item = tabs.children[i] as HTMLElement;
      const tabWidth = parseFloat(window.getComputedStyle(item).width);

      // 计算每个 Tab 的 left 值
      const left =
        item.getBoundingClientRect().x -
        tabs.children[0].getBoundingClientRect().x +
        (tabWidth * 0.5 - indicatorWidth / 2);

      leftsArray.push(left);
    }
    setLefts(leftsArray); // 更新 lefts
    setIndicatorSpace(leftsArray[1] - leftsArray[0]); // 更新 indicatorSpace

    // 设置指示器的样式
    indicator.style.transitionDuration = '300ms';
    indicator.style.left = `${leftsArray[index]}px`;
  };

  //  const [moveY, setMoveY] = useState(0)

  const move = useCallback((e: number) => {
    if (indicatorRef.current) {
      _css(indicatorRef.current, 'transition-duration', `0ms`)
      _css(
        indicatorRef.current,
        'left',
        lefts[index] + 'px'
      )
    }
  }, [index, lefts])
  const end = useCallback((index: number) => {
    // setMoveY(0)
    if (indicatorRef.current) {
      _css(indicatorRef.current, 'transition-duration', `300ms`)
      _css(indicatorRef.current, 'left', lefts[index] + 'px')
      setTimeout(() => {
        _css((indicatorRef.current as any), 'transition-duration', `0ms`)
      }, 300)
    }
  }, [index, lefts])
  // 在组件挂载后执行 initTabs
  useEffect(() => {
   initTabs();
  }, []);
  useEffect(() => {
    bus.on(name + '-moveX', move)
    // bus.on(name + '-moveY', (e) => {
    //   setMoveY(e)
    // })
    bus.on(name + '-end',end)
    return () => {
      bus.off(name + '-moveX', move)
      // bus.off(name + '-moveY')
      bus.off(name + '-end', end)
    }

  }, [index, lefts]);

  return (
    <div className={styles["tab-ctn"]}>
      <div className={styles["tabs"]} ref={tabsRef}>
        {
          tabTexts.map((text, idx) => {
            return (
              <div
                key={text}
                className={`${styles['tab']} ${index === idx ? styles['active'] : ''}`}
                onClick={() => change(idx)}
              >
                <span>{text}</span>
              </div>
            )
          })
        }
      </div>
      <div className={styles["indicator"]} ref={indicatorRef}></div>
    </div>
  );
};

export default Tabs;
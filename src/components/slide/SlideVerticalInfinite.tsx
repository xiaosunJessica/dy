import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { SlideType } from '@/utils/const_var';
import SlideItem from './SlideItem';
import { slideInit, getSlideOffset, slideTouchStart, slideTouchMove, slideTouchEnd, slideReset} from '@/utils/slide'
import { _css } from '@/utils/dom';
import bus, { EVENT_KEY } from '@/utils/bus'
import ReactDOM from 'react-dom/client';

interface Props {
  // props types
  children?: ReactNode,
  name?: string,
  index: number,
  onChangeIndex: any,
  list: any[],
  virtualTotal: number,
  onLoadMore: () => void
  onRefresh: () => void,
  active: Boolean,
  uniqueId: string
  render: (item: any, index: number, play: boolean, uniqueId: string) => any
}
const itemClassName = 'slide-item'

// 示例使用
const appInsMap = new Map();

const SlideVerticalInfinite: React.FC<Props> = (props) => {
  const slideListEl: React.RefObject<HTMLDivElement|null> = useRef(null)

  const oldList = useRef([])


  const [state, setState] = useState({
    judgeValue: 20,
    type: SlideType.VERTICAL_INFINITE,
    name: props.name,
    localIndex: props.index,
    needCheck: true,
    next: false,
    isDown: false,
    start: { x: 0, y: 0, time: 0 },
    move: { x: 0, y: 0 },
    wrapper: { width: 0, height: 0, childrenLength: 0 }
  })


  const handlePointerDown = useCallback((e: any) => {
    slideTouchStart(e, slideListEl.current, setState)
  }, [slideListEl])

  const handlePointerMove = useCallback((e: any) => {
    slideTouchMove(e, slideListEl.current, state, setState)
  }, [state, slideListEl])

  const canNext = (isNext: boolean) => {
      return !(
        (state.localIndex === 0 && !isNext) ||
        (state.localIndex === props.list.length - 1 && isNext)
      )
    }

  const handlePointerUp = useCallback((e: any) => {
    // let isNext = state.move.y < 0
    // if (state.localIndex ===0 && !isNext && state.move.y > )
    slideTouchEnd({
      e,
      state,
      updateState:setState,
      canNextCb: canNext,
      nextCb: async (isNext: boolean) => {
        let half = parseInt((props.virtualTotal / 2).toString()) // 虚拟列表的一半
        if (props.list.length > props.virtualTotal) {
          // 手指往上滑（即列表展示下一条内容）
          if(isNext) {
            if (state.localIndex > props.list.length - props.virtualTotal && state.localIndex > half) {
              props.onLoadMore()
            }

            if (state.localIndex > half && state.localIndex < props.list.length - half) {
              let addItemIndex: number = state.localIndex + half
              let cls = `.${itemClassName}[data-index='${addItemIndex}']`
              console.log(cls, '0000')
              let res = slideListEl.current?.querySelector(cls)
              if (!res) {
                let child: any = await getInsEl(props.list[addItemIndex], addItemIndex)
                slideListEl.current?.appendChild(child)
              }

              let index = slideListEl.current?.querySelector(`.${itemClassName}:first-child`)?.getAttribute('data-index')
              appInsMap.get(Number(index)).unmount(index)

              slideListEl.current?.querySelectorAll(`.${itemClassName}`).forEach((item) => {
                _css(item, 'top', `${(state.localIndex - half) * state.wrapper.height}`)
              })

            }
          }
        }

      }
    })
    slideReset(e, slideListEl.current, state, setState, props.onChangeIndex)
  }, [state, slideListEl, props.onChangeIndex])


  const getInsEl = (item: any, index: number, play =false) => {
    let slideVNode = props.render(item, index, play, props.uniqueId)
    const parent = document.createElement('div')

    if (process.env.NODE_ENV === 'production') {

    } else {
      const App = () => <SlideItem dataIndex={index}>{slideVNode}</SlideItem>
      // 使用 createRoot 渲染组件
      const root = ReactDOM.createRoot(parent);
      root.render(<App />);

      // 将卸载函数存入 appInsMap
      appInsMap.set(index, {
        unmount: (idx: number) => {
          let el = document.querySelector(`.${itemClassName}[data-index='${idx}']`)
         el?.remove()
        }
      });

      return new Promise<HTMLElement>((resolve) => {
        const checkAndResolve = () => {
          if (parent.firstChild) {
            resolve(parent.firstChild as HTMLElement);  // 返回真实 DOM
          } else {
            setTimeout(checkAndResolve, 50);  // 每50毫秒检查一次，直到 DOM 渲染完成
          }
        };
        checkAndResolve();
      });
      // console.log(parent.firstChild, 'parentparentparent', parent)
      // return parent.firstChild as HTMLElement;
    }
  }

  // 插入SlideItem
  const insertContent = () => {
    if (!props.list.length) return

    // 清空SlideList
    if (slideListEl.current) {
      slideListEl.current.innerHTML = ''
      // 虚拟列表的一半
      let half = parseInt((props.virtualTotal / 2).toString())
      //因为我们只渲染 props.virtualTotal 条数据到dom中，并且当前index有可能不是0，所以需要计算出起始下标和结束下标
      let start = 0
      if (state.localIndex > half) {
        start = state.localIndex - half
      }

      let end = start + props.virtualTotal
      // 判断end是否超过最大值
      if (end >= props.list.length) {
        end = props.list.length
        start = end - props.virtualTotal
      }
      // 判断start是否低于最小值
      if (start < 0) start = 0

      // 插入start到end范围内的数据到dom中
      props.list.slice(start, end).map(async (item, index) => {
        let el: any = await getInsEl(item, start + index, start + index === state.localIndex)
        slideListEl.current?.appendChild(el)
      })

      _css(slideListEl.current,'transform',  `translate3d(0px,${getSlideOffset(state, slideListEl.current)}px,  0px)`)

       //因为index有可能不是0，所以要设置Item的top偏移量


       if (state.localIndex > 2 && props.list.length > 5) {
        let list = slideListEl.current.querySelectorAll(`.${itemClassName}`)
        list.forEach((item) => {
          if (list.length - state.localIndex > 2) {
            _css(item, 'top', `${(state.localIndex - 2) * state.wrapper.height}`)
          } else {
            _css(item, 'top', `${start * state.wrapper.height}`)
          }
        })
       }

       setState((prevState) => ({
        ...prevState,
        wrapper: {
          ...prevState.wrapper,
          childrenLength: (slideListEl.current as any).children.length
        }
       }))

       bus.emit(EVENT_KEY.CURRENT_ITEM, props.list[state.localIndex])

    }
  }

  // 监听list变化
  useEffect(() => {

    if (props.list.length <= oldList.current.length) {
      // 新数据长度小于老数据长度，刷新
      insertContent()
    } else {
      // 没数据就直接插入
      if (oldList.current.length === 0) {
        insertContent()
      }
    }
  }, [props.list])

  useEffect(() => {
    if (props.active && !props.list.length) {
      props.onRefresh()
      return
    }
  }, [])

  useEffect(() => {
    slideInit(slideListEl.current, state, setState)
  }, [])

  // 绑定事件
   useEffect(() => {
      const slideListElement = slideListEl.current;

      const touchStartListener = (e: any) => {
        // e.preventDefault();
        handlePointerDown(e);
      };
      const touchMoveListener = (e: any) => {
        // e.preventDefault();
        handlePointerMove(e)
      };
      const touchEndListener = (e: any) => {
        // e.preventDefault();
        handlePointerUp(e)
      };
      if (slideListElement) {
        // Add non-passive event listeners
        slideListElement.addEventListener('touchstart', touchStartListener, { passive: false });
        slideListElement.addEventListener('touchmove', touchMoveListener, { passive: false });
        slideListElement.addEventListener('touchend', touchEndListener, { passive: false });

        // Cleanup event listeners when component unmounts
        return () => {
          slideListElement.removeEventListener('touchstart', touchStartListener);
          slideListElement.removeEventListener('touchmove', touchMoveListener);
          slideListElement.removeEventListener('touchend', touchEndListener);
        };
      }
    }, [handlePointerDown, handlePointerMove, handlePointerUp]);


  return (
    <div className='slide slide-infinite' onClick={() => {console.log('---infinite')}}>
      <div
        className="slide-list flex-direction-column"
        ref={slideListEl}
      >
        {props.children}
      </div>
    </div>
  );
};

export default SlideVerticalInfinite;
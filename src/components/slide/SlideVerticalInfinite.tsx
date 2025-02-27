import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { SlideType } from '@/utils/const_var';
import { slideInit, getSlideOffset } from '@/utils/slide'
import { _css } from '@/utils/dom';
import bus, { EVENT_KEY } from '@/utils/bus'
interface Props {
  // props types
  children?: ReactNode,
  name?: string,
  index: number,
  list: any[],
  virtualTotal: number,
  onLoadMore: () => void
  onRefresh: () => void,
  active: Boolean
}
const itemClassName = 'slide-item'

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

  const touchStart = () => {

  }

  const touchMove = () => {

  }

  const touchEnd = () => {

  }

  const getInsEl = (item: any, index: number, play =false) => {

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
      props.list.slice(start, end).map((item, index) => {
        let el: any = getInsEl(item, start + index, start + index === state.localIndex)
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

  return (
    <div className='slide slide-infinite'>
      <div
        className="slide-list flex-direction-column"
        ref={slideListEl}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        {props.children}
      </div>
    </div>
  );
};

export default SlideVerticalInfinite;
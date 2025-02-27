import { SlideType } from '@/utils/const_var'; // Assuming SlideType is already imported
import { _css } from './dom'
import bus from './bus';
import { _stopPropagation } from '.';


function checkEvent(e: any) {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  if (!isMobile || (isMobile && e instanceof PointerEvent)) {
    e.touches = [
      {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
      }
    ]
  }
  return true
}


export function slideInit(el: any,state: any, updateState: (arg0: (prevState: any) => any) => void) {
  updateState((prevState: any) => ({
    ...prevState,
    wrapper: {
      width: _css(el, 'width'),
      height: _css(el, 'height'),
      childrenLength: el.children.length
    }
  }))

  //获取偏移量
  const t = getSlideOffset(state, el)
  let dx1 = 0,
    dx2 = 0
  if (state.type === SlideType.HORIZONTAL) dx1 = t
  else dx2 = t
  _css(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
}

/**
 * Function to check if the slide can occur based on the current move distance
 * @param state The current state of the slide
 * @returns {boolean} True if the slide can occur, false otherwise
 */
export const canSlide = (state: any, updateState: any): boolean => {
  if (state.needCheck) {
    if (Math.abs(state.move.x) > state.judgeValue || Math.abs(state.move.y) > state.judgeValue) {
      const angle = (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10);
      const next = state.type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1;
      updateState((prevState: any) => ({
        ...prevState,
        next,
        needCheck: false
      }))
      return next
    } else {
      return false;
    }
  }
  return state.next;
};

/**
 * Function to check if the slide can continue in the specified direction
 * @param state The current state of the slide
 * @param isNext Boolean indicating if the slide is moving forward
 * @returns {boolean} True if the slide can continue, false otherwise
 */
export const canNext = (state: any, isNext: boolean): boolean => {
  return !(
    (state.localIndex === 0 && !isNext) ||
    (state.localIndex === state.wrapper.childrenLength - 1 && isNext)
  );
};


/**
 * 开始滑动
 * @param e
 * @param el
 * @param updateState
 * @returns
 */
export function slideTouchStart(e: any, el: any, updateState: any) {

  if (!checkEvent(e)) return

  _css(el, 'transition-duration', '0ms')

  updateState((prevState: any) => ({
    ...prevState,
    start: {
      x: e.touches[0].pageX, ////记录起点坐标，用于move事件计算移动距离
      y: e.touches[0].pageY,
      time: Date.now(), //记录按下时间，用于up事件判断滑动时间
    },
    isDown: true
  }))

}

/*
 * 滑动move事件
 *
 * @export
 * @param {*} e
 * @param {*} el
 * @param {{ isDown: any; start: { x: number; y: number }; type: number; move: { x: number; y: number }; localIndex: number; name: string }} state
 * @param {(arg0: (prevState: any) => any) => void} updateState
* */
export function slideTouchMove(e: any, el: any, state: any, updateState: (arg0: (prevState: any) => any) => void, canNextCb?: any) {
  if (!checkEvent(e)) return
  if (!state.isDown) return

  //计算移动距离
  updateState((prevState) => ({
    ...prevState,
    move: {
      x: e.touches[0].pageX - state.start.x,
      y: e.touches[0].pageY - state.start.y
    }
  }))

  //检测能否滑动
  const canSlideRes = canSlide(state, updateState)


  //是否在往到头或尾滑动
  const isNext = state.type === SlideType.HORIZONTAL ? state.move.x < 0 : state.move.y < 0


  //特别处理：竖直的slide组件，在第一页往下滑动时，向外发送事件
  //用于首页顶部导航栏的刷新动画
  if (state.type === SlideType.VERTICAL_INFINITE) {
    if (canSlideRes && state.localIndex === 0 && !isNext) {
      bus.emit(state.name + '-moveY', state.move.y)
    }
  }

  if (canSlideRes) {
    //如果传了就用，没传就用默认的
    //无限滑动组件，要特别判断，所以需要传canNextCb
    if (!canNextCb) canNextCb = canNext
    if (canNextCb(state, isNext)) {
      (window as any).isMoved = true
      //能滑动，那就把事件捕获，不能给父组件处理
      _stopPropagation(e)
      if (state.type === SlideType.HORIZONTAL) {
        bus.emit(state.name + '-moveX', state.move.x)
      }
      //获取偏移量
      const t = getSlideOffset(state, el) + (isNext ? state.judgeValue : -state.judgeValue)
      let dx1 = 0,
        dx2 = 0
      //偏移量加当前手指移动的距离就是slide要偏移的值
      if (state.type === SlideType.HORIZONTAL) {
        dx1 = t + state.move.x
      } else {
        dx2 = t + state.move.y
      }
      _css(el, 'transition-duration', `0ms`)
      _css(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
    }
  }
}

/*
 *  滑动结束事件
 *
 * @export
 * @param {*} e
 * @param {*} state
 * @param {*} updateState
 * @param {(((arg0: any, arg1: boolean) => any) | null)} canNextCb
* */

export function slideTouchEnd(e: any, state: any, updateState: any, canNextCb: ((arg0: any, arg1: boolean) => any) | null)  {
  if (!checkEvent(e)) return
  if (!state.isDown) return

  if (state.next) {
    const isHorizontal = state.type === SlideType.HORIZONTAL
    const isNext = isHorizontal ? state.move.x < 0 : state.move.y < 0

    if (!canNextCb) canNextCb = canNext

    if (canNextCb(state, isNext)) {
       //2024-04-25：换成pointer事件之后不能捕获了，需要让父组件重置自己的isDown，不然PC上move事件会一直触发
      // _stopPropagation(e)

      //结合时间、距离来判断是否成功滑动
      const endTime = Date.now()
      let gapTime = endTime - state.start.time
      const distance = isHorizontal ? state.move.x : state.move.y
      const judgeValue = isHorizontal ? state.wrapper.width : state.wrapper.height
      //1、距离太短，直接不通过
      if (Math.abs(distance) < 20) gapTime = 1000
      //2、距离太长，直接通过
      if (Math.abs(distance) > judgeValue / 3) gapTime = 100
      //3、若不在上述两种情况，那么只需要判断时间即可
      if (gapTime < 150) {
        if (isNext) {
          updateState((prevState: any) => ({
            ...prevState,
            localIndex: prevState.localIndex + 1
          }))
        } else {
         updateState((prevState: any) => ({
            ...prevState,
            localIndex: prevState.localIndex - 1
          }))
        }
        // return nextCb?.(isNext)
      }
    }

  }
}

export function slideReset(e: any, el: any, state: any, updateState: any, updateIndex: any) {
  if (!checkEvent(e)) return

  _css(el, 'transition-duration', `300ms`)

  const t = getSlideOffset(state, el)

  let dx1 = 0
  let dx2 = 0
  if (state.type === SlideType.HORIZONTAL) {
    bus.emit(state.name + '-end', state.localIndex)
    dx1 = t
  } else {
    bus.emit(state.name + '-end')
    dx2 = t
  }
  _css(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)

  updateState((prevState: any) => ({
    ...prevState,
    start: {
      x: 0,
      y: 0,
      time: 0
    },
    move: {
      x: 0,
      y: 0,
    },
    next: false,
    needCheck: true,
    isDown: false,
    isMoved: false
  }))

  console.log(state.localIndex, 'state.localIndexstate.localIndex')
  updateIndex(state.localIndex)
}

//根据当前index，获取slide偏移距离
//如果每个页面的宽度是相同均为100%，只需要当前index * wrapper的宽（高）度即可： -state.localIndex * state.wrapper.width
export function getSlideOffset(state: any, el: HTMLDivElement) {
  //横竖判断逻辑基本同理
  if (state.type === SlideType.HORIZONTAL) {
    let widths: any[] = []
    //获取所有子元素的宽度
    Array.from(el.children).map((v) => {
      widths.push(v.getBoundingClientRect().width)
    })
    //取0到当前index的子元素的宽度
    widths = widths.slice(0, state.localIndex)
    if (widths.length) {
      //累计就是当前index之前所有页面的宽度
      return -widths.reduce((a, b) => a + b)
    }
    return 0
    // return -state.localIndex * state.wrapper.width
  } else {
    //VERTICAL_INFINITE 列表只需要计算index * 高就行
    if (state.type === SlideType.VERTICAL_INFINITE) {
      return -state.localIndex * state.wrapper.height
    } else {
      //同上
      let heights: any[] = []
      Array.from(el.children).map((v) => {
        heights.push(v.getBoundingClientRect().height)
      })
      heights = heights.slice(0, state.localIndex)
      if (heights.length) return -heights.reduce((a, b) => a + b)
      return 0
    }
  }
}

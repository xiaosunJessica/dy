
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { getSlideOffset, slideInit, slideReset, slideTouchEnd, slideTouchMove, slideTouchStart } from '@/utils/slide';
// import { SlideType } from '@/utils/const_var';
// import { _css } from '@/utils/dom';

// interface SliderProps {
//   index: number;
//   name: string;
//   autoplay: boolean;
//   indicator: boolean;
//   changeActiveIndexUseAnim: boolean;
//   onUpdateIndex: (index: number) => void;
// }

// const SlideHorizontal: React.FC<SliderProps> = ({
//   index,
//   name,
//   autoplay,
//   indicator,
//   changeActiveIndexUseAnim,
//   onUpdateIndex,
// }) => {
//   const slideListEl = useRef<HTMLDivElement | null>(null);
//   const [state, setState] = useState({
//     judgeValue: 20,
//     type: SlideType.HORIZONTAL,
//     name,
//     localIndex: index,
//     needCheck: true,
//     next: false,
//     isDown: false,
//     start: { x: 0, y: 0, time: 0 },
//     move: { x: 0, y: 0 },
//     wrapper: {
//       width: 0,
//       height: 0,
//       childrenLength: 0,
//     },
//   });

//   const updateIndex = useCallback(
//     (newVal: number) => {
//       if (state.localIndex !== newVal) {
//         setState((prevState) => ({
//           ...prevState,
//           localIndex: newVal,
//         }));

//         if (changeActiveIndexUseAnim && slideListEl.current) {
//           _css(slideListEl.current, 'transition-duration', '300ms');
//         }

//         if (slideListEl.current) {
//           _css(
//             slideListEl.current,
//             'transform',
//             `translate3d(${getSlideOffset(state, slideListEl.current)}px, 0, 0)`
//           );
//         }
//       }
//     },
//     [state.localIndex, state, changeActiveIndexUseAnim]
//   );

//   useEffect(() => {
//     // Initialize the slide when the component is mounted
//     if (slideListEl.current) {
//       slideInit(slideListEl.current, state);
//     }

//     if (autoplay) {
//       const interval = setInterval(() => {
//         if (state.localIndex === state.wrapper.childrenLength - 1) {
//           onUpdateIndex(0);
//         } else {
//           onUpdateIndex(state.localIndex + 1);
//         }
//       }, 3000);

//       return () => clearInterval(interval);
//     }

//     // Observe the child elements' count
//     const observer = new MutationObserver(() => {
//       if (slideListEl.current) {
//         setState((prevState) => ({
//           ...prevState,
//           wrapper: {
//             ...prevState.wrapper,
//             childrenLength: slideListEl.current.children.length,
//           },
//         }));
//       }
//     });

//     if (slideListEl.current) {
//       observer.observe(slideListEl.current, { childList: true });
//     }

//     return () => observer.disconnect();
//   }, [state, autoplay, onUpdateIndex]);

//   useEffect(() => {
//     updateIndex(index);
//   }, [index, updateIndex]);

//   const touchStart = (e: React.PointerEvent) => {
//     slideTouchStart(e, slideListEl.current, state);
//   };

//   const touchMove = (e: React.PointerEvent) => {
//     slideTouchMove(e, slideListEl.current, state);
//   };

//   const touchEnd = (e: React.PointerEvent) => {
//     slideTouchEnd(e, state);
//     slideReset(e, slideListEl.current, state, onUpdateIndex);
//   };

//   return (
//     <div className="slide horizontal">
//       {/* Indicator bullets */}
//       {indicator && state.wrapper.childrenLength > 0 && (
//         <div className="indicator-bullets">
//           {Array.from({ length: state.wrapper.childrenLength }).map((_, i) => (
//             <div
//               className={`bullet ${state.localIndex === i ? 'active' : ''}`}
//               key={i}
//             ></div>
//           ))}
//         </div>
//       )}

//       {/* Slide list */}
//       <div
//         className="slide-list"
//         ref={slideListEl}
//         onPointerDown={touchStart}
//         onPointerMove={touchMove}
//         onPointerUp={touchEnd}
//       >
//         {{children}} {/* This should be replaced by actual children */}
//       </div>
//     </div>
//   );
// };

// export default SlideHorizontal

import React, { ReactNode} from 'react';

interface Props {
  // props types
  children?: ReactNode
}

const SlideHorizontal: React.FC<Props> = ({children}) => {
  return (
    <div className="slide horizontal">
      {children}
    </div>
  );
};

export default SlideHorizontal;
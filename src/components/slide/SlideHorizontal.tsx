import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SlideType } from '@/utils/const_var'; // Assuming SlideType is already imported
import { slideReset, slideTouchEnd, slideTouchMove, slideTouchStart, slideInit } from '@/utils/slide'

interface Props {
  children?: React.ReactNode;
  cls?: string;
  name: string;
  index: number;
  onChangeIndex: (React.Dispatch<React.SetStateAction<number>>) | any;
}

const SlideHorizontal: React.FC<Props> = (props) => {
  const slideListEl: React.RefObject<HTMLDivElement|null> = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
    judgeValue: 20, // Threshold for detecting slide direction
    type: SlideType.HORIZONTAL,
    name: props.name,
    localIndex: props.index,
    needCheck: true, // Flag to check on each down event
    next: false, // Flag to check if slide is allowed
    isDown: false, // Flag for the touch start
    start: { x: 0, y: 0, time: 0 }, // Starting coordinates for touch
    move: { x: 0, y: 0 }, // Coordinates for move event
    wrapper: {
      width: 0,
      height: 0,
      childrenLength: 0, // Number of child elements for slide container
    },
  });

  const handlePointerDown = useCallback((e: any) => {
    slideTouchStart(e, slideListEl.current, setState)
  }, [slideListEl])

  const handlePointerMove = useCallback((e: any) => {
    slideTouchMove(e, slideListEl.current, state, setState)
  }, [state, slideListEl])

  const handlePointerUp = useCallback((e: any) => {
    console.log('handlePointerUp', state)
    slideTouchEnd({
      e,
      state,
      updateState: setState
    })
    slideReset(e, slideListEl.current, state, setState, props.onChangeIndex)
  }, [state, slideListEl, props.onChangeIndex])

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

  useEffect(() => {
    slideInit(slideListEl.current, state, setState)
  }, [])

  return (
    <div className={`slide horizontal ${props.cls || ''}`}>
      <div
        className="slide-list"
        ref={slideListEl}
      >
        {props.children}
      </div>
    </div>
  );
};

export default SlideHorizontal;

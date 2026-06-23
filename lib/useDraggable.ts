import { useState, useEffect, useRef, RefObject } from 'react';

interface DragState {
  isDragging: boolean;
  position: { x: number; y: number };
}

export const useDraggable = (
  initialX: number = 0,
  initialY: number = 0
): {
  position: { x: number; y: number };
  dragHandleRef: RefObject<HTMLDivElement | null>;
} => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    position: { x: initialX, y: initialY },
  });

  // Reference for the header/handle element
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  // Offset between mouse click and modal top-left
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handle = dragHandleRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      // Don't start dragging if clicking on a button or interactive element
      if ((e.target as HTMLElement).closest('button, a, input, textarea')) {
        return;
      }
      // Prevent selecting text while dragging
      e.preventDefault(); 
      setState((prev) => ({
        ...prev,
        isDragging: true,
      }));
      offsetRef.current = {
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;
      setState((prev) => ({
        ...prev,
        position: {
          x: e.clientX - offsetRef.current.x,
          y: e.clientY - offsetRef.current.y,
        },
      }));
    };

    const handleMouseUp = () => {
      setState((prev) => ({ ...prev, isDragging: false }));
    };

    if (handle) {
      handle.addEventListener('mousedown', handleMouseDown);
    }

    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (handle) {
        handle.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, state.position]);

  return { position: state.position, dragHandleRef };
};
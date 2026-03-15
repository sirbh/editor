// context/LayoutContext.tsx
import React, { createContext, useRef, useState, useCallback, useContext } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

type LayoutContextType = {
  leftRef: React.RefObject<ImperativePanelHandle | null>;
  rightRef: React.RefObject<ImperativePanelHandle | null>;
  leftOpen: boolean;
  rightOpen: boolean;
  isAnimating: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  stopAnimation: () => void;
  leftView: LeftView;
  rightView: RightView;
  setLeftView: (view: LeftView) => void;
  setRightView: (view: RightView) => void;
};

export type LeftView = "files" | "text";
export type RightView = "text";

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const leftRef = useRef<ImperativePanelHandle>(null);
  const rightRef = useRef<ImperativePanelHandle>(null);

  const [leftView, setLeftViewState] = useState<LeftView>("files");
  const [rightView, setRightViewState] = useState<RightView>("text");

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const stopAnimation = useCallback(() => setIsAnimating(false), []);
  
  const toggleLeft = useCallback(() => {
    setIsAnimating(true);
    if (leftOpen) leftRef.current?.collapse();
    else leftRef.current?.resize(20);
    setLeftOpen(!leftOpen);
    setTimeout(stopAnimation, 300);
  }, [leftOpen, stopAnimation]);

  const toggleRight = useCallback(() => {
    setIsAnimating(true);
    if (rightOpen) rightRef.current?.collapse();
    else rightRef.current?.expand();
    setRightOpen(!rightOpen);
    setTimeout(stopAnimation, 300);
  }, [rightOpen, stopAnimation]);


  const setLeftView = useCallback((view: LeftView) => {
    if (view === leftView && leftOpen) {
      toggleLeft(); // Close if clicking the same icon
    } else {
      setLeftViewState(view);
      if (!leftOpen) toggleLeft(); // Open if currently closed
    }
  }, [leftView, leftOpen, toggleLeft]);
  
  const setRightView = useCallback((view: RightView) => {
    if (view === rightView && rightOpen) {
      toggleRight(); // Close if clicking the same icon
    } else {
      setRightViewState(view);
      if (!rightOpen) toggleRight(); // Open if currently closed
    }
  }, [rightView, rightOpen, toggleRight]);


  return (
    <LayoutContext value={{
      leftRef, rightRef, leftOpen, rightOpen,
      isAnimating, toggleLeft, toggleRight, stopAnimation,
      leftView, rightView, setLeftView, setRightView
    }}>
      {children}
    </LayoutContext>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}


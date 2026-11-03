"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/** Called every animation frame by the lotus canvas while the hero is in view. */
export type HeroFrame = (p: number, P: number) => void;

type LandingCtx = {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalOpenRef: React.RefObject<boolean>;
  heroFrameRef: React.RefObject<HeroFrame | null>;
};

const Ctx = createContext<LandingCtx | null>(null);

export function LandingProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalOpenRef = useRef(false);
  const heroFrameRef = useRef<HeroFrame | null>(null);

  const openModal = useCallback(() => {
    modalOpenRef.current = true;
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    modalOpenRef.current = false;
    setModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({ modalOpen, openModal, closeModal, modalOpenRef, heroFrameRef }),
    [modalOpen, openModal, closeModal]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanding() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLanding must be used inside <LandingProvider>");
  return c;
}

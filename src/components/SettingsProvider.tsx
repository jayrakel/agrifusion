'use client';
import { createContext, useContext } from 'react';

const Ctx = createContext<Record<string,string>>({});
export function SettingsProvider({ children, settings }: { children: React.ReactNode; settings: Record<string,string> }) {
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}
export function useSettings() { return useContext(Ctx); }

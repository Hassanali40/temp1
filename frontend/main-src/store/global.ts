import { create } from 'zustand'
import { createSessionStore, ISessionStore } from './session'

export const useGlobalStore = create<ISessionStore>((...a) => ({
  ...createSessionStore(...a),
}))

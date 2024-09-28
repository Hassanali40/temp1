import { create } from 'zustand'
import { createSessionStore, ISessionStore } from './session'
import { createUserStore, IUserStore } from './user'

export interface IGlobalStore extends ISessionStore, IUserStore {}

export const useGlobalStore = create<IGlobalStore>((...a) => ({
  ...createSessionStore(...a),
  ...createUserStore(...a),
}))

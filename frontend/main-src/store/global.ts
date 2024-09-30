import { create } from 'zustand'
import { createUserStore, IUserStore } from './user'

export interface IGlobalStore extends IUserStore {}

export const useGlobalStore = create<IGlobalStore>((...a) => ({
  ...createUserStore(...a),
}))

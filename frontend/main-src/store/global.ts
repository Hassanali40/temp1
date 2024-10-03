import { create } from 'zustand';
import { createSessionStore, ISessionStore } from './session';
import { createUserStore, IUserStore } from './user';

export const useGlobalStore = create<ISessionStore & IUserStore>((...a) => ({
  ...createSessionStore(...a),
  ...createUserStore(...a),
}));

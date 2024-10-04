import { Session } from './session';

export type UserData = {
  id: string;
  bannerMessage: string;
  isAdmin: boolean;
  user: string;
  name: string;
  chatSessions: Session[] | [];
  activeSession: Session | null;
};

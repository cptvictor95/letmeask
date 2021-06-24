import { User } from "./User";

export interface AuthContextType {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

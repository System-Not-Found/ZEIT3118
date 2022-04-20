import type { AppProps } from 'next/app'
import { createContext, useState } from 'react';
import { User } from '../lib/types';

interface UserContextProps {
  user: User;
  toggleUser: (user: User) => void;
}

const emptyUser = {
  id: "",
  name: "",
  admin: false,
}
export const UserContext = createContext<UserContextProps>({ user: emptyUser, toggleUser: () => {}});

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>(emptyUser);
  return (
    <UserContext.Provider value={{ user: user, toggleUser: setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp

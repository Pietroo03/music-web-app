import { createContext } from "react";

// Il contesto è il canale condiviso tra provider e componenti che leggono o aggiornano lo stato di login.
export const AuthContext = createContext(null);

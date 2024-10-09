import { createContext, useContext } from "react";

interface TransactionContextType { refetchTransaction : () => Promise<void>}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => useContext(TransactionContext);
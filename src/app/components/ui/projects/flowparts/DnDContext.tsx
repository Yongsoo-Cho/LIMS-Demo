import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type DnDType = string | null;

type DnDContextType = [DnDType, Dispatch<SetStateAction<DnDType>>];

const DnDContext = createContext<DnDContextType | undefined>(undefined);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [type, setType] = useState<DnDType>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error("useDnD must be used within a DnDProvider");
  }
  return context;
};

export default DnDContext;

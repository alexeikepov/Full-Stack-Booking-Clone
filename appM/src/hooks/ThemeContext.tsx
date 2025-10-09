import { createContext, ReactNode, useContext } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../components/ui/Colors";
export type ThemeType = "light" | "dark";
interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof Colors.light;
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme() || "light";
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;
  return (
    <ThemeContext.Provider value={{ theme: colorScheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error();
  }
  return context;
};

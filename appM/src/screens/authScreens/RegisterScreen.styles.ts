import { StyleSheet } from "react-native";
import { Colors } from "../../components/ui/Colors";
import type { ThemeType } from "../../hooks/ThemeContext";

export const createRegisterStyles = (
  colors: typeof Colors.light,
  theme: ThemeType,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 40,
    },
    card: {
      backgroundColor:
        theme === "dark" ? "rgba(28,28,28,0.7)" : "rgba(255,255,255,0.85)",
      borderRadius: 12,
      padding: 24,
      marginHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 12,
      backgroundColor:
        theme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)",
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    form: {
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    inputError: {
      borderColor: colors.red,
    },
    inputFocused: {
      borderColor: colors.button,
    },
    errorText: {
      fontSize: 14,
      color: colors.red,
      marginTop: 4,
    },
    button: {
      height: 50,
      backgroundColor: colors.button,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    footerText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    linkText: {
      fontSize: 16,
      color: colors.button,
      fontWeight: "600",
    },
  });

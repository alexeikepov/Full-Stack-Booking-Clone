import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

export default function SignOutButton() {
  return (
    <Pressable style={styles.signOutButton}>
      <Text style={styles.signOutText}>Sign out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6a6a",
  },
});

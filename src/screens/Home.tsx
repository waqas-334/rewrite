import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { CrownIcon, MenuIcon, PasteIcon } from "@/components/icon";
import RightIcon from "@/components/icon/RightIcon";
import * as Clipboard from "expo-clipboard";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Home</Text>

      <TouchableOpacity style={styles.trialButton}>
        <CrownIcon width={20} height={16} fill="#FF9200" />
        <Text style={styles.trialText}>Free Trial</Text>
        <RightIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButtonContainer}>
        <MenuIcon width={16} height={10} />
      </TouchableOpacity>
    </View>
  );
};

const Home = () => {
  const [text, setText] = useState("");

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setText(clipboardText);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.heading}>Check your{"\n"}Grammar !</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Enter your text"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
            <PasteIcon width={12.92} height={15.42} />
            <Text style={styles.pasteText}>Paste</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    width: "100%",
    justifyContent: "space-between",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    color: "#000",
    fontFamily: "Inter",
  },
  trialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(254, 234, 207, 0.64)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 6,
  },
  trialText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Inter",
  },

  menuButtonContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  heading: {
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: "rgba(0, 0, 0, 1)",
  },
  pasteButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    // opacity: 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: 83,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
  },
  pasteText: {
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
  },
  checkButton: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
});

export default Home;

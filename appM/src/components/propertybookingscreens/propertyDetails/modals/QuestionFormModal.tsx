import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const QuestionFormModal = ({
  visible,
  onClose,
  styles,
  colors,
  questionText,
  setQuestionText,
  userName,
  setUserName,
  userCountry,
  setUserCountry,
  handleSubmitQuestion,
}: any) => {
  const insets = useSafeAreaInsets();
  const isFormValid =
    questionText.trim() && userName.trim() && userCountry.trim();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View
          style={{ height: insets.top, backgroundColor: colors.background }}
        />
        <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}
            >
              Ask a Question
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.formLabel}>Your Question *</Text>
            <TextInput
              style={[styles.formInput, styles.formInputMultiline]}
              placeholder="What would you like to know about this property?"
              placeholderTextColor={colors.textSecondary}
              value={questionText}
              onChangeText={setQuestionText}
              multiline={true}
              numberOfLines={4}
            />
            <Text style={styles.formLabel}>Your Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              value={userName}
              onChangeText={setUserName}
            />
            <Text style={styles.formLabel}>Your Country *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your country"
              placeholderTextColor={colors.textSecondary}
              value={userCountry}
              onChangeText={setUserCountry}
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitQuestion}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Submit Question</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.replyTimeText}>
                This property usually replies within a few days
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default QuestionFormModal;

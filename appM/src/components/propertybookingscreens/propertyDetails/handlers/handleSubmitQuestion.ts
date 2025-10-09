import { Alert } from "react-native";

export function handleSubmitQuestion({
  questionText,
  userName,
  userCountry,
  questions,
  setQuestions,
  setQuestionText,
  setUserName,
  setUserCountry,
  setShowQuestionFormModal,
}: any) {
  if (!questionText.trim() || !userName.trim() || !userCountry.trim()) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  const newQuestion = {
    id:
      questions.length > 0
        ? Math.max(...questions.map((q: any) => q.id)) + 1
        : 1,
    question: questionText.trim(),
    answer: "", // Will be answered later by property staff
    answerDate: "", // Will be set when answered
  };

  setQuestions([newQuestion, ...questions]);

  // Reset form
  setQuestionText("");
  setUserName("");
  setUserCountry("");
  setShowQuestionFormModal(false);

  Alert.alert(
    "Question Submitted",
    "Your question has been submitted successfully! The property will respond within a few days.",
  );
}

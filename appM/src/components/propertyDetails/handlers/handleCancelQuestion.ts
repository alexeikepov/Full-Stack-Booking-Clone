export function handleCancelQuestion({
  setQuestionText,
  setUserName,
  setUserCountry,
  setShowQuestionFormModal,
}: any) {
  setQuestionText("");
  setUserName("");
  setUserCountry("");
  setShowQuestionFormModal(false);
}

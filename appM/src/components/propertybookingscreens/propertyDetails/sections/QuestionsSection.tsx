import { Animated, Text, TouchableOpacity, View } from "react-native";

const QuestionsSection = ({
  styles,
  questions,
  showAllQuestions,
  animationHeight,
  handleSeeAllQuestions,
  handleAskQuestion,
}: any) => {
  const displayQuestions = showAllQuestions ? questions : questions.slice(0, 1);
  return (
    <View style={styles.questionsSection}>
      <Text style={styles.sectionTitle}>Travelers are asking</Text>
      {displayQuestions.map((q: any) => (
        <View key={q.id} style={styles.questionCard}>
          <Text style={styles.questionText}>💬 {q.question}</Text>
          {q.answer ? (
            <View style={styles.answerCard}>
              <Text style={styles.answerDate}>{q.answerDate}</Text>
              <Text style={styles.answerText}>{q.answer}</Text>
            </View>
          ) : (
            <Text style={styles.answerDate}>
              Pending response from property
            </Text>
          )}
        </View>
      ))}
      {questions.length > 1 && (
        <Animated.View
          style={{
            overflow: "hidden",
            maxHeight: animationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, (questions.length - 1) * 150],
            }),
          }}
        >
          {questions.slice(1).map((q: any) => (
            <View key={q.id} style={styles.questionCard}>
              <Text style={styles.questionText}>💬 {q.question}</Text>
              {q.answer ? (
                <View style={styles.answerCard}>
                  <Text style={styles.answerDate}>{q.answerDate}</Text>
                  <Text style={styles.answerText}>{q.answer}</Text>
                </View>
              ) : (
                <Text style={styles.answerDate}>
                  Pending response from property
                </Text>
              )}
            </View>
          ))}
        </Animated.View>
      )}
      {questions.length > 1 && (
        <TouchableOpacity onPress={handleSeeAllQuestions}>
          <Text style={styles.showMoreText}>
            {showAllQuestions
              ? "Show less"
              : `See all ${questions.length} questions`}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.askQuestionButton}
        onPress={handleAskQuestion}
      >
        <Text style={styles.askQuestionText}>Ask a question</Text>
      </TouchableOpacity>
      <Text style={styles.replyTimeText}>
        This property usually replies within a few days
      </Text>
    </View>
  );
};

export default QuestionsSection;

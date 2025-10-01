import {
  Dimensions,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const ReviewsModal = ({ visible, onClose, styles, colors, property }: any) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalOverlay}>
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: 80,
            marginTop: 24,
            maxHeight: Math.max(300, Dimensions.get("window").height - 220),
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Guest Reviews</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={property.reviews}
          keyExtractor={(item) => item.id.toString()}
          style={styles.modalContent}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.modalItem,
                index === property.reviews.length - 1 && styles.modalItemLast,
              ]}
            >
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInitial}>
                  <Text style={styles.reviewerInitialText}>
                    {item.reviewerInitial}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                  <Text style={styles.reviewerCountry}>
                    {item.country === "Australia" && "🇦🇺"}
                    {item.country === "Italy" && "🇮🇹"}
                    {item.country === "Germany" && "🇩🇪"}
                    {item.country === "United Kingdom" && "🇬🇧"}
                    {item.country === "France" && "🇫🇷"} {item.country}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  </Modal>
);

export default ReviewsModal;

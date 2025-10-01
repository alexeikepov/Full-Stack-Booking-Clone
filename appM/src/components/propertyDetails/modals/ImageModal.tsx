import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const ImageModal = ({
  visible,
  onClose,
  styles,
  colors,
  theme,
  property,
}: any) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View
      style={[
        styles.modalOverlay,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
          backgroundColor: colors.background,
          paddingTop: 32,
        },
      ]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <View style={styles.imageModalHeader}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? colors.text : "white"}
            />
          </TouchableOpacity>
          <Text style={styles.imageModalTitle}>Property Images</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.imageModalScrollView}
          contentContainerStyle={styles.imageModalContent}
        >
          {property.images.map((image: any, index: number) => (
            <View key={"img_" + index} style={styles.fullImageContainer}>
              <Image
                source={image}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  </Modal>
);

export default ImageModal;

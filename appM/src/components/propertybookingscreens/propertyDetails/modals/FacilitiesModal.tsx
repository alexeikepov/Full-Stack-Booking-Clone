import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FacilitiesModal = ({
  visible,
  onClose,
  styles,
  colors,
  property,
}: any) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>All Facilities</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={property.facilities}
          keyExtractor={(item, index) => index.toString()}
          style={styles.modalContent}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.modalItem,
                index === property.facilities.length - 1 &&
                  styles.modalItemLast,
              ]}
            >
              <View style={styles.facilityItem}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.facilityText}>{item.name}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  </Modal>
);

export default FacilitiesModal;

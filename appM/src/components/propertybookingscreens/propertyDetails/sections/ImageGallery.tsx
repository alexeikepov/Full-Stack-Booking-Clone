import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ImageGalleryProps {
  styles: any;
  property: any;
  onPress: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  styles,
  property,
  onPress,
}) => {
  // Safety check for images - ensure we always have something to display
  const images =
    property.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
      ? property.images
      : [require("../../../../assets/images/hotel1.png")]; // Emergency fallback

  return (
    <TouchableOpacity style={styles.imageGallery} onPress={onPress}>
      <Image source={images[0]} style={styles.mainImage} resizeMode="cover" />
      <View style={styles.imageGrid}>
        {images.slice(1, 4).map((image: any, index: number) => (
          <View key={index} style={styles.thumbnailContainer}>
            <Image source={image} style={styles.thumbnail} resizeMode="cover" />
          </View>
        ))}
      </View>
      {/* Image gallery click indicator */}
      <View
        style={[
          styles.imageGalleryOverlay,
          { justifyContent: "flex-end", alignItems: "flex-start", padding: 12 },
        ]}
      >
        <Ionicons name="images-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default ImageGallery;

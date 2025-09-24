import { createContext, ReactNode, useContext, useState } from "react";
import { Property } from "../components/PropertyCard";

interface SavedPropertiesContextType {
  savedProperties: Property[];
  saveProperty: (property: Property) => void;
  unsaveProperty: (propertyId: string) => void;
  isSaved: (propertyId: string) => boolean;
}

const SavedPropertiesContext = createContext<
  SavedPropertiesContextType | undefined
>(undefined);

export const SavedPropertiesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  const saveProperty = (property: Property) => {
    const propertyId = property.id || property.title; // Use id or fallback to title as identifier

    setSavedProperties((prev) => {
      // Check if property is already saved
      const isAlreadySaved = prev.some((p) => (p.id || p.title) === propertyId);

      if (isAlreadySaved) {
        // Remove it (unsave)
        return prev.filter((p) => (p.id || p.title) !== propertyId);
      } else {
        // Add it (save)
        const propertyWithId = { ...property, id: propertyId };
        return [...prev, propertyWithId];
      }
    });
  };

  const unsaveProperty = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.filter((p) => (p.id || p.title) !== propertyId),
    );
  };

  const isSaved = (propertyId: string) => {
    return savedProperties.some((p) => (p.id || p.title) === propertyId);
  };

  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        saveProperty,
        unsaveProperty,
        isSaved,
      }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (!context) {
    throw new Error(
      "useSavedProperties must be used within a SavedPropertiesProvider",
    );
  }
  return context;
};

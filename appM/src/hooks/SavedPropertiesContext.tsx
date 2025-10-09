import { createContext, ReactNode, useContext, useState } from "react";
import { Property } from "../components/shared/modals/PropertyCard";
import { getPropertyId } from "../utils/getPropertyId";

interface SavedPropertiesContextType {
  savedProperties: Property[];
  saveProperty: (property: Property) => void;
  unsaveProperty: (propertyId: string) => void;
  removeProperty: (propertyId: string) => void;
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
    const propertyId = getPropertyId(property);

    setSavedProperties((prev) => {
      // Check if property is already saved (compare normalized ids)
      const isAlreadySaved = prev.some((p) => getPropertyId(p) === propertyId);

      if (isAlreadySaved) {
        // Remove it (unsave)
        const next = prev.filter((p) => getPropertyId(p) !== propertyId);
        return next;
      } else {
        // Add it (save)
        const propertyWithId = { ...property, id: propertyId };
        const next = [...prev, propertyWithId];
        return next;
      }
    });
  };
  const unsaveProperty = (propertyId: string) => {
    const idStr = String(propertyId);

    setSavedProperties((prev) =>
      prev.filter((p) => getPropertyId(p) !== idStr),
    );
  };

  const isSaved = (propertyId: string) => {
    const idStr = String(propertyId);
    return savedProperties.some((p) => getPropertyId(p) === idStr);
  };
  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        saveProperty,
        unsaveProperty,
        removeProperty: unsaveProperty,
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

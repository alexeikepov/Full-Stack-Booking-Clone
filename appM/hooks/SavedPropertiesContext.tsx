import { createContext, ReactNode, useContext, useState } from "react";
import { Property } from "../components/PropertyCard";

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
    // Normalize id to string for robust comparisons
    const propertyId = String(property.id ?? property.title);
    console.log("SavedPropertiesContext: saveProperty called ->", {
      propertyId,
    });

    setSavedProperties((prev) => {
      // Check if property is already saved (compare normalized ids)
      const isAlreadySaved = prev.some(
        (p) => String(p.id ?? p.title) === propertyId,
      );

      if (isAlreadySaved) {
        // Remove it (unsave)
        const next = prev.filter((p) => String(p.id ?? p.title) !== propertyId);
        console.log("SavedPropertiesContext: unsaved ->", {
          propertyId,
          before: prev.length,
          after: next.length,
        });
        return next;
      } else {
        // Add it (save)
        const propertyWithId = { ...property, id: propertyId };
        const next = [...prev, propertyWithId];
        console.log("SavedPropertiesContext: saved ->", {
          propertyId,
          before: prev.length,
          after: next.length,
        });
        return next;
      }
    });
  };

  const unsaveProperty = (propertyId: string) => {
    const idStr = String(propertyId);
    console.log("SavedPropertiesContext: unsaveProperty ->", {
      propertyId: idStr,
    });
    setSavedProperties((prev) =>
      prev.filter((p) => String(p.id ?? p.title) !== idStr),
    );
  };

  const isSaved = (propertyId: string) => {
    const idStr = String(propertyId);
    return savedProperties.some((p) => String(p.id ?? p.title) === idStr);
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

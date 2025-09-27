import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

import { type AddHotelDialogProps, type Hotel } from "./types";
import { initialFormData } from "./constants";
import ProgressIndicator from "./ProgressIndicator";
import BasicInfoStep from "./BasicInfoStep";
import HotelDetailsStep from "./HotelDetailsStep";
import DescriptionStep from "./DescriptionStep";
import AmenitiesStep from "./AmenitiesStep";
import SurroundingsStep from "./SurroundingsStep";

export default function AddHotelDialog({
  isOpen,
  onClose,
  onSave,
}: AddHotelDialogProps) {
  const [formData, setFormData] = useState<Hotel>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleSurroundingsChange = (
    field: string,
    items: Array<{
      name: string;
      distance: string;
      type?: string;
    }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      surroundings: {
        ...prev.surroundings,
        [field]: items,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.location && formData.address;
      case 2:
        return formData.rooms > 0 && formData.stars > 0;
      case 3:
        return formData.description;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      formData,
      onUpdate: handleChange,
      onContactUpdate: handleContactChange,
      onSurroundingsUpdate: handleSurroundingsChange,
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <HotelDetailsStep {...stepProps} />;
      case 3:
        return <DescriptionStep {...stepProps} />;
      case 4:
        return <AmenitiesStep {...stepProps} />;
      case 5:
        return <SurroundingsStep {...stepProps} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Hotel Details";
      case 3:
        return "Description";
      case 4:
        return "Amenities and Services";
      case 5:
        return "Hotel Surroundings";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {formData.id ? "Edit Hotel" : "Add New Hotel"}
          </DialogTitle>
          <DialogDescription>
            {getStepTitle()} ({currentStep} of {totalSteps})
          </DialogDescription>
        </DialogHeader>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={!isStepValid()}>
                  Save Hotel
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

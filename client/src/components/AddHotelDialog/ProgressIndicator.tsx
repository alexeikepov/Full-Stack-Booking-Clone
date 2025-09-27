import React from "react";
import { type ProgressIndicatorProps } from "./types";

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`flex items-center ${
            i < currentStep
              ? "text-blue-600"
              : i === currentStep
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i < currentStep
                ? "bg-blue-600 text-white"
                : i === currentStep
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                i < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Test utility to manually trigger notifications and messages for testing
// This can be removed in production

export const createTestNotificationAndMessage = (
  addNotification: (notification: any) => void,
  addMessage: (message: any) => void,
) => {
  // Create a test notification
  addNotification({
    type: "booking_success",
    title: "Test Booking Confirmed! 🎉",
    message:
      "This is a test notification to verify the notification system is working correctly.",
    iconName: "checkmark-circle",
  });

  // Create a test message
  addMessage({
    type: "property_owner",
    senderName: "Test Property Owner",
    senderRole: "Property Owner",
    propertyName: "Test Hotel & Spa",
    subject: "Welcome to Test Hotel!",
    message:
      "Hi! This is a test message from the property owner. Thank you for choosing our hotel. We're excited to host you and everything is confirmed. This message verifies that the messaging system is working correctly.",
    avatar: "🏨",
  });
};

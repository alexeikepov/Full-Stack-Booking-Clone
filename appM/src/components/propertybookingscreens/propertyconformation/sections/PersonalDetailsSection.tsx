import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface PersonalDetailsSectionProps {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  country: string;
  personalDetailsSubmitting: boolean;
  personalDetailsSubmittedSuccess: boolean;
  personalDetailsErrors: string[];
  keyboardOpen: boolean;
  keyboardHeight: number;
  showPersonalDetails: boolean;
  onFirstNameChange: (text: string) => void;
  onSurnameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPhoneChange: (text: string) => void;
  onCountryChange: (text: string) => void;
  onSubmitPersonalDetails: () => void;
  onTogglePersonalDetails: () => void;
}

const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  firstName,
  surname,
  email,
  phone,
  country,
  personalDetailsSubmitting,
  personalDetailsSubmittedSuccess,
  personalDetailsErrors,
  keyboardOpen,
  keyboardHeight,
  showPersonalDetails,
  onFirstNameChange,
  onSurnameChange,
  onEmailChange,
  onPhoneChange,
  onCountryChange,
  onSubmitPersonalDetails,
  onTogglePersonalDetails,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  const surnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);

  const handleFirstNameChange = (text: string) => {
    onFirstNameChange(text);
    if (text.trim().length >= 20) surnameRef.current?.focus();
  };

  const handleSurnameChange = (text: string) => {
    onSurnameChange(text);
    if (text.trim().length >= 20) emailRef.current?.focus();
  };

  const handleEmailChange = (text: string) => {
    onEmailChange(text);
    // Removed auto-focus to prevent jumping to next field while typing
  };

  const handlePhoneChange = (text: string) => {
    // Allow only numbers, spaces, +, -, (, )
    const cleaned = text.replace(/[^\d\s\+\-\(\)]/g, "");
    onPhoneChange(cleaned);
    if (cleaned.length >= 10) countryRef.current?.focus();
  };

  return (
    <View style={styles.bookingDetailsSection}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: showPersonalDetails ? 16 : 0,
        }}
        onPress={onTogglePersonalDetails}
      >
        <Text style={styles.sectionTitleBooking}>Personal Details</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {personalDetailsSubmittedSuccess && (
            <View
              style={{
                backgroundColor: colors.green,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                ✓ Saved
              </Text>
            </View>
          )}
          <Text
            style={{
              color: colors.button,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {showPersonalDetails ? "Hide" : "Show"}
          </Text>
        </View>
      </TouchableOpacity>

      {showPersonalDetails && (
        <View
          style={{
            marginBottom: keyboardOpen ? 50 : 0,
          }}
        >
          {!personalDetailsSubmittedSuccess && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.formLabel}>First name</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="enter name"
                    placeholderTextColor={colors.textSecondary + "99"}
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                    maxLength={30}
                    returnKeyType="next"
                    onSubmitEditing={() => surnameRef.current?.focus()}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.formLabel}>Surname</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="enter surname"
                    placeholderTextColor={colors.textSecondary + "99"}
                    value={surname}
                    onChangeText={handleSurnameChange}
                    ref={surnameRef}
                    maxLength={30}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                </View>
              </View>

              <Text style={styles.formLabel}>Email address</Text>
              <TextInput
                style={styles.formInput}
                placeholder="mail@example.com"
                placeholderTextColor={colors.textSecondary + "99"}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                ref={emailRef}
                maxLength={60}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              <Text style={styles.formLabel}>Phone number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={colors.textSecondary + "99"}
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                ref={phoneRef}
                maxLength={20}
                returnKeyType="next"
                onSubmitEditing={() => countryRef.current?.focus()}
              />

              <Text style={styles.formLabel}>Country of residence</Text>
              <TextInput
                style={styles.formInput}
                placeholder="United States"
                placeholderTextColor={colors.textSecondary + "99"}
                value={country}
                onChangeText={onCountryChange}
                ref={countryRef}
                maxLength={50}
                returnKeyType="done"
              />

              {personalDetailsErrors.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  {personalDetailsErrors.map((err, idx) => (
                    <Text
                      key={idx}
                      style={{ color: "red", fontSize: 13, marginBottom: 2 }}
                    >
                      {err}
                    </Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.confirmBookingButton,
                  {
                    marginTop: 16,
                    marginHorizontal: 0,
                    backgroundColor: colors.button,
                    borderRadius: 8,
                  },
                ]}
                onPress={onSubmitPersonalDetails}
                disabled={personalDetailsSubmitting}
              >
                {personalDetailsSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmBookingButtonText}>
                    Save Personal Details
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {personalDetailsSubmittedSuccess && (
            <View
              style={{
                padding: 16,
                backgroundColor: colors.green + "20",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.green + "40",
              }}
            >
              <Text
                style={{
                  color: colors.green,
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                ✓ Personal details saved successfully
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {firstName} {surname} • {email}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default PersonalDetailsSection;

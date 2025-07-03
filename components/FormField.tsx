import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  otherStyles?: string;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  otherStyles = "",
  keyboardType,
  secureTextEntry = false,
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {label && (
        <Text className="text-base text-gray-100 font-bold py-2">{label}</Text>
      )}
      <View className="w-full h-16 px-4 bg-gray-900 rounded-2xl border-2 border-accent/70 flex-row items-center">
        <TextInput
          className="flex-1 text-white font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};

export default FormField;

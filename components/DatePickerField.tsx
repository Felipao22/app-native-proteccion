import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatDate, parseDate } from "@/utils/parseDate";

interface DatePickerFieldProps {
  value?: string;
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  allowClear?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  allowClear = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  useEffect(() => {
    if (value) {
      setTempDate(parseDate(value));
    }
  }, [value]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        onChange(formatDate(selectedDate));
      }
      setShowPicker(false);
    } else if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmIOSDate = () => {
    onChange(formatDate(tempDate));
    setShowPicker(false);
  };

  const clearDate = () => {
    onChange("");
    setTempDate(new Date());
  };

  return (
    <View style={{ paddingHorizontal: 3 }}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[!value && styles.placeholder]}>
          {value || "DD/MM/YYYY"}
        </Text>
      </TouchableOpacity>

      {allowClear && value ? (
        <TouchableOpacity style={styles.clearButton} onPress={clearDate}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      ) : null}

      {showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {Platform.OS === "ios" && showPicker && (
        <TouchableOpacity style={styles.confirmButton} onPress={confirmIOSDate}>
          <Text style={styles.confirmText}>Aceptar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 6,
  },
  placeholder: {
    color: "#cbd5e1",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  clearButton: {
    marginTop: 5,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#e53935",
    alignItems: "center",
  },
  clearText: {
    color: "#fff",
    fontWeight: "600",
  },
});

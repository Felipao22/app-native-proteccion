import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePostConstanciaVisitaMutation } from "../../services/constanciaVisitaApi";

export default function ConstanciaVisitaScreen() {
  const initialValues = {
    empresa: "",
    direccion: "",
    localidad: "",
    cuit: "",
    fechaVisita: "",
    provincia: "",
  };

  const [inputs, setInputs] = useState(initialValues);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Mutation Redux
  const [postConstancia, { isLoading }] = usePostConstanciaVisitaMutation();

  // Formatea objeto Date a string dd/MM/yyyy
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  };

  // Parsea string dd/MM/yyyy a objeto Date
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length !== 3) return new Date();
    const [dd, mm, yyyy] = parts;
    const parsed = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    return parsed instanceof Date && !isNaN(parsed) ? parsed : new Date();
  };

  const handleChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!inputs.empresa) newErrors.empresa = "Campo requerido";
    if (!inputs.direccion) newErrors.direccion = "Campo requerido";
    if (!inputs.localidad) newErrors.localidad = "Campo requerido";
    if (!inputs.cuit) newErrors.cuit = "Campo requerido";
    if (!inputs.fechaVisita) newErrors.fechaVisita = "Campo requerido";
    if (!inputs.provincia) newErrors.provincia = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await postConstancia(inputs).unwrap();
        if (response) {
          Alert.alert(response.message);
          handleClear();
        }
      } catch (error) {
        Alert.alert(error.data?.message || "Error al enviar formulario");
      }
    }
  };

  const handleClear = () => {
    setInputs(initialValues);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate)) {
      const formattedDate = formatDate(selectedDate);
      handleChange("fechaVisita", formattedDate);
    }
  };

  const inputsData = [
    { label: "Empresa", name: "empresa", placeholder: "Nombre de la empresa" },
    { label: "Dirección", name: "direccion", placeholder: "Dirección" },
    { label: "Provincia", name: "provincia", placeholder: "Provincia" },
    { label: "Localidad", name: "localidad", placeholder: "Localidad" },
    {
      label: "CUIT",
      name: "cuit",
      placeholder: "CUIT",
      keyboardType: "numeric",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Constancia de visita</Text>
        </View>

        <View style={styles.form}>
          {inputsData.map(({ label, name, placeholder, keyboardType }) => (
            <View key={name}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, errors[name] && styles.inputError]}
                value={inputs[name]}
                onChangeText={(text) => handleChange(name, text)}
                placeholder={placeholder}
                keyboardType={keyboardType || "default"}
              />
              {errors[name] && (
                <Text style={styles.errorText}>{errors[name]}</Text>
              )}
            </View>
          ))}

          {/* Selector de fecha */}
          <Text style={styles.label}>Fecha de visita</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: inputs.fechaVisita ? "#000" : "#94a3b8" }}>
              {inputs.fechaVisita || "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {errors.fechaVisita && (
            <Text style={styles.errorText}>{errors.fechaVisita}</Text>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={parseDate(inputs.fechaVisita)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Enviando..." : "Enviar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 6,
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

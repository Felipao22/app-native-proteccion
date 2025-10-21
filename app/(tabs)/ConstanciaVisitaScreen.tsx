import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePostConstanciaVisitaMutation } from "../../services/constanciaVisitaApi";
import { useGetUsersQuery } from "../../services/usuariosApi";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import type { Users } from "../../services/usuariosApi";
import type { constanciaVisita } from "../../services/constanciaVisitaApi";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ConstanciaVisitaScreen() {
  const initialValues = {
    empresa: "",
    direccion: "",
    localidad: "",
    cuit: "",
    fechaVisita: "",
    provincia: "",
    botiquines: false,
    extintores: false,
    luces: false,
    maquinas: false,
    tableros: false,
    epp: false,
    vehiculos: false,
    arneses: false,
    escaleras: false,
    inspeccion: false,
    relevamiento: false,
    capacitacion: false,
    otros: false,
    inputOtros: "",
    areas: "",
    notas: "",
    documentacion: "",
  };

  const initialErrors = {
    empresa: "",
    direccion: "",
    localidad: "",
    cuit: "",
    fechaVisita: "",
    provincia: "",
  };

  const [inputs, setInputs] = useState<constanciaVisita>(initialValues);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [branches, setBranches] = useState<Users[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  // Mutation Redux
  const [postConstancia, { isLoading }] = usePostConstanciaVisitaMutation();

  //Querys Redux
  const { data, isFetching } = useGetUsersQuery();

  useEffect(() => {
    if (data && data?.length > 0) {
      //Filtrar usuarios que no sean empresas
      const filterData = data.filter((e) => !e.isAdmin && !e.isSuperAdmin);
      //Obtener nombres de las empresas
      const establecimientos = filterData.map((est) => est);
      setBranches(establecimientos);
    }
  }, [data]);

  // Formatea objeto Date a string dd/MM/yyyy
  const formatDate = (date: Date | string) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  };

  // Parsea string dd/MM/yyyy a objeto Date
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length !== 3) return new Date();
    const [dd, mm, yyyy] = parts;
    const parsed = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    return parsed instanceof Date && !isNaN(parsed.getTime())
      ? parsed
      : new Date();
  };

  const handleChange = (name: keyof typeof initialValues, value: string) => {
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangeEmpresa = (empresaNombre: string) => {
    const empresaSeleccionada = branches.find(
      (e) => e.nombreEmpresa === empresaNombre
    );

    if (empresaSeleccionada) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        empresa: empresaNombre,
        direccion: empresaSeleccionada.direccion || "",
        localidad: empresaSeleccionada.ciudad || "",
        provincia: "San Luis",
        cuit: empresaSeleccionada.cuit || "",
      }));
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        empresa: empresaNombre,
      }));
    }
  };

  const handleCheckbox = (name: keyof typeof initialValues, value: boolean) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: typeof initialErrors = {
      empresa: "",
      direccion: "",
      localidad: "",
      cuit: "",
      fechaVisita: "",
      provincia: "",
    };
    if (!inputs.empresa) newErrors.empresa = "Campo requerido";
    if (!inputs.direccion) newErrors.direccion = "Campo requerido";
    if (!inputs.localidad) newErrors.localidad = "Campo requerido";
    if (!inputs.cuit) newErrors.cuit = "Campo requerido";
    if (!inputs.fechaVisita) newErrors.fechaVisita = "Campo requerido";
    if (!inputs.provincia) newErrors.provincia = "Campo requerido";
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await postConstancia(inputs).unwrap();
        if (response) {
          Alert.alert(response.message);
          handleClear();
        }
      } catch (error: any) {
        Alert.alert(error.data?.message || "Error al enviar formulario");
      }
    }
  };

  const handleClear = () => {
    setInputs(initialValues);
  };

  const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      const formattedDate = formatDate(selectedDate);
      handleChange("fechaVisita", formattedDate);
    }
  };
  const inputsData: {
    label: string;
    name: keyof typeof initialValues;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
  }[] = [
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

  const checkboxes = [
    { label: "Control de Botiquines", name: "botiquines", checked: false },
    { label: "Control de Extintores", name: "extintores", checked: false },
    { label: "Control de Luces de Emergerncia", name: "luces", checked: false },
    {
      label: "Control de Máquinas y/o Herramientas",
      name: "maquinas",
      checked: false,
    },
    {
      label: "Control de Tableros Eléctricos",
      name: "tableros",
      checked: false,
    },
    { label: "Control de use de E.P.P.", name: "epp", checked: false },
    { label: "Control de Vehículos", name: "vehiculos", checked: false },
    { label: "Control de Arneses", name: "arneses", checked: false },
    { label: "Control de Escaleras", name: "escaleras", checked: false },
    {
      label: "Inspección de Infraestructura",
      name: "inspeccion",
      checked: false,
    },
    {
      label: "Relevamiento de Documentación Técnico Legal",
      name: "relevamiento",
      checked: false,
    },
    { label: "Registro de Capacitación", name: "capacitacion", checked: false },
    { label: "Otros", name: "otros", checked: false },
  ];

  const checkboxesVisibles = showCheckboxes ? checkboxes : null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 24 }}
        enableOnAndroid={true}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Constancia de visita</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Empresa</Text>
          <View
            style={[
              styles.input,
              errors.empresa && styles.inputError,
              {
                height: 60,
                paddingHorizontal: 0,
                justifyContent: "center",
              },
            ]}
          >
            <Picker
              selectedValue={inputs.empresa}
              onValueChange={handleChangeEmpresa}
              style={{
                height: 80,
                color: inputs.empresa ? "#0f172a" : "#94a3b8",
              }}
              dropdownIconColor="#475569"
            >
              {isFetching && <Text>Cargando...</Text>}
              <Picker.Item label="Seleccionar empresa" value="" />
              {branches?.map((empresa, index) => (
                <Picker.Item
                  label={empresa.nombreEmpresa}
                  value={empresa.nombreEmpresa}
                  key={index}
                />
              ))}
            </Picker>
          </View>

          {errors.empresa && (
            <Text style={styles.errorText}>{errors.empresa}</Text>
          )}
          {inputsData.map(({ label, name, placeholder, keyboardType }) => (
            <View key={name}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[
                  styles.input,
                  errors[name as keyof typeof initialErrors] &&
                    styles.inputError,
                ]}
                value={
                  typeof inputs[name as keyof typeof initialValues] === "string"
                    ? (inputs[name as keyof typeof initialValues] as string)
                    : ""
                }
                onChangeText={(text) =>
                  handleChange(name as keyof typeof initialValues, text)
                }
                placeholder={placeholder}
                keyboardType={keyboardType || "default"}
              />
              {errors[name as keyof typeof initialErrors] && (
                <Text style={styles.errorText}>
                  {errors[name as keyof typeof initialErrors]}
                </Text>
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
          <Text style={styles.label}>Documentación entregada</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.textArea}
            placeholder="Escriba las documentación entregada aquí..."
            value={inputs.documentacion}
            onChangeText={(text) => handleChange("documentacion", text)}
          />
          <TouchableOpacity
            onPress={() => setShowCheckboxes(!showCheckboxes)}
            style={styles.toggleButton}
          >
            <View style={styles.toggleContent}>
              <Text style={styles.labelDocumentacion}>
                Documentación que se adjunta
              </Text>
              {showCheckboxes ? (
                <ChevronUp size={18} color="#1e40af" />
              ) : (
                <ChevronDown size={18} color="#1e40af" />
              )}
            </View>
          </TouchableOpacity>

          {checkboxesVisibles?.map(({ label, name }) => (
            <View
              key={name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 4,
              }}
            >
              <Checkbox
                value={!!inputs[name as keyof typeof inputs]}
                onValueChange={(newValue) =>
                  handleCheckbox(name as keyof typeof initialValues, newValue)
                }
              />
              <Text style={styles.labelCheckbox}>{label}</Text>
            </View>
          ))}
          {inputs?.otros && (
            <TextInput
              style={styles.input}
              placeholder="Especifique otros..."
              value={inputs.inputOtros}
              onChangeText={(text) => handleChange("inputOtros", text)}
            />
          )}
          <Text style={styles.label}>Áreas auditadas</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.textArea}
            placeholder="Escriba las áreas auditadas aquí..."
            value={inputs.areas}
            onChangeText={(text) => handleChange("areas", text)}
          />
          <Text style={styles.label}>Notas</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.textArea}
            placeholder="Escriba las notas aqui..."
            value={inputs.notas}
            onChangeText={(text) => handleChange("notas", text)}
          />

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
      </KeyboardAwareScrollView>
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
  pickerSelection: {
    padding: 0,
  },
  labelCheckbox: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    margin: 8,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
    marginLeft: 6,
  },
  icon: {
    marginLeft: 8,
    paddingBottom: 10,
  },
  toggleButton: {
    marginTop: 16,
  },
  labelDocumentacion: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 6,
    minHeight: 120,
    textAlignVertical: "top",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
});

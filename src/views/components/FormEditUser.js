import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { format } from "date-fns";
import COLORS from "../../conts/colors";
import { COLORS2 } from "../../conts/colors";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { PrimaryButton } from "./Button2";

const EditUser = ({ navigation, toggleModal, setName }) => {
  const [inputs, setInputs] = React.useState({
    userId: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [auth, setAuth] = React.useState();

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  useEffect(() => {
    auth &&
      setInputs({
        userId: auth?.Id,
        fullName: auth?.FullName,
        dateOfBirth: auth?.DateOfBirth,
        phoneNumber: auth?.PhoneNumber,
      });
  }, [auth]);

  const authUser = async () => {
    let userData = await AsyncStorage.getItem("userData");
    userData && setAuth(JSON.parse(userData));
  };

  const toggleDatepicker = () => {
    setShow(!show);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      handleError(null, "dateOfBirth");

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(format(currentDate, "yyyy-MM-dd"));
        handleOnchange(format(currentDate, "yyyy-MM-dd"), "dateOfBirth");
      }
    } else {
      toggleDatepicker();
    }
  };

  const handleEdit = () => {
    setLoading(true);
    axios
      .post("http://10.0.2.2:8000/api/user/editUser", inputs)
      .then((response) => {
        let registerResponse = response.data;
        let titleToast = registerResponse.IsSuccess
          ? "Chỉnh sửa thông tin thành công!"
          : `Lỗi: ${registerResponse.ErrorMessage}`;
        let statusToast = registerResponse.IsSuccess ? "Thành công" : "Lỗi";
        Alert.alert(statusToast, titleToast);
        setLoading(false);
        setName(inputs.fullName)
        registerResponse.IsSuccess && toggleModal();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}
      >
        <Text
          style={{ color: COLORS2.primary, fontSize: 35, fontWeight: "bold" }}
        >
          Chỉnh sửa thông tin
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            value={inputs?.fullName}
            onChangeText={(text) => handleOnchange(text, "fullName")}
            onFocus={() => handleError(null, "fullName")}
            iconName="account-outline"
            label="Tên tài khoản"
            placeholder={"Nhập họ tên"}
            error={errors.fullName}
          />

          {show && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
            />
          )}
          <Pressable onPress={toggleDatepicker}>
            <Input
              value={dateOfBirth}
              iconName="account-outline"
              label="Ngày tháng sinh"
              placeholder={"Nhập ngày sinh"}
              editable={false}
              error={errors.dateOfBirth}
            />
          </Pressable>
          <Input
            value={inputs?.phoneNumber}
            keyboardType="numeric"
            onChangeText={(text) => handleOnchange(text, "phoneNumber")}
            onFocus={() => handleError(null, "phoneNumber")}
            iconName="phone-outline"
            label="Số điện thoại"
            placeholder={"Nhập số điện thoại"}
            error={errors.phoneNumber}
          />
          <PrimaryButton onPress={() => handleEdit()} title="Xác nhận" />
          <Text
            onPress={() => toggleModal()}
            style={{
              color: COLORS.black,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Thoát
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditUser;

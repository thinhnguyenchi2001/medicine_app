import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  Image
} from "react-native";
import { format } from "date-fns";
import COLORS from "../../conts/colors";
import {COLORS2} from"../../conts/colors"
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { PrimaryButton } from "../components/Button2";

const RegistrationScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    userName: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [show, setShow] = React.useState(false);

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

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.userName) {
      handleError("Please input username", "userName");
      isValid = false;
    }

    if (!inputs.fullName) {
      handleError("Please input fullname", "fullName");
      isValid = false;
    }

    if (!inputs.dateOfBirth) {
      handleError("Please input birth", "dateOfBirth");
      isValid = false;
    }

    if (!inputs.phoneNumber) {
      handleError("Please input phone number", "phoneNumber");
      isValid = false;
    }

    if (!inputs.password) {
      handleError("Please input password", "password");
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError("Min password length of 5", "password");
      isValid = false;
    }

    if (!inputs.rePassword) {
      handleError("Please input password", "rePassword");
      isValid = false;
    } else if (inputs.rePassword !== inputs.password) {
      handleError("Not match password", "rePassword");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };

  const register = () => {
    setLoading(true);
    axios
      .post("http://10.0.2.2:8000/api/user/register", inputs)
      .then((response) => {
        let registerResponse = response.data;
        let titleToast = registerResponse.IsSuccess
          ? "Thông báo: Đăng ký tài khoản thành công!"
          : `Lỗi: ${registerResponse.ErrorMessage}`;
        let statusToast = registerResponse.IsSuccess ? "Thành công" : "Lỗi";
        Alert.alert(statusToast, titleToast);
        setLoading(false);
        registerResponse.IsSuccess && navigation.navigate("LoginScreen");
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
        <View   onStartShouldSetResponder={() => true}
          onResponderGrant={() => navigation.navigate("BoardScreen")} style={{ flexDirection: "row",marginBottom: 30 }}>
          <Image
            source={require("../../assets/logo.png")}
            style={{
              resizeMode: "contain",
              height: 100,
              width: 100,
              borderRadius: 25,
          
            }}
          />
          <Text
            style={{
              color: COLORS2.primary,
              alignSelf: "flex-end",
              fontSize: 30,
              fontWeight: "bold"
            }}
          >
            HealPlus
          </Text>
        </View>
        <Text style={{ color: COLORS2.primary, fontSize: 40, fontWeight: "bold" }}>
          Đăng ký tài khoản
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Điền thông tin đăng ký
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "userName")}
            onFocus={() => handleError(null, "userName")}
            iconName="account-outline"
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            error={errors.userName}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "fullName")}
            onFocus={() => handleError(null, "fullName")}
            iconName="account-outline"
            label="Tên tài khoản"
            placeholder="Nhập tên tài khoản"
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
              placeholder="Nhập ngày sinh"
              editable={false}
              error={errors.dateOfBirth}
            />
          </Pressable>
          <Input
            keyboardType="numeric"
            onChangeText={(text) => handleOnchange(text, "phoneNumber")}
            onFocus={() => handleError(null, "phoneNumber")}
            iconName="phone-outline"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            error={errors.phoneNumber}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "password")}
            onFocus={() => handleError(null, "password")}
            iconName="lock-outline"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            error={errors.password}
            password
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "rePassword")}
            onFocus={() => handleError(null, "rePassword")}
            iconName="lock-outline"
            label="Mật khẩu xác nhận"
            placeholder="Nhập mật khẩu xác nhận"
            error={errors.rePassword}
            password
          />
          <PrimaryButton onPress={validate} title="Đăng ký" />
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={{
              color: COLORS.black,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Bạn đã có tài khoản? Đăng nhập{" "}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

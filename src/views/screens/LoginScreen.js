import React from "react";
import { View, Text, SafeAreaView, Keyboard, Alert, Image } from "react-native";
import COLORS, { COLORS2 } from "../../conts/colors";
import Button from "../components/Button";
import Input from "../components/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError("Please input email", "email");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Please input password", "password");
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = () => {
    setLoading(true);
    axios
      .post("http://10.0.2.2:8000/api/user/login", {
        userName: inputs.email,
        password: inputs.password,
      })
      .then((response) => {
        let loginResponse = response.data;
        if (loginResponse.IsSuccess) {
          navigation.navigate("BoardScreen");
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({ ...loginResponse.Item })
          );
        } else {
          Alert.alert("Error", "User does not exist");
        }
        setLoading(false);
      })
      .catch((error) => alert(error));
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
      
      <View style={{ paddingTop: 40, paddingHorizontal: 20 }}>
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
          Đăng nhập tài khoản
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Điền thông tin đăng nhập
        </Text>
        <View style={{ marginVertical: 10 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "email")}
            onFocus={() => handleError(null, "email")}
            iconName="email-outline"
            label="Địa chỉ Email"
            placeholder="Nhập địa chỉ Email"
            error={errors.email}
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
          <Button title="Đăng nhập" onPress={validate} />
          <Text
            onPress={() => navigation.navigate("RegistrationScreen")}
            style={{
              color: COLORS.black,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Bạn đã có tài khoản? Đăng ký
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

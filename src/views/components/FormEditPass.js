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

const EditPass = ({ navigation, toggleModal, setName }) => {
  const [inputs, setInputs] = React.useState({
    password: "",
    newPassword: "",
    cfPassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [auth, setAuth] = React.useState();

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  const authUser = async () => {
    let userData = await AsyncStorage.getItem("userData");
    userData && setAuth(JSON.parse(userData));
  };

  const handleEdit = () => {
    setLoading(true);
    axios
      .post("http://10.0.2.2:8000/api/user/editPassword", {
        userId: auth?.Id,
        ...inputs,
      })
      .then((response) => {
        let registerResponse = response.data;
        let titleToast = registerResponse.IsSuccess
          ? "Đổi mật khẩu thành công!"
          : `Lỗi: ${registerResponse.ErrorMessage}`;
        let statusToast = registerResponse.IsSuccess ? "Thành công" : "Lỗi";
        Alert.alert(statusToast, titleToast);
        setLoading(false);
        setName(inputs.fullName);
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


  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}
      >
        <Text
          style={{ color: COLORS2.primary, fontSize: 35, fontWeight: "bold" }}
        >
          Đổi mật khẩu
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "password")}
            iconName="lock-outline"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu hiện tại"
            error={errors.password}
            password
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "newPassword")}
            iconName="lock-outline"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu mới"
            error={errors.password}
            password
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "cfPassword")}
            iconName="lock-outline"
            label="Mật khẩu"
            placeholder="Xác nhận mật khẩu mới"
            error={errors.password}
            password
          />
          <Button onPress={() => handleEdit()} title="Xác nhận" />
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

export default EditPass;

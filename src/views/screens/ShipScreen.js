import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import COLORS, { COLORS2 } from "../../conts/colors";
import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { PrimaryButton } from "../components/Button2";

const ShipScreen = ({ navigation, route }) => {
    const item = route.params;
  const [value1, setValue1] = React.useState("Chọn tỉnh/thành");
  const [value2, setValue2] = React.useState("Chọn quận/huyện");
  const [value3, setValue3] = React.useState("Chọn phường/xã");
  const [listProvinces, setListProvinces] = React.useState([]);
  const [listDistricts, setListDistricts] = React.useState([]);
  const [listCommune, setListCommune] = React.useState([]);
  const [inputs, setInputs] = React.useState({
    userName: "",
    phoneNumber: "",
    province: "",
    district: "",
    commune: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = React.useState({});
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


  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((response) => response.json())
      .then((data) =>
        setListProvinces(
          data.map((e) => ({ label: e.name, value: e.name, code: e.code }))
        )
      )
      .catch((error) => console.log(error));
  }, [item]);

  const getListDistricts = (provinceCode) => {
    setListDistricts([]);
    setListCommune([]);
    fetch("https://provinces.open-api.vn/api/d/")
      .then((response) => response.json())
      .then((data) =>
        setListDistricts(
          data
            .filter((item) => item.province_code == provinceCode)
            .map((e) => ({ label: e.name, value: e.name, code: e.code }))
        )
      )
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    listProvinces && listProvinces.find((e) => e.value === value1) &&
      getListDistricts(listProvinces.find((e) => e.value === value1).code);
  }, [value1]);

  const getListWards = (districtCode) => {
    setListCommune([]);
    fetch("https://provinces.open-api.vn/api/w/")
      .then((response) => response.json())
      .then((data) =>
        setListCommune(
          data.filter((item) => item.district_code == districtCode)
          .map((e) => ({ label: e.name, value: e.name, code: e.code }))
        )
      )
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    listDistricts && listDistricts.find((e) => e.value === value2) &&
    getListWards(listDistricts.find((e) => e.value === value2).code);
  }, [value2]);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.userName) {
      handleError("Vui lòng nhập họ và tên", "userName");
      isValid = false;
    }

    if (!inputs.phoneNumber) {
      handleError("Vui lòng nhập số điện thoại", "phoneNumber");
      isValid = false;
    }

    if (!inputs.province) {
      handleError("Please input province", "province");
      isValid = false;
    }
    if (!inputs.district) {
      handleError("Please input districtr", "district");
      isValid = false;
    }
    if (!inputs.commune) {
      handleError("Please input commune", "commune");
      isValid = false;
    }
    if (!inputs.address) {
      handleError("Vui lòng nhập số số nhà/địa chỉ", "address");
      isValid = false;
    }
    if (isValid) {
        submitOrder();
    }
  };

  const submitOrder = () => {
    const provinceName = inputs.province
    const districtName = inputs.district
    const wardName = inputs.commune
    const fullAddress = `${inputs.address} ${wardName} ${districtName} ${provinceName}`;
    const formData = {
        userId: `${auth.Id}`,
        customerName:`${inputs.userName}`,
        phoneNumber:`${inputs.phoneNumber}`,
        address:`${fullAddress}`,
        note:`${inputs.note}`,
        totalMoney:`${item[1] + 30000}`,
        productListOrder:`${JSON.stringify(item[0])}`
    };
    axios
        .post("http://10.0.2.2:8000/api/cart/submitOrder", formData)
        .then((response) => {
            if (response.data.IsSuccess) {
                Alert.alert("Thông báo", "Mua hàng thành công!",[
                    {text: 'Ok', onPress: () => navigation.navigate("UserScreen")}
                  ])
            }
        })
        .catch((error) => console.error(error));
};

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={style.header}>
        <MaterialIcons onPress={()=> navigation.goBack(null)} name="arrow-back-ios" size={24} color="black" />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đơn mua hàng</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <Text style={{ color: COLORS2.primary, fontSize: 32, fontWeight: "bold" }}>
          Thông tin đơn mua hàng
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Điền thông tin sau
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => {
              handleOnchange(text, "userName");
            }}
            onFocus={() => handleError(null, "userName")}
            iconName="account-outline"
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            error={errors.userName}
          />
          <Input
            keyboardType="numeric"
            onChangeText={(text) => handleOnchange(text, "phoneNumber")}
            onFocus={() => handleError(null, "phoneNumber")}
            iconName="phone-outline"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            error={errors.phoneNumber}
          />
          <Picker
            style={{
              backgroundColor: COLORS.light,
              color: COLORS.grey,
              marginBottom: 20,
            }}
            selectedValue={value1}
            onValueChange={(text) => {
              handleOnchange(text, "province");
              setValue1(text);
              getListDistricts(text);
            }}
          >
            <Picker.Item label={"Chọn tỉnh/thành"} value={""} />
            {listProvinces.map((e,index) => (
              <Picker.Item key={index} label={e.label} value={e.value} />
            ))}
          </Picker>
          <Picker
            style={{
              backgroundColor: COLORS.light,
              color: COLORS.grey,
              marginBottom: 20,
            }}
            selectedValue={value2}
            onValueChange={(text) => {
              handleOnchange(text, "district");
              setValue2(text);
            }}
          >
            <Picker.Item label={"Chọn quận/huyện"} value={""} />
            {listDistricts.map((e,index) => (
              <Picker.Item key={index} label={e.label} value={e.value} />
            ))}
          </Picker>
          <Picker
            style={{
              backgroundColor: COLORS.light,
              color: COLORS.grey,
              marginBottom: 20,
            }}
            selectedValue={value3}
            onValueChange={(text) => {
              handleOnchange(text, "commune");
              setValue3(text);
            }}
          >
            <Picker.Item label={"Chọn phường/xã"} value={""} />

            {listCommune.map((e,index) => (
              <Picker.Item key={index} label={e.label} value={e.value} />
            ))}
          </Picker>
          <Input
            onChangeText={(text) => handleOnchange(text, "address")}
            onFocus={() => handleError(null, "address")}
            iconName="account-outline"
            label="Số nhà/địa chỉ"
            placeholder="Nhập số nhà/địa chỉ"
            error={errors.address}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "fullName")}
            onFocus={() => handleError(null, "note")}
            iconName="account-outline"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            error={errors.note}
          />
          <PrimaryButton onPress={ validate } title="Hoàn tất đặt hàng" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create ({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
})

export default ShipScreen;

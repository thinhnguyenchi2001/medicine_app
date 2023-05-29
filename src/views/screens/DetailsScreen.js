import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS2 } from "../../conts/colors";
import { SecondaryButton } from "../components/Button2";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

const DetailsScreen = ({ navigation, route }) => {
  const item = route.params;
  const [number, setNumber] = React.useState(1);
  const [auth, setAuth] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  const authUser = async () => {
    let userData = await AsyncStorage.getItem("userData");
    userData ? setAuth(true) : setAuth(false);
  };

  const remove = () => {
    number > 1 && setNumber(number - 1);
  };
  const add = () => {
    number < item.Quantity && setNumber(number + 1);
  };

  const updateCart = async () => {
    let userData = await AsyncStorage.getItem("userData");
    if (true) {
      axios
        .post("http://10.0.2.2:8000/api/cart/updateCart", {
          userId: JSON.parse(userData).Id,
          productId: item.Id,
          buyQuantity: number,
        })
        .then((response) => {
          if (response.data.IsSuccess) {
            Alert.alert("Thông báo", "Thêm giỏ hàng thành công", [
              {
                text: "OK",
                onPress: () => navigation.navigate("CartScreen", new Date()),
              },
            ]);
          } else {
            Alert.alert("error", `Lỗi: ${response.data.ErrorMessage}`);
          }
        })
        .catch((error) => console.error(error));
    } else {
      Alert.alert(
        "warning",
        "Cảnh báo: Vui lòng đăng nhập để chọn mua sản phẩm!"
      );
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS2.white }}>
      <View style={style.header}>
        <MaterialIcons
          name="arrow-back-ios"
          size={28}
          onPress={navigation.goBack}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chi tiết sản phẩm</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 280,
          }}
        >
          <Image
            source={{
              uri: `http://10.0.2.2:8000${item.ImageAvatarUrl}`,
            }}
            style={{ height: 220, width: 220 }}
          />
        </View>

        <View style={style.iconContainer}>
          <MaterialIcons
            name="favorite-border"
            color={COLORS2.primary}
            size={25}
          />
        </View>
        <View style={style.details}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", color: COLORS2.white }}
            >
              {item.Name}
            </Text>
          </View>
          <View>
            <Text style={style.detailsText}>Danh mục: {item.CategoryName}</Text>
            <Text style={style.detailsText}>Quy cách:{item.Specification}</Text>
            <Text style={style.detailsText}>Thương hiệu: {item.Origin}</Text>
           
            {item.ProductAdditional.map((item, index) => (
              <View className="block mb-2" key={index}>
                <Text style={style.detailsText}>
                  {item.TitleInfo}: {item.Content}
                </Text>
              </View>
            ))}
          </View>
          <Text style={style.detailsText}>Giá sản phẩm:  {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.Price)}</Text>
          <Text style={style.detailsText}>Số lượng còn: {item.Quantity}</Text>
          {item.Quantity > 0 && (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <View style={style.actionBtn}>
                <Ionicons
                  onPress={remove}
                  name="remove"
                  size={30}
                  color="white"
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: COLORS2.white,
                  }}
                >
                  {number}
                </Text>
                <Ionicons onPress={add} name="add" size={30} color="white" />
              </View>
            </View>
          )}
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <SecondaryButton
              onPress={() =>
                auth
                  ? updateCart()
                  : Alert.alert("Thông báo", "Cần đăng nhập để mua hàng", [
                      {
                        text: "Đăng nhập",
                        onPress: () => navigation.navigate("LoginScreen"),
                      },
                      { text: "Hủy"
                     },
                    ])
              }
              title="Thêm vào giỏ hàng"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: COLORS2.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  iconContainer: {
    backgroundColor: COLORS2.white,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
    color: COLORS2.white,
  },
  actionBtn: {
    width: 120,
    height: 30,
    backgroundColor: COLORS2.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
  },
});

export default DetailsScreen;

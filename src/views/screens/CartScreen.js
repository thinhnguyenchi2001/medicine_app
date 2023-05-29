import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { COLORS2 } from "../../conts/colors";
import { PrimaryButton } from "../components/Button2";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused } from "@react-navigation/core";

const CartScreen = ({ navigation, route }) => {
  const [listCart, setListCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const item = route?.params;
  const isFocused = useIsFocused()

  useEffect(() => {
    loadCartUser(true)
  }, [item, isFocused]);

  const loadCartUser = async (isSetListCart) => {
    let userData = await AsyncStorage.getItem("userData");
    { userData? axios
      .get(
        `http://10.0.2.2:8000/api/cart/getCartUser?userId=${
          JSON.parse(userData).Id
        }`
      )
      .then(function (response) {
        let getCartUserResponse = response.data;
        if (getCartUserResponse.IsSuccess) {
          setListCart(response.data.DataList);
          if (isSetListCart && getCartUserResponse.DataList.length > 0) {
            const totalCartPrice = getCartUserResponse.DataList.reduce(
              function (totalPrice, currentProduct) {
                return (
                  totalPrice +
                  currentProduct.BuyQuantity * currentProduct.ProductInfo.Price
                );
              },
              0
            );
            setTotalPrice(totalCartPrice);
          }
        } else {
          Alert.alert("error", `Lỗi: ${getCartUserResponse.ErrorMessage}`);
        }
      })
      .catch(function (error) {
        console.error(error);
      }): isFocused && Alert.alert("Thông báo", "Cần đăng nhập để mua hàng",[
        {text: 'Đăng nhập', onPress: () => navigation.navigate("LoginScreen")}, {text: 'Hủy', onPress: () => navigation.goBack(null)}
      ])};
  };

  const CartCard = ({ item }) => {
    const [nowQuantity, setNowQuantity] = useState(item.BuyQuantity);
    const [isUpdate, setIsUpdate] = useState(false)
    const remove = () => {
      if (nowQuantity > 1) {
        setNowQuantity(nowQuantity - 1);
        setIsUpdate(true)
      }
    };
    const add = () => {
      if (nowQuantity < item.ProductInfo.Quantity) {
        setNowQuantity(nowQuantity + 1);  
        setIsUpdate(true)
       
      }
    };

    useEffect(()=>{
      isUpdate && updateProductCart(nowQuantity)
    },[nowQuantity])
  

    const updateProductCart = async (buyQuantity) => {
      let userData = await AsyncStorage.getItem("userData");
      axios
        .post("http://10.0.2.2:8000/api/cart/updateProductCart", {
          userId: JSON.parse(userData).Id,
          productId: item.ProductInfo.Id,
          buyQuantity: buyQuantity,
        })
        .then((response) => {
          if (!response.data.IsSuccess) {
            Alert.alert("error", `Lỗi: ${response.data.ErrorMessage}`);
          } else {
            loadCartUser(true);
          setIsUpdate(false)
          }
        })
        .catch((error) => console.error(error));
    };

    const deleteProductCart = async() => {
      let userData = await AsyncStorage.getItem("userData");
      axios
          .post("http://10.0.2.2:8000/api/cart/removeProductCart", {
              userId: JSON.parse(userData).Id,
              productId: item.ProductInfo.Id,
          })
          .then((response) => {
              if (response.data.IsSuccess) {
                  loadCartUser(true);
              } else {
                Alert.alert("error", `Lỗi: ${response.data.ErrorMessage}`);
              }
          })
          .catch((error) => console.error(error));
  };

    return (
      <View style={style.cartCard}>
        <Image
          source={{
            uri: `http://10.0.2.2:8000${item.ProductInfo.ImageAvatarUrl}`,
          }}
          style={{ height: 80, width: 80 }}
        />
        <View
          style={{
            height: 100,
            marginLeft: 10,
            paddingVertical: 20,
            flex: 1,
          }}
        >
          <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 16 }}>
            {item.ProductInfo.Name}
          </Text>
          <Text style={{ fontSize: 13, color: COLORS2.grey }}>
            Đơn vị: {item.ProductInfo.Unit}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Tổng: 
            {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.ProductInfo.Price * nowQuantity)}
            
          </Text>
        </View>
        <View style={{ marginRight: 10, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {nowQuantity}
          </Text>
          <View style={style.actionBtn}>
            <Ionicons onPress={remove} name="remove" size={24} color="white" />
            <Ionicons onPress={add} name="add" size={24} color="white" />
          </View>
        </View>
        <Text onPress={deleteProductCart} numberOfLines={1} style={{ fontWeight: "bold", fontSize: 16 }}>
          Xóa
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS2.white, flex: 1 }}>
      <View style={style.header}>
        <MaterialIcons onPress={()=> navigation.goBack(null)} name="arrow-back-ios" size={24} color="black" />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Giỏ hàng</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={listCart}
        renderItem={({ item }) => <CartCard item={item} />}
        ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
        ListFooterComponent={() => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                
              }}
            >
              <Text style={{ fontSize: 16,color: COLORS2.grey }}>
                Tổng tiền
              </Text>
              <Text style={{ fontSize: 16,color: COLORS2.grey }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
             
              }}
            >
              <Text style={{ fontSize: 16, color: COLORS2.grey }}>
                Phí giao hàng
              </Text>
              <Text style={{ fontSize: 16, color: COLORS2.grey }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(30000)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Cần phải thanh toán
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                
                {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice + 30000)}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30 }}>
              <PrimaryButton onPress={()=> navigation.navigate('ShipScreen',[listCart, totalPrice])} title="Xác nhận đơn mua hàng" />
            </View>
          </View>
        )}
      />
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
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS2.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS2.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
  },
});

export default CartScreen;

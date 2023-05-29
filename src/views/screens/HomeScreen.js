import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import Loader from "../components/Loader";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import axios from "axios";

import { MaterialIcons } from "@expo/vector-icons";
import { COLORS2 } from "../../conts/colors";
import HeaderScreen from "../components/Header";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const HomeScreen = ({ navigation }) => {
  const [listOutstandingProduct, setListOutstandingProduct] = useState([]);

  const loadListOutstandingProduct = async () => {
    try {
      const data = await axios.get(
        "http://10.0.2.2:8000/api/product/getListOutstandingProduct"
      );
      setListOutstandingProduct(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadListOutstandingProduct();
  }, []);

  const Card = ({ food }) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS2.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailsScreen", food)}
      >
        <View style={style.card}>
          <View style={{ alignItems: "center", top: -40 }}>
            <Image
              source={{
                uri: `http://10.0.2.2:8000${food.ImageAvatarUrl}`,
              }}
              style={{ height: 120, width: 120 }}
            />
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text
              numberOfLines={2}
              style={{ fontSize: 18, fontWeight: "bold" }}
            >
              {food.Name}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS2.grey, marginTop: 2 }}>
              {food.ingredients}
            </Text>
          </View>
          <View
            style={{
              marginTop: -10,
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(food.Price)}
            </Text>
            <View style={style.addToCartBtn}>
              <MaterialIcons name="add" size={20} color={COLORS2.white} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS2.white }}>
      <HeaderScreen navigation={navigation} />
      <View>
        <Text
          style={{
            marginLeft: 10,
            marginTop: 10,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Sản Phẩm Nổi Bật
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={listOutstandingProduct}
        renderItem={({ item }) => <Card food={item} />}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: COLORS2.light,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS2.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoryBtn: {
    padding: 10,
    marginRight: 7,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS2.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS2.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS2.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

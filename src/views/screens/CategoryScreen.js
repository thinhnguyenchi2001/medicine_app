import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
} from "react-native";
import {
  FlatList,
  ScrollView,
  TextInput,
  Input,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

import axios from "axios";
import HeaderScreen from "../components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS2, COLORS } from "../../conts/colors";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const CategoryScreen = ({ navigation }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState();
  const [categories, setCategories] = React.useState([]);
  const [listProduct, setListProduct] = React.useState([]);
  const [value, setValue] = React.useState();

  const getListProduct = async () => {
    selectedCategoryIndex && axios
      .get(
        `http://10.0.2.2:8000/api/category/getCategory?id=${selectedCategoryIndex}`
      )
      .then((response) => setListProduct(response.data.ListProduct))
      .catch((error) => console.log(error));
  };


  async function getListCategory() {
    try {
      const data = await axios.get(
        "http://10.0.2.2:8000/api/category/getListCategory"
      );
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=> {
    setListProduct([])
  }, [value])

  React.useEffect(() => {
    getListProduct();
  }, [selectedCategoryIndex]);

  React.useEffect(() => {
    getListCategory();
  }, []);


  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}
      >
        {categories
          .filter((e) => e?.Parent === value)
          .filter((e) => e?.Level === 3)
          .map((category) => (
            <TouchableOpacity
              key={category?.Id}
              activeOpacity={0.8}
              onPress={() => setSelectedCategoryIndex(category?.Id)}
            >
              <View
                style={{
                  backgroundColor:
                    selectedCategoryIndex == category?.Id
                      ? COLORS2.primary
                      : COLORS2.secondary,
                  ...style.categoryBtn,
                }}
              >
                <View style={style.categoryBtnImgCon}>
                  <Image
                    source={{
                      uri: `http://10.0.2.2:8000${category?.ImageAvatarUrl}`,
                    }}
                    style={{ height: 35, width: 35, resizeMode: "cover" }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginLeft: 10,
                    color:
                      selectedCategoryIndex == category?.Id
                        ? COLORS2.white
                        : COLORS2.primary,
                  }}
                >
                  {category?.Name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    );
  };
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
      <Text
        style={{
          marginLeft: 10,
          marginTop: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Danh mục sản phẩm
      </Text>
      <View>
        <Picker
          style={{
            backgroundColor: COLORS2.secondary,
            marginTop: 20,
            marginLeft: 10,
            marginRight: 10,
          }}
          selectedValue={value}
          onValueChange={(e) => {
            setValue(e);
          }}
        >
          <Picker.Item label={"Chọn phân loại"} value={""} />
          <Picker.Item key={1} label={"Sinh lý- Nội tiết tố"} value={2} />
          <Picker.Item
            key={2}
            label={"Cải thiện tăng cường chức năng"}
            value={3}
          />
          <Picker.Item
            key={2}
            label={"Thuốc dị ứng"}
            value={13}
          />
          <Picker.Item
            key={2}
            label={"Công cụ y tế"}
            value={14}
          />
        </Picker>
      </View>
      <View>
        <ListCategories />
      </View>
     {listProduct.length? <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={listProduct}
        renderItem={({ item }) => <Card food={item} />}
      />: <View style={{marginLeft: 20}}><Text>Không có sản phẩm nào</Text></View>}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS2.primary,
  },
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

export default CategoryScreen;

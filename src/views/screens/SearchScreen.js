import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import HeaderScreen from "../components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS, { COLORS2 } from "../../conts/colors";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const SearchScreen = ({ navigation }) => {
  const [listProduct, setListProduct] = useState([]);
  const [inputs, setInputs] = useState("");

  const [auth, setAuth] = useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  const authUser = async () => {
    let userData = await AsyncStorage.getItem("userData");
    userData ? setAuth(true) : setAuth(false);
  };

  const getSearchListProduct = async () => {
    axios
      .get(
        `http://10.0.2.2:8000/api/product/getSearchListProduct?keyword=${inputs}`
      )
      .then((response) => setListProduct(response.data))
      .catch((error) => console.log(error));
  };

  const handleOnchange = (text) => {
    setInputs(text);
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
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
             marginTop: -10
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
            <HeaderScreen navigation={navigation}/>
            
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View style={style.inputContainer}>
          <TextInput
            onChangeText={(text) => handleOnchange(text)}
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Tìm kiếm sản phẩm"
          />
          
        </View>
        
        <View style={style.sortBtn}>
          {/* <MaterialIcons onPress={()=>getSearchListProduct()} name="tune" size={28} color={COLORS2.white} /> */}
          <Icon
            onPress={() => getSearchListProduct()}
            name="search"
            color={COLORS2.white}
            size={28}
          />
        </View>
      </View>
      <Text
          style={{
            marginLeft: 10,
            marginTop: 10,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {inputs && `Tìm kiếm sản phẩm theo từ khóa '${inputs}'`}
        </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={listProduct}
        renderItem={({ item }) => <Card food={item} />}
      />
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
    marginBottom: 20,
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

export default SearchScreen;

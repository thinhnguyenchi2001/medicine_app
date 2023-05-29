import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import Loader from "./Loader";
import { COLORS2 } from "../../conts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HeaderScreen = ({ navigation }) => {
  const [user, setUser] = React.useState();
  const [auth, setAuth] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  const authUser = async () => {
    let userData = await AsyncStorage.getItem("userData");
    userData ? setAuth(true) : setAuth(false);
  };

  const getUser = async () => {
    let userData = await AsyncStorage.getItem("userData");

    userData && axios
      .get(
        `http://10.0.2.2:8000/api/user/getUser?userId=${
          JSON.parse(userData).Id
        }`
      )
      .then((response) => {
        setUser(response.data.Item);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
     auth && getUser();
  }, [auth, ]);

  return (
    <>
    <Loader visible={loading} />
    <View style={style.header}>
      <View
        style={{ alignItems: "center", width: 100, justifyContent: "center" }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/logo.png")}
            style={{
              height: 30,
              width: 30,
              borderRadius: 25,
              marginRight: 10,
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 5,
            fontSize: 16,
            fontWeight: "bold",
            color: COLORS2.white,
          }}
        >
          HealPlus
        </Text>
      </View>
      {auth ? (
        <View
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => navigation.navigate("UserScreen")}
          style={{
            alignItems: "center",
            width: 100,
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/avt.jpg")}
            style={{ height: 30, width: 30, borderRadius: 25 }}
          />

          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: COLORS2.white,
              fontWeight: "bold",
            }}
          >
            {user?.FullName}
          </Text>
        </View>
      ) : (
        <View style={{alignItems:"center", justifyContent:"center", flexDirection: "row"}}>
         
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{ color: "black", backgroundColor: COLORS2.secondary, padding: 5, borderRadius: 10, fontWeight: "bold", marginRight: 10}}
        >
          Đăng nhập
        </Text>
        <Text
          onPress={() => navigation.navigate("RegistrationScreen")}
          style={{ color: "black", backgroundColor: COLORS2.secondary, padding: 5, borderRadius: 10, fontWeight: "bold"}}
        >
          Đăng ký
        </Text>
        </View>
      )}
    </View></>
  );
};

export default HeaderScreen;

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
})

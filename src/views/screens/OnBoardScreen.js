import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS2 } from "../../conts/colors";
import { PrimaryButton } from "../components/Button2";

const OnBoardScreen = ({ navigation }) => {
  const [tabNumber, setTabNumber] = React.useState(1);
  const [focus, setFocus] = React.useState(1);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS2.white }}>
      {tabNumber === 1 && (
        <View style={{ height: 400 }}>
          <Image
            style={{
              width: "100%",
              resizeMode: "contain",
              top: 100,
            }}
            source={require("../../assets/logo.png")}
          />
        </View>
      )}
      {tabNumber === 2 && (
        <View style={{ height: 400 }}>
          <Image
            style={{
              width: "100%",
              resizeMode: "contain",
              top: 100,
            }}
            source={require("../../assets/logo.png")}
          />
        </View>
      )}
      {tabNumber === 3 && (
        <View style={{ height: 400 }}>
          <Image
            style={{
              width: "100%",
              resizeMode: "contain",
              top: 100,
            }}
            source={require("../../assets/logo.png")}
          />
        </View>
      )}
      <View style={style.textContainer}>
        {tabNumber === 1 && (
          <View>
            <Text
              style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}
            >
              HealPlus
            </Text>
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                textAlign: "center",
                color: COLORS2.grey,
              }}
            >
              Hệ thông bán thuốc hàng đầu Đông Nam Á
            </Text>
          </View>
        )}
        {tabNumber === 2 && (
          <View>
            <Text
              style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}
            >
              HealPlus
            </Text>
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                textAlign: "center",
                color: COLORS2.grey,
              }}
            >
              Hệ thông bán thuốc hàng đầu Đông Nam Á
            </Text>
          </View>
        )}
        {tabNumber === 3 && (
          <View>
            <Text
              style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}
            >
              HealPlus
            </Text>
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                textAlign: "center",
                color: COLORS2.grey,
              }}
            >
              Hệ thông bán thuốc hàng đầu Đông Nam Á
            </Text>
          </View>
        )}
        <View style={style.indicatorContainer}>
          <View
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {
              setTabNumber(1);
              setFocus(1);
            }}
            style={focus === 1 ? style.currentIndicator : style.indicator}
          />
          <View
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {
              setTabNumber(2);
              setFocus(2);
            }}
            style={focus === 2 ? style.currentIndicator : style.indicator}
          />
          <View
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {
              setTabNumber(3);
              setFocus(3);
            }}
            style={focus === 3 ? style.currentIndicator : style.indicator}
          />
        </View>
        <PrimaryButton
          onPress={() => navigation.navigate("Home")}
          title="Bắt đầu"
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  indicatorContainer: {
    height: 50,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  currentIndicator: {
    height: 12,
    width: 30,
    borderRadius: 10,
    backgroundColor: COLORS2.primary,
    marginHorizontal: 5,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS2.grey,
    marginHorizontal: 5,
  },
});

export default OnBoardScreen;

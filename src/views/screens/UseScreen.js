import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { COLORS2 } from "../../conts/colors";
import axios from "axios";
import { Table, Row, Rows } from "react-native-table-component";
import Modal from "react-native-modal";
import EditUser from "../components/FormEditUser";
import EditPass from "../components/FormEditPass";

const UserScreen = ({ navigation, route }) => {
  const [user, setUser] = React.useState();
  const [listOrderUser, setListOrderUser] = React.useState([]);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [idOrderSelect, setIdOrderSelect] = React.useState();
  const [name, setName] = useState(user?.FullName);
  const [mode, setMode] = useState("editUser");

  useEffect(() => {
    user && setName(user?.FullName);
  }, [user]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const DeleteOrder = (Id) => {
    return (
      <View>
        <Text
          onPress={() =>
            Alert.alert("Thông báo", "Bạn có muốn hủy đơn hàng?", [
              { text: "Ok", onPress: () => deleteOrder(Id) },
              { text: "Hủy" },
            ])
          }
        >
          Hủy
        </Text>
      </View>
    );
  };

  const ShowOrder = (Id) => {
    return (
      <View>
        <Text
          onPress={() => {
            toggleModal();
            setIdOrderSelect(Id);
          }}
        >
          Xem
        </Text>
      </View>
    );
  };

  const logout = () => {
    AsyncStorage.removeItem("userData");
    navigation.navigate("LoginScreen");
  };

  const getListOrderUser = () => {
    axios
      .get(`http://10.0.2.2:8000/api/order/getListOrderUser?userId=${user.Id}`)
      .then((response) => setListOrderUser(response.data))
      .catch((error) => console.log(error));
  };

  const deleteOrder = (Id) => {
    axios
      .get(`http://10.0.2.2:8000/api/order/deleteOrder?orderId=${Id}`)
      .then((response) => {
        if (response.data.IsSuccess) getListOrderUser();
      })
      .catch((error) => console.log(error));
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 0:
        return "Chưa xác nhận";
        break;
      case 1:
        return "Đã xác nhận";
        break;
      case 2:
        return "Đang giao hàng";
        break;
      case 3:
        return "Đã giao hàng";
        break;
      case 4:
        return "Đã bị huỷ";
        break;
    }
  };

  const getUser = async () => {
    let userData = await AsyncStorage.getItem("userData");

    axios
      .get(
        `http://10.0.2.2:8000/api/user/getUser?userId=${
          JSON.parse(userData).Id
        }`
      )
      .then((response) => setUser(response.data.Item))
      .catch((error) => console.log(error));
  };
  React.useEffect(() => {
    getUser();
  }, []);

  React.useEffect(() => {
    user && getListOrderUser();
  }, [user]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS2.white }}>
      <View style={style.header}>
        <MaterialIcons
          name="arrow-back-ios"
          size={28}
          onPress={navigation.goBack}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/avt.jpg")}
            style={{ height: 100, width: 100, borderRadius: 25 }}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: 20,
            }}
          >
            <Text
              onPress={() => {toggleModal()
              setMode("editUser")}}
              style={{ color: COLORS2.primary, fontSize: 18, marginRight: 30 }}
            >
              <Feather name="edit" size={24} color="black" />
            </Text>
            <Text onPress={() => {toggleModal()
              setMode("editPass")}} style={{ fontSize: 18, marginLeft: 30 }}>
              <AntDesign name="lock1" size={24} color="black" />
            </Text>
          </View>
          <Text
            onPress={() => {}}
            style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
          >
            {name}
          </Text>

          <Text onPress={logout} style={{ fontSize: 18, fontWeight: "bold" }}>
            Đăng xuất
          </Text>
        </View>

        <View>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 50,
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
            }}
          >
            Danh sách đơn hàng
          </Text>
        </View>

        {isModalVisible && (
          <Modal isVisible={isModalVisible}>
            {mode === "detail" && (
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Text
                  style={{
                    backgroundColor: COLORS2.primary,
                    color: "white",
                    height: 40,
                    fontSize: 18,
                    textAlign: "center",
                    paddingTop: 6,
                  }}
                >
                  Danh sách sản phẩm của đơn hàng
                </Text>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                  <Row
                    data={["STT", "Tên sản phẩm", "Ảnh", "Số lượng", ""]}
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      backgroundColor: "white",
                    }}
                  />
                  <Rows
                    style={{ backgroundColor: "white" }}
                    data={listOrderUser
                      .find((e) => e.Id == idOrderSelect)
                      .OrderDetail.map((e, index) => [
                        index + 1,
                        e?.ProductInfo?.Name,
                        <Image
                          source={{
                            uri: `http://10.0.2.2:8000${e?.ProductInfo?.ImageAvatarUrl}`,
                          }}
                          style={{ height: 70, width: 70 }}
                        />,
                        e?.BuyQuantity,
                        <Text
                          onPress={() =>
                            navigation.navigate("DetailsScreen", e.ProductInfo)
                          }
                        >
                          xem
                        </Text>,
                      ])}
                  />
                </Table>
                <Button
                  style={{ backgroundColor: COLORS2.primary }}
                  title="Đóng danh sách sản phẩm"
                  onPress={toggleModal}
                />
              </View>
            )}
            {mode === "editUser" && (
              <EditUser
                navigation={navigation}
                toggleModal={toggleModal}
                setName={setName}
              />
            )}
            {mode === "editPass" && (
              <EditPass
                navigation={navigation}
                toggleModal={toggleModal}
                setName={setName}
              />
            )}
          </Modal>
        )}

        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row
              data={["STT", "Thời gian", "Tổng tiền", "Trạng thái", "", ""]}
              style={{
                fontWeight: "bold",
                fontSize: 12,
                backgroundColor: "white",
              }}
            />
            <Rows
              style={{ backgroundColor: "white" }}
              data={listOrderUser.map((e, index) => [
                index + 1,
                e.TimeOrder,
                e.TotalMoney,
                renderOrderStatus(e.Status),
                ShowOrder(e.Id),
                DeleteOrder(e.Id),
              ])}
            />
          </Table>
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
    marginTop: 20,
    paddingTop: 20,
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 10, borderRadius: 30 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
});

export default UserScreen;

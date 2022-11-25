import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  Keyboard,
  Platform,
} from "react-native";
import {
  RouteProp,
  TabRouter,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import { ModalPicker } from "../../componets/ModalPicker";
import { ListItem } from "../../componets/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPromsList } from "../../routes/app.routes";
type RouteDetailParams = {
  Order: {
    number: string | number;
    order_id: string;
    order: boolean;
  };
};
export type CategoryProps = {
  id: string;
  name: string;
};
type ProdutsPros = {
  id: string;
  name: string;
};
export type ItensProps = {
  id: string;
  products_id: string;
  name: string;
  amount: string | number;
  price: string;
};
type OrderRouteProps = RouteProp<RouteDetailParams, "Order">; //criando um tipo Order
export default function Order() {
  const route = useRoute<OrderRouteProps>(); //pegando propriedades nas rotas
  const navigation = useNavigation<NativeStackNavigationProp<StackPromsList>>();
  // verificando estado de o modal esta aberto
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  //armazenar categoria
  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  //qual categoria selecionar
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  //guarda produtos
  const [produts, setProducts] = useState<ProdutsPros[] | []>([]);
  //pegando produto selecionado
  const [productselected, setProductSelected] = useState<
    ProdutsPros | undefined
  >();
  //verificando estado do modal
  const [modalProductVisible, setModalProductVisible] = useState(false);
  //quantidade do iten
  const [items, setItems] = useState<ItensProps[]>([]);
  const [amout, setAmout] = useState("1");
  const [totalPrice, setTotalPrice] = useState("0");

  async function hendleCloseOrder() {
    Alert.alert(` Deseja fechar mesa ${route.params?.number}`, "", [
      {
        text: "sim",
        onPress: async () => {
          let existe = route.params?.order;
          if (existe) {
            navigation.goBack();
            return;
          }

          await api
            .delete("/order/remover/table", {
              params: { order_id: route.params?.order_id },
            })
            .then(() => {
              navigation.goBack();
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },
      {
        text: "nao",
        onPress: () => {
          return;
        },
      },
    ]);
  }
  useEffect(() => {
    function multPriceProduct() {
      let total = 0;
      items.forEach((item) => {
        let somar =
          Number(item.amount) *
          parseFloat(item.price.toString().replace(",", "."));
        total += somar;
        Platform.OS === "android"
          ? setTotalPrice("R$ " + total.toFixed(2).replace(".", ","))
          : setTotalPrice(
              total.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })
            );
      });
    }
    multPriceProduct();
  }, [items]);
  useEffect(() => {
    async function loadInfo() {
      const response = await api.get("/categorys/list");
      setCategory(response.data);
      setCategorySelected(response.data[0]);
    }

    loadInfo();
  }, []);

  useEffect(() => {
    async function loadProdutos() {
      const resposta = await api.get("/category/products", {
        params: {
          category_id: categorySelected?.id,
        },
      });

      setProducts(resposta.data);
      setProductSelected(resposta.data[0]);
    }
    loadProdutos();
  }, [categorySelected]); //escutando se categoria selecionada for alterada sera executado useEffect buscando api

  function headleChengeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }
  function headleChengeProdutcs(item: ProdutsPros) {
    setProductSelected(item);
  }
  async function heandleAdd() {
    ///1 vericar se o produto selecionado e igual ao produto na lista

    var itemIgual = items.filter((item, index) => {
      return item.products_id === productselected?.id;
    });

    if (itemIgual.length) {
      let id_item = itemIgual[0].id;
      Alert.alert(
        "Deseja alterar",
        `${itemIgual[0].name}`,

        [
          {
            text: "Sim",
            onPress: async () => {
              console.log("apos o if ", id_item);
              await api
                .put("/order/item", {
                  item_id: id_item,
                  amount: Number(amout),
                })
                .then((response) => {
                  const data = response.data;
                  console.log(data);
                  // let itensResponse = data.map((data: any) => {
                  //   return {
                  //     id: data.id as string,
                  //     products_id: data.product.id as string,
                  //     name: data.product.name as string,
                  //     amount: data.amount,
                  //     price: data.product.price,
                  //   };
                  // });
                  // setItems(itensResponse);
                  // setAmout("1");
                  Keyboard.dismiss();

                  itemIgual = [];
                })
                .catch((error) => {
                  console.log(error);
                });
            },
          },
          {
            text: "nao",
            onPress: () => {
              return;
            },
          },
        ],
        {
          //cancelable: true, para fechar o alerte para fechar
        }
      );
      Keyboard.dismiss();
      itemIgual = [];
      return;
    }
    if (!itemIgual.length) {
      console.log("entrou");
      await api
        .post("/order/add", {
          ordem_id: route.params?.order_id,
          product_id: productselected?.id,
          amount: Number(amout),
        })
        .then((respose) => {
          console.log(respose.data);
          let data = {
            id: respose.data.id as string,
            products_id: respose.data.product.id as string,
            name: productselected?.name as string,
            amount: amout,
            price: respose.data.product.price as string,
          };

          setItems((aldArray) => [...aldArray, data]);

          setAmout("1");
          Keyboard.dismiss();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function hendledeleteItem(item: ItensProps) {
    ///1 vericar se o produto selecionado e igual ao produto na lista
    console.log("Paramentro", item);
    let itemIgual = items.filter((itemP, index) => {
      return itemP.id === item.id;
    });
    console.log("igual", itemIgual);
    if (itemIgual.length) {
      console.log("igual", itemIgual[0]);
      Alert.alert(
        "Deseja remover",
        `${itemIgual[0].name}`,

        [
          {
            text: "Sim",

            onPress: async () => {
              console.log("item", itemIgual[0].id);
              await api
                .delete("/order/remover/item", {
                  params: { item_id: itemIgual[0].id },
                })
                .then(() => {
                  let removerItem = items.filter((itemfilter) => {
                    return itemfilter.id !== item.id;
                  });
                  setItems(removerItem);
                })
                .catch((erro) => {
                  console.log(erro);
                });
            },
          },
          {
            text: "nao",
            onPress: () => {
              return;
            },
          },
        ],
        {
          //cancelable: true, para fechar o alerte para fechar
        }
      );
    }

    //proxima atualizacao pode nao funfa para nessa req ta como body e vai mudar para params
  }
  function openfinishOrder() {
    navigation.navigate("FinishOrder", {
      number: route.params?.number,
      order_id: route.params?.order_id,
      totalPrice: totalPrice,
    });
  }
  return (
    <SafeAreaView style={styles.conteiner}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={hendleCloseOrder}>
            <Feather name="trash-2" size={28} color="#ff3f4b" />
          </TouchableOpacity>
        )}
      </View>

      {category.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalCategoryVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{categorySelected?.name} </Text>
        </TouchableOpacity>
      )}
      {produts.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalProductVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{productselected?.name} </Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdConteaner}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[
            styles.input,
            { width: "40%", textAlign: "center", color: "#fff" },
          ]}
          placeholderTextColor="#f0f0f0"
          keyboardType="numeric"
          value={amout}
          onChangeText={setAmout}
        />

        <TouchableOpacity style={styles.buttonAdd} onPress={heandleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 10 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            data={item}
            DeleteItem={hendledeleteItem}
            AlterarItem={heandleAdd}
          />
        )}
      />
      {items.length !== 0 && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 5,
          }}
        >
          <Text style={[styles.qtdText, { marginBottom: 10 }]}>
            {totalPrice}
          </Text>
          <TouchableOpacity
            style={[styles.button]}
            disabled={items.length === 0}
            onPress={openfinishOrder}
          >
            <Text style={styles.buttonText}>Avançar</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="slide"
      >
        <ModalPicker
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={category}
          selectItem={headleChengeCategory}
        />
      </Modal>
      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="slide"
      >
        <ModalPicker
          handleCloseModal={() => setModalProductVisible(false)}
          options={produts}
          selectItem={headleChengeProdutcs}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingEnd: "4%",
    paddingStart: "4%",
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 14,
  },
  input: {
    backgroundColor: "#101026",
    borderRadius: 4,
    width: "100%",
    height: 40,
    marginTop: 10,
    justifyContent: "center",
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 20,
  },
  qtdConteaner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonAdd: {
    width: "20%",
    backgroundColor: "#3fd1ff",
    borderRadius: 4,
    justifyContent: "center",
    height: 40,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#101026",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3fffa3",
    height: 40,
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});

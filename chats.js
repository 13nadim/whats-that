import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, TextInput } from "react-native-web";

export default class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chat_id: "",
      messages: [],
      loading: true,
      new_message: "",
      chats: [],
      chatName: "",
      newChatName: "",
      user_id: "",
      message_id: "",
      updated_message: "",
      showModal: false,
      showNewModal: false,
    };
  }

  componentDidMount() {
    this.getChatsList();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      console.log("Component is focused");
      this.getChatsList();
    });
  }

  getChatsList = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    return fetch("http://localhost:3333/api/1.0.0/chat", {
      method: "GET",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else {
          throw "Server Error";
        }
      })
      .then((rjson) => {
        this.setState({ chats: rjson, loading: false });
      })
      .catch((err) => {
        console.log("Error fetching chat list:", err);
      });
  };

  createConversation = async (chatName) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    if (chatName === "") {
      console.log("Chat name cannot be empty");
      return;
    }

    fetch("http://localhost:3333/api/1.0.0/chat", {
      method: "POST",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: chatName }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else {
          throw "Server error";
        }
      })
      .then((data) => {
        console.log("Chat created successfully with chat_id:", data.chat_id);
      })
      .catch((error) => {
        console.error("Error creating chat:", error);
      });
  };

  updateChat = async (chat_id, newName) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    if (newName === "") {
      console.log("Chat name cannot be empty");
      return;
    }

    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
      method: "PATCH",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Chat updated successfully");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error updating chat:", error);
      });
  };

  addUserToChat = async (chat_id, user_id) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
      method: "POST",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("User added to chat successfully");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error adding user to chat:", error);
      });
  };

  removeUserFromChat = async (chat_id, user_id) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
      method: "DELETE",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("User removed from chat successfully");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error adding user to chat:", error);
      });
  };

  sendMessageToChat = async (chat_id) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const message = this.state.new_message;

    if (message === "") {
      console.log("Message cannot be empty");
      return;
    }

    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message`, {
      method: "POST",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Message sent successfully");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  updateMessage = async (chat_id, message_id) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const updatedMessage = this.state.updated_message;

    if (updatedMessage === "") {
      console.log("Updated message cannot be empty");
      return;
    }

    console.log("Updating chat with message_id:", chat_id, "+", message_id);
    console.log("Message ID:", message_id);

    fetch(
      `http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`,
      {
        method: "PATCH",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: updatedMessage }),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Message updated successfully");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error updating message:", error);
      });
    console.log("Message ID:", data.message_id);
  };

  deleteMessage = async (chat_id, message_id) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    fetch(
      `http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`,
      {
        method: "DELETE",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Message deleted successfully");
        } else if (response.status === 401) {
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not Found";
        } else {
          throw "Server Error";
        }
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  };

  openModal = (chatId, newName) => {
    this.setState({
      selectedChatId: chatId,
      updatedChatName: newName,
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      selectedChatId: "",
      updatedChatName: "",
      showModal: false,
    });
  };

  openNewModal = (chatId, newName) => {
    this.setState({
      selectedChatId: chatId,
      updatedChatName: newName,
      showNewModal: true,
    });
  };

  closeNewModal = () => {
    this.setState({
      selectedChatId: "",
      updatedChatName: "",
      showNewModal: false,
    });
  };

  render() {
    const { chats, showModal, showNewModal } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="New Chat"
            onPress={() => this.setState({ showNewModal: true })}
          />
        </View>

        <FlatList
          data={chats}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() =>
                  this.props.navigation.navigate("ChatScreen", {
                    chatId: item.chat_id,
                  })
                }
                onLongPress={() => this.openModal(item.chat_id, item.name)}
              >
                <Text style={styles.chatName}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.chat_id.toString()}
        />

        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new conversation name"
              value={this.state.updatedChatName || ""}
              onChangeText={(text) => this.setState({ updatedChatName: text })}
            />

            <Button
              title="Update Conversation"
              onPress={() => {
                this.updateChat(
                  this.state.selectedChatId,
                  this.state.updatedChatName
                );
                this.getChatsList();
              }}
            />

            <Button title="Close" onPress={this.closeModal} />
          </View>
        </Modal>
        <Modal
          visible={showNewModal}
          animationType="slide"
          onRequestClose={this.closeNewModal}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new conversation name"
              value={this.state.newChatName || ""}
              onChangeText={(text) => this.setState({ newChatName: text })}
            />

            <Button
              title="New Conversation"
              onPress={() => {
                this.createConversation(this.state.newChatName);
                this.getChatsList();
                this.closeNewModal();
              }}
            />

            <Button title="Close" onPress={this.closeNewModal} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  chatItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingVertical: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

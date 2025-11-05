import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ChatScreen extends Component {
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
      isModalOpen: false,
      updatedMessageText: "",
    };
  }

  componentDidMount() {
    const { user_id } = this.props.route.params;
    this.setState({ user_id }, () => {
      this.viewDetailsOfAChat();
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
        console.log(this.state.chats);
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

  viewDetailsOfAChat = async (limit = 20, offset = 0) => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const chatId = this.props.route.params.chatId;
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatId}`,
        {
          headers: {
            "X-Authorization": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const chatDetails = await response.json();
        console.log("Chat details:", chatDetails);
        this.setState({ messages: chatDetails });
        console.log(this.state.messages.messages);
        console.log(this.state.messages);
        return chatDetails;
      } else if (response.status === 401) {
        throw "Unauthorised";
      } else if (response.status === 403) {
        throw "Forbidden";
      } else if (response.status === 404) {
        throw "Not Found";
      } else {
        throw "Server Error";
      }
    } catch (error) {
      console.error("Error getting chat details:", error);
    }
  };

  updateChat = async (chat_id, newName) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    if (newName === "") {
      console.log("Chat name cannot be empty");
      return;
    }
    console.log("Updating chat with chat_id:", chat_id);

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

  sendMessageToChat = async () => {
    const chatId = this.props.route.params.chatId;
    console.log("Chat ID:" + chatId);
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const message = this.state.new_message;

    if (message === "") {
      console.log("Message cannot be empty");
      return;
    }

    fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
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
          this.viewDetailsOfAChat();
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

  updateMessage = async (message_id, updatedMessage) => {
    const chatId = this.props.route.params.chatId;
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${message_id}`,
      {
        method: "PATCH",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: updatedMessage,
        }),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Message updated successfully");
          this.viewDetailsOfAChat();
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
  };

  deleteMessage = async (message_id) => {
    const chatId = this.props.route.params.chatId;
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${message_id}`,
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
          this.viewDetailsOfAChat();
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

  openModal = (messageId) => {
    this.setState({
      selectedMessageId: messageId,
      updatedMessageText: "",
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      selectedMessageId: "",
      updatedMessageText: "",
      isModalOpen: false,
    });
  };

  renderItem = ({ item }) => {
    const { user_id } = this.state;
    const isUserSent = item.sender_id === user_id;
    const bubbleStyle = isUserSent
      ? styles.userSentBubble
      : styles.receivedBubble;
    const textStyle = isUserSent ? styles.userSentText : styles.receivedText;

    return (
      <View style={[styles.messageBubble, bubbleStyle]}>
        <TouchableOpacity
          onPress={() => this.openModal(item.message_id)}
          onLongPress={() => this.deleteMessage(item.message_id)}
        >
          <Text style={[styles.messageText, textStyle]}>{item.message}</Text>
          <Text style={[styles.messageText1, textStyle]}>
            {item.author.first_name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      new_message,
      messages,
      user_id,
      updated_message,
      isModalOpen,
      updatedMessageText,
      selectedMessageId,
    } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={messages.messages}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.message_id}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={new_message || ""}
            onChangeText={(val) => this.setState({ new_message: val })}
            placeholder="Type your message..."
          />

          <Button title="Send" onPress={() => this.sendMessageToChat()} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={user_id || ""}
            onChangeText={(val) => this.setState({ user_id: val })}
            placeholder="Enter User ID:"
          />

          <Button
            title="Add User"
            onPress={() =>
              this.addUserToChat(this.props.route.params.chatId, user_id)
            }
          />
          <Button
            title="Remove User"
            onPress={() =>
              this.removeUserFromChat(this.props.route.params.chatId, user_id)
            }
          />
        </View>

        <Modal visible={isModalOpen} onRequestClose={this.closeModal}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.modalInput}
              value={updatedMessageText}
              onChangeText={(text) =>
                this.setState({ updatedMessageText: text })
              }
              placeholder="Type the updated message..."
            />
            <Button
              title="Save"
              onPress={() => {
                this.updateMessage(selectedMessageId, updatedMessageText);
                this.closeModal();
              }}
            />
            <Button
              title="Delete"
              onPress={() => {
                this.deleteMessage(selectedMessageId);
                this.closeModal();
              }}
            />
            <Button title="Close" onPress={this.closeModal} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    paddingLeft: 10,
  },
  messageBubble: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  userSentBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  receivedBubble: {
    backgroundColor: "#E4E4E4",
    alignSelf: "flex-start",
  },
  userSentText: {
    textAlign: "right",
  },
  receivedText: {
    textAlign: "left",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalInput: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  messageText1: {
    fontSize: 14,
    color: "grey",
  },
});

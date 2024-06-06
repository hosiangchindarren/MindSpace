import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from "react-native";
import { collection, addDoc, onSnapshot, deleteDoc, query, where, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const ForumScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  const deletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Post Details', { postId: item.id })}>
            <View style={styles.postItem}>
              <View style={styles.postText}>
                <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Text style={styles.postAuthor}>by {item.displayName}</Text>
              </View>
              {item.userId === user.uid && (
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Post')}>
        <Text style={styles.addButtonText}>ADD POST</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  searchInput: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postText: {
    flex: 1,
    marginRight: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  postAuthor: {
    fontSize: 12,
    color: "gray",
  },
  deleteButton: {
    fontSize: 20,
    color: "red",
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ForumScreen;

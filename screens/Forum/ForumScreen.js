import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from "react-native";
import { collection, onSnapshot, deleteDoc, query, orderBy, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";
import Icon from 'react-native-vector-icons/FontAwesome'; 

const ForumScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", sortOrder));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, [sortOrder]);

  const deletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === "desc" ? "asc" : "desc"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <TouchableOpacity onPress={toggleSortOrder}>
          <Image
            source={sortOrder === "desc" ? require('../../assets/sort-desc.png') : require('../../assets/sort-asc.png')}
            style={styles.sortIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Post Details', { postId: item.id })}>
            <View style={styles.postItem}>
              <View style={styles.postText}>
                <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Text style={styles.postAuthor}>by {item.displayName} on {new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
              </View>
              {item.userId === user.uid && (
                <TouchableOpacity onPress={() => deletePost(item.id)} style={styles.deleteButton}>
                  <Icon name="trash" size={24} color="grey" />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  sortIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
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
    padding: 10,
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

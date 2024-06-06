import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from "react-native";
import { doc, getDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";

const PostDetailsScreen = ({ route }) => {
  const { postId } = route.params;
  const { user } = useContext(AuthenticatedUserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getPost = async () => {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (postDoc.exists()) {
        setPost(postDoc.data());
      }
    };

    const q = collection(db, "posts", postId, "comments");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = [];
      querySnapshot.forEach((doc) => {
        commentsArray.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsArray);
    });

    getPost();

    return () => unsubscribe();
  }, [postId]);

  const addComment = async () => {
    if (newComment.trim()) {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content: newComment,
        displayName: user.displayName,
        userId: user.uid,
        createdAt: new Date(),
      });
      setNewComment("");
    }
  };

  if (!post) return null;

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postAuthor}>by {post.displayName}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentAuthor}>{item.displayName}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a comment"
        value={newComment}
        onChangeText={(text) => setNewComment(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={addComment}>
        <Text style={styles.addButtonText}>ADD COMMENT</Text>
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
  postContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  postAuthor: {
    fontSize: 14,
    color: "gray",
  },
  postContent: {
    fontSize: 16,
    marginTop: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    fontSize: 14,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  addButton: {
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

export default PostDetailsScreen;

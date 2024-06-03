import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

const GoalSettingScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ongoing', title: 'Ongoing' },
    { key: 'completed', title: 'Completed' },
  ]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "goals"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const goalsArray = [];
        querySnapshot.forEach((doc) => {
          goalsArray.push({ id: doc.id, ...doc.data() });
        });
        setGoals(goalsArray);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addGoal = async () => {
    if (newGoal.trim()) {
      await addDoc(collection(db, "goals"), {
        title: newGoal,
        status: "ongoing",
        createdAt: new Date(),
        userId: user.uid,
      });
      setNewGoal("");
    }
  };

  const updateGoalStatus = async (id, status) => {
    const goalDoc = doc(db, "goals", id);
    await updateDoc(goalDoc, { status });
  };

  const deleteGoal = async (id) => {
    const goalDoc = doc(db, "goals", id);
    await deleteDoc(goalDoc);
  };

  const OngoingGoals = () => (
    <FlatList
      data={goals.filter(goal => goal.status === "ongoing")}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Edit Goal', { goalId: item.id, currentTitle: item.title })}>
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => deleteGoal(item.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateGoalStatus(item.id, "completed")}>
                <Text style={styles.completeButton}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const CompletedGoals = () => (
    <FlatList
      data={goals.filter(goal => goal.status === "completed")}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Edit Goal', { goalId: item.id, currentTitle: item.title })}>
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteGoal(item.id)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const renderScene = SceneMap({
    ongoing: OngoingGoals,
    completed: CompletedGoals,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Goal')}>
        <Text style={styles.addButtonText}>ADD GOAL</Text>
      </TouchableOpacity>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'purple' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ color: 'black' }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
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
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: '#E6E6FA',
  },
  goalText: {
    fontSize: 16,
    flexShrink: 1, 
    flexWrap: 'wrap', 
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    fontSize: 20,
    color: "green",
    marginLeft: 10,
  },
  deleteButton: {
    fontSize: 20,
    color: "red",
    marginLeft: 10,
  },
});

export default GoalSettingScreen;

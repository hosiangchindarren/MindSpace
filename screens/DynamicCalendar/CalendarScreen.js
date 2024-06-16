import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Calendar } from 'react-native-calendars';
import moment from "moment";
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import FireEffect from '../../components/FireEffect';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import debounce from 'lodash.debounce';

const CalendarScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [moods, setMoods] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState(0);
  const [moodStreak, setMoodStreak] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const fetchEntries = async () => {
    try {
      const q = query(collection(db, 'journalEntries'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const entriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString(),
      }));
      setEntries(entriesList);
    } catch (error) {
      console.error("Error fetching entries: ", error);
    }
  };

  const fetchMoods = async () => {
    try {
      const q = query(collection(db, 'moods'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const moodsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt.toDate().toISOString(),
      }));
      setMoods(moodsList);
    } catch (error) {
      console.error("Error fetching moods: ", error);
    }
  };

  const fetchReminders = async () => {
    try {
      const q = query(collection(db, 'reminders'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const remindersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString(),
      }));
      setReminders(remindersList);
      setFilteredReminders(remindersList);

      const marked = entries.reduce((acc, entry) => {
        const date = moment(entry.date).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = { dots: [] };
        }
        if (!acc[date].dots.some(dot => dot.key.startsWith('entry'))) {
          acc[date].dots.push({ key: `entry-${entry.id}`, color: 'red', selectedDotColor: 'red' });
        }
        return acc;
      }, {});

      moods.forEach(mood => {
        const date = moment(mood.date).format('YYYY-MM-DD');
        if (!marked[date]) {
          marked[date] = { dots: [] };
        }
        if (!marked[date].dots.some(dot => dot.key.startsWith('mood'))) {
          marked[date].dots.push({ key: `mood-${mood.id}`, color: 'blue', selectedDotColor: 'blue' });
        }
      });

      remindersList.forEach(reminder => {
        const date = moment(reminder.date).format('YYYY-MM-DD');
        if (!marked[date]) {
          marked[date] = { dots: [] };
        }
        marked[date].dots.push({ key: `reminder-${reminder.id}`, color: 'green', selectedDotColor: 'green' });
      });

      setMarkedDates((prevMarkedDates) => ({
        ...prevMarkedDates,
        ...marked,
      }));
    } catch (error) {
      console.error("Error fetching reminders: ", error);
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
      setFilteredReminders(filteredReminders.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      console.error("Error deleting reminder: ", error);
    }
  };

  const calculateStreaks = (entries, type) => {
    let streaks = 0;
    let currentStreak = 0;
    const today = moment().startOf('day');
    const dates = entries.map(entry => moment(entry.date).startOf('day')).sort((a, b) => a.diff(b));
    
    if (dates.length > 0) {
      if (dates[dates.length - 1].isSame(today, 'day')) {
        currentStreak = 1;
        streaks = 1;

        for (let i = dates.length - 1; i > 0; i--) {
          if (dates[i].diff(dates[i - 1], 'days') === 1) {
            currentStreak++;
            if (currentStreak > streaks) {
              streaks = currentStreak;
            }
          } else {
            break;
          }
        }
      }
    }

    if (type === 'journal') {
      setStreak(streaks);
    } else {
      setMoodStreak(streaks);
    }
  };

  const filterReminders = debounce((query) => {
    if (query) {
      const filtered = reminders.filter(reminder => reminder.title.toLowerCase().includes(query.toLowerCase()));
      setFilteredReminders(filtered);
    } else {
      setFilteredReminders(reminders);
    }
    setSearchQuery(query);
  }, 300);

  const handleConfirm = (date) => {
    const filtered = reminders.filter(reminder => moment(reminder.date).isSame(date, 'day'));
    setFilteredReminders(filtered);
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    fetchEntries();
    fetchMoods();
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [entries, moods]);

  useEffect(() => {
    calculateStreaks(entries, 'journal');
    calculateStreaks(moods, 'mood');
  }, [entries, moods]);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
      fetchMoods();
      fetchReminders();
    }, [])
  );

  const handleDayPress = (day) => {
    navigation.navigate('Add Reminder', { date: day.dateString });
  };

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={() => (
        <>
          <Calendar
            markedDates={markedDates}
            markingType={'multi-dot'}
            onDayPress={handleDayPress}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
              <Text style={styles.legendText}>Journal Entry</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'blue' }]} />
              <Text style={styles.legendText}>Mood Entry</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'green' }]} />
              <Text style={styles.legendText}>Reminder</Text>
            </View>
          </View>
          <View style={styles.streakContainer}>
            <FireEffect source={require('../../assets/JournalStreak.png')}>
              <Text style={styles.streakText}>
                {streak > 0 ? (
                  <>
                    {`${streak}-Day`}
                    {"\n"}
                    Journaling Streak
                    {"\n"}
                    Keep it up!
                  </>
                ) : (
                  <>
                    Do a journal entry
                    {"\n"}
                    to start your
                    {"\n"}
                    streak!
                  </>
                )}
              </Text>
            </FireEffect>
            <FireEffect source={require('../../assets/MoodStreak.png')}>
              <Text style={styles.streakText}>
                {moodStreak > 0 ? (
                  <>
                    {`${moodStreak}-Day`}
                    {"\n"}
                    Mood Tracking Streak
                    {"\n"}
                    Keep it up!
                  </>
                ) : (
                  <>
                    Do a mood entry
                    {"\n"}
                    to start your
                    {"\n"}
                    streak!
                  </>
                )}
              </Text>
            </FireEffect>
          </View>
          <Text style={styles.upcomingRemindersTitle}>Upcoming Reminders</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search reminders by title"
              value={searchQuery}
              onChangeText={filterReminders}
            />
            <TouchableOpacity onPress={showDatePicker}>
              <Ionicons name="calendar" size={24} color="#4B0082" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </>
      )}
      data={filteredReminders.filter(reminder => moment(reminder.date).isSameOrAfter(moment(), 'day'))}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.reminderItem}>
          <Text style={styles.reminderText}>{item.title}</Text>
          <Text style={styles.reminderDate}>{moment(item.date).format('DD-MM-YYYY HH:mm')}</Text>
          <TouchableOpacity onPress={() => deleteReminder(item.id)}>
            <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  streakText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    fontWeight: "bold",
  },
  streakMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingRemindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 16,
  },
  reminderDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default CalendarScreen;


import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import moment from "moment";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import FireEffect from '../../components/FireEffect';

const CalendarScreen = () => {
  const [entries, setEntries] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
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
    fetchEntries();
  }, []);

  useEffect(() => {
    const marked = entries.reduce((acc, entry) => {
      const date = moment(entry.date).format('YYYY-MM-DD');
      acc[date] = {
        customStyles: {
          container: { backgroundColor: 'transparent' },
          text: {
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'red',
            padding: 5,
            borderRadius: 5,
          },
        },
      };
      return acc;
    }, {});
    setMarkedDates(marked);

    const calculateStreaks = (entries) => {
      let streaks = 1;
      let currentStreak = 1;
      const dates = entries.map(entry => moment(entry.date)).sort((a, b) => a.diff(b));
      for (let i = 1; i < dates.length; i++) {
        if (dates[i].diff(dates[i - 1], 'days') === 1) {
          currentStreak++;
          if (currentStreak > streaks) {
            streaks = currentStreak;
          }
        } else {
          currentStreak = 1;
        }
      }
      setStreak(streaks);
    };
    calculateStreaks(entries);
  }, [entries]);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
      />
      {streak >= 1 && (
        <FireEffect>
          <Text style={styles.streakText}>{`${streak}-Day Journaling Streak! Keep it up!`}</Text>
        </FireEffect>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  streakText: {
    fontSize: 13,
    color: "#4B0082",
    textAlign: "center",
    padding: 10,
  },
});

export default CalendarScreen;

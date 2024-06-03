import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { format } from 'date-fns';

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

const MoodStatisticsScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState({});
  const [yearlyStats, setYearlyStats] = useState({});

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'moods'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const weekly = {};
        const monthly = {};
        const yearly = {};

        querySnapshot.forEach((doc) => {
          const mood = doc.data().mood;
          const createdAt = doc.data().createdAt.toDate();

          const weekOfYear = `${createdAt.getFullYear()}-Week ${createdAt.getWeek()}`;
          weekly[mood] = weekly[mood] ? { ...weekly[mood], [weekOfYear]: (weekly[mood][weekOfYear] || 0) + 1 } : { [weekOfYear]: 1 };

          const month = format(createdAt, 'MMMM');
          monthly[mood] = monthly[mood] ? { ...monthly[mood], [month]: (monthly[mood][month] || 0) + 1 } : { [month]: 1 };

          const year = format(createdAt, 'yyyy');
          yearly[mood] = yearly[mood] ? { ...yearly[mood], [year]: (yearly[mood][year] || 0) + 1 } : { [year]: 1 };
        });

        setWeeklyStats(weekly);
        setMonthlyStats(monthly);
        setYearlyStats(yearly);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const allMoods = ['Happy', 'Content', 'Neutral', 'Sad', 'Angry'];

  const getUniqueDates = (stats) => {
    return Object.keys(stats).reduce((dates, mood) => {
      Object.keys(stats[mood]).forEach((date) => {
        if (!dates.includes(date)) {
          dates.push(date);
        }
      });
      return dates;
    }, []);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.statsContainer}>
          <Text style={styles.period}>This Week</Text>
          {getUniqueDates(weeklyStats).map((date) => (
            <Text key={date}>{date}</Text>
          ))}
          {allMoods.map((mood) => (
            <View key={mood} style={styles.statItem}>
              <Text>{mood}</Text>
              <Text>{weeklyStats[mood] ? Object.values(weeklyStats[mood]).reduce((a, b) => a + b, 0) : 0}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.period}>This Month</Text>
          {getUniqueDates(monthlyStats).map((date) => (
            <Text key={date}>{date}</Text>
          ))}
          {allMoods.map((mood) => (
            <View key={mood} style={styles.statItem}>
              <Text>{mood}</Text>
              <Text>{monthlyStats[mood] ? Object.values(monthlyStats[mood]).reduce((a, b) => a + b, 0) : 0}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.period}>This Year</Text>
          {getUniqueDates(yearlyStats).map((date) => (
            <Text key={date}>{date}</Text>
          ))}
          {allMoods.map((mood) => (
            <View key={mood} style={styles.statItem}>
              <Text>{mood}</Text>
              <Text>{yearlyStats[mood] ? Object.values(yearlyStats[mood]).reduce((a, b) => a + b, 0) : 0}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  statsContainer: {
    marginBottom: 20,
  },
  period: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
});

export default MoodStatisticsScreen;
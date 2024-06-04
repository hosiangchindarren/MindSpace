import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { format } from 'date-fns';
import { BarChart } from 'react-native-chart-kit';

// Function to get the week of the year
Date.prototype.getWeek = function () {
  const onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

const MoodStatisticsScreen = ({ selectedDate = new Date(), isDatePickerVisible = false }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState({});
  const [yearlyStats, setYearlyStats] = useState({});

  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [isPickerVisible, setPickerVisibility] = useState(isDatePickerVisible);

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
          if (!weekly[mood]) weekly[mood] = {};
          weekly[mood][weekOfYear] = (weekly[mood][weekOfYear] || 0) + 1;

          const month = format(createdAt, 'MMMM yyyy');
          if (!monthly[mood]) monthly[mood] = {};
          monthly[mood][month] = (monthly[mood][month] || 0) + 1;

          const year = format(createdAt, 'yyyy');
          if (!yearly[mood]) yearly[mood] = {};
          yearly[mood][year] = (yearly[mood][year] || 0) + 1;
        });

        setWeeklyStats(weekly);
        setMonthlyStats(monthly);
        setYearlyStats(yearly);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const allMoods = [
    { mood: 'Happy', label: 'Happy 😃' },
    { mood: 'Content', label: 'Content 😊' },
    { mood: 'Neutral', label: 'Neutral 😐' },
    { mood: 'Sad', label: 'Sad 😟' },
    { mood: 'Angry', label: 'Angry 😠' }
  ];

  const prepareChartData = (stats) => {
    const labels = allMoods.map(mood => mood.label);
    const data = allMoods.map(mood => stats[mood.mood] ? Object.values(stats[mood.mood]).reduce((a, b) => a + b, 0) : 0);
    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  };

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

  const getStatsForSelectedWeek = () => {
    const week = currentDate.getWeek();
    const weekStats = {};
    allMoods.forEach(({ mood }) => {
      weekStats[mood] = {};
    });
    Object.keys(weeklyStats).forEach(mood => {
      weekStats[mood] = Object.keys(weeklyStats[mood])
        .filter(date => date.endsWith(`Week ${week}`))
        .reduce((acc, date) => {
          acc[date] = weeklyStats[mood][date];
          return acc;
        }, {});
    });
    return weekStats;
  };

  const getStatsForSelectedMonth = () => {
    const month = format(currentDate, 'MMMM yyyy');
    const monthStats = {};
    allMoods.forEach(({ mood }) => {
      monthStats[mood] = {};
    });
    Object.keys(monthlyStats).forEach(mood => {
      monthStats[mood] = Object.keys(monthlyStats[mood])
        .filter(date => date === month)
        .reduce((acc, date) => {
          acc[date] = monthlyStats[mood][date];
          return acc;
        }, {});
    });
    return monthStats;
  };

  const getStatsForSelectedYear = () => {
    const year = format(currentDate, 'yyyy');
    const yearStats = {};
    allMoods.forEach(({ mood }) => {
      yearStats[mood] = {};
    });
    Object.keys(yearlyStats).forEach(mood => {
      yearStats[mood] = Object.keys(yearlyStats[mood])
        .filter(date => date === year)
        .reduce((acc, date) => {
          acc[date] = yearlyStats[mood][date];
          return acc;
        }, {});
    });
    return yearStats;
  };

  const renderStats = (label, getStats) => {
    const stats = getStats();
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.period}>{label}</Text>
        {getUniqueDates(stats).map((date) => (
          <Text key={date}>{date}</Text>
        ))}
        {allMoods.map(({ mood, label }) => (
          <View key={mood} style={styles.statItem}>
            <Text>{label}</Text>
            <Text>{stats[mood] ? Object.values(stats[mood]).reduce((a, b) => a + b, 0) : 0}</Text>
          </View>
        ))}
        <BarChart
          data={prepareChartData(stats)}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
        />
      </View>
    );
  };

  const showDatePicker = () => {
    setPickerVisibility(true);
  };

  const hideDatePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setCurrentDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Select Date</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <FlatList
        data={[
          { label: `Week ${currentDate.getWeek()}`, key: 'week' },
          { label: format(currentDate, 'MMMM yyyy'), key: 'month' },
          { label: format(currentDate, 'yyyy'), key: 'year' }
        ]}
        renderItem={({ item }) => renderStats(item.label, 
          item.key === 'week' ? getStatsForSelectedWeek 
          : item.key === 'month' ? getStatsForSelectedMonth 
          : getStatsForSelectedYear)}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  datePickerButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
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

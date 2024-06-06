import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const MeditationScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Meditation Exercises');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userTimeInput, setUserTimeInput] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [sound, setSound] = useState(null);

  const tracks = [
    { name: "Moonlight Echoes", file: require('../../assets/moonlight-echoes.mp3') },
    { name: "Once in Paris", file: require('../../assets/once-in-paris.mp3') },
    { name: "Perfect Beauty", file: require('../../assets/perfect-beauty.mp3') },
  ];

  const headers = [
    "Focused attention",
    "Body scan",
    "Noting",
    "Visualization",
    "Loving kindness",
    "Skillful compassion",
    "Resting awareness",
    "Reflection",
    "Zen meditation",
    "Mantra meditation",
    "Transcendental meditation",
    "Yoga meditation",
    "Vipassana meditation",
    "Chakra meditation",
    "Qigong meditation",
    "Sound bath meditation"
  ];

  const content = [
    "This form of meditation is fairly straightforward because it uses the object of our breath to focus attention, to anchor the mind and maintain awareness. Notice your mind starting to wander? Simply return to the breath.",
    "Often, our body is doing one thing while our mind is elsewhere. This technique is designed to sync body and mind by performing a mental scan, from the top of the head to the end of your toes. Imagine a photocopier light slowly moving over your body, bringing attention to any discomfort, sensations, tensions, or aches that exist.",
    "Whether you are focusing on the breath or simply sitting in quiet, this technique involves specifically “noting” what’s distracting the mind, to the extent that we are so caught up in a thought or emotion that we’ve lost our awareness of the breath (or whatever the object of focus is). We “note” the thought or feeling to restore awareness, create a bit of space, as a way of letting go, and to learn more about our thought patterns, tendencies, and conditioning.",
    "This type of meditation invites you to picture something or someone in your mind — we are essentially replacing the breath with a mental image as the object of focus. It can feel challenging to some, but it’s really no different than vividly recalling the face of an old friend naturally, without effort. And so it is with meditation. By conjuring a specific visualization, we not only get to observe the mind, but we also get to focus on any physical sensations.",
    "Focusing on the image of different people — it doesn’t matter if we know them or not, if we like them or not — is integral to this technique. We direct positive energy and goodwill first to ourselves, and then, as a ripple effect, to others, which helps us let go of unhappy feelings we may be experiencing.",
    "Similar to the loving kindness meditation technique, this one involves focusing on a person you know or love and paying attention to the sensations arising from the heart. By opening our hearts and minds for the benefit of other people, we have the opportunity to foster a feeling of happiness in our own mind.",
    "Rather than focusing on the breath or a visualization, this technique involves letting the mind truly rest; thoughts may enter, but instead of distracting you and pulling you away from the present moment, they simply drift away.",
    "This technique invites you to ask yourself a question: perhaps something such as, “What are you most grateful for?” (Note that asking yourself a question using the second person — you — will discourage the intellectual mind from trying to answer it rationally.) Be aware of the feelings, not the thoughts, that arise when you focus on the question.",
    "This ancient Buddhist tradition involves sitting upright and following the breath, particularly the way it moves in and out of the belly, and letting the mind “just be.” Its aim is to foster a sense of presence and alertness.",
    "This technique is similar to focused attention meditation, although instead of focusing on the breath to quiet the mind, you focus on a mantra (which could be a syllable, word, or phrase). The idea here is that the subtle vibrations associated with the repeated mantra can encourage positive change — maybe a boost in self-confidence or increased compassion for others — and help you enter an even deeper state of meditation.",
    "The practice involves sitting comfortably with one’s eyes closed for 20 minutes twice per day and engaging in the effortless practice as instructed. Students are encouraged to practice twice a day, which often includes morning meditation, and the a second session is in the mid-afternoon or early evening.",
    "Just as there are many different types of meditation, so too exist many styles of yoga — particularly Kundalini yoga — that are aimed at strengthening the nervous system, so we are better able to cope with everyday stress and problems. However, in order to integrate the neuromuscular changes that happen during yoga and gain the greatest benefit from the practice, we must take time for savasana or Shavasana, known as corpse or relaxation pose, to relax the body and relieve tension.",
    "Another ancient tradition, this one invites you to use your concentration to intensely examine certain aspects of your existence with the intention of eventual transformation. Vipassana pushes us to find insight into the true nature of reality, via contemplation of several key areas of human existence: suffering, unsatisfactoriness, impermanence, non-self, and emptiness.",
    "This meditation technique is aimed at keeping the body’s core chakras — centers of energy — open, aligned, and fluid. Blocked or imbalanced chakras can result in uncomfortable physical and mental symptoms, but chakra meditation can help to bring all of them back into balance.",
    "This is an ancient and powerful Chinese practice that involves harnessing energy in the body by allowing energy pathways — called “meridians” — to be open and fluid. Sending this energy inward during meditation is thought to help the body heal and function; sending the energy outward can help to heal another person.",
    "This form uses bowls, gongs, and other instruments to create sound vibrations that help focus the mind and bring it into a more relaxed state."
  ]

  const handleUserTimeInputChange = (text) => {
    setUserTimeInput(text);
  };

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const handleHeaderPress = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [sound])
  );

  useEffect(() => {
    let interval;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            playSound();
            setTimerActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      playSound();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleSetTime = () => {
    const timeInMinutes = parseInt(userTimeInput);
    if (!isNaN(timeInMinutes)) {
      setTimerSeconds(timeInMinutes * 60);
      setUserTimeInput('');
      startTimer();
    }
  };

  const startTimer = () => {
    const timeInSeconds = parseInt(userTimeInput) * 60;
    setTimerActive(true);
    setTimerSeconds(timeInSeconds);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/alarm.mp3')
    );
    await sound.playAsync();
  };

  const play = async () => {
    if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
      console.error('Invalid track index:', currentTrackIndex);
      return;
    }

    const selectedTrack = tracks[currentTrackIndex];
    if (!selectedTrack || !selectedTrack.file) {
      console.error('Invalid or missing track:', selectedTrack);
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(selectedTrack.file);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const skipToPreviousTrack = () => {
    const previousIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(previousIndex);
  };

  const skipToNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const renderHeader = (title, content, index) => (
    <TouchableOpacity key={index} onPress={() => handleHeaderPress(index)} style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      {expandedIndex === index && (
        <View style={styles.content}>
          <Text>{content}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => handleTabPress('Exercises')}
          style={[styles.tabButton, selectedTab === 'Exercises' && styles.activeTab]}
        >
          <Text style={styles.tabButtonText}>Exercises</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('Timer')}
          style={[styles.tabButton, selectedTab === 'Timer' && styles.activeTab]}
        >
          <Text style={styles.tabButtonText}>Timer</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Exercises' ? (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {headers.map((header, index) => renderHeader(header, content[index], index))}
          <Text style={styles.referenceText}>Reference: https://www.headspace.com/meditation/techniques</Text>
        </ScrollView>
      ) : (
        <View style={styles.timerInputContainer}>
          <TextInput
            style={styles.timerInput}
            placeholder="Enter time in minutes"
            keyboardType="numeric"
            value={userTimeInput}
            onChangeText={handleUserTimeInputChange}
          />
          <TouchableOpacity onPress={handleSetTime} style={styles.setTimerButton}>
            <Text style={styles.setTimerButtonText}>Set Time</Text>
          </TouchableOpacity>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
              {(timerSeconds % 60).toString().padStart(2, '0')}
            </Text>
            {timerActive && (
              <TouchableOpacity onPress={stopTimer} style={styles.setTimerButton}>
                <Text style={styles.setTimerButtonText}>Stop Timer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      <View style={styles.musicDisplay}>
        {tracks[currentTrackIndex] ? (
          <Text style={styles.currentTrackText}>
            Current Track: {tracks[currentTrackIndex] ? tracks[currentTrackIndex].name : 'No track selected'}
          </Text>
        ) : (
          <Text style={styles.currentTrackText}>No track selected</Text>
        )}
        <View style={styles.controlButtons}>
          <TouchableOpacity onPress={skipToPreviousTrack} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Previous Track</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={play} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pause} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNextTrack} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Next Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4B0082',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9370DB',
    borderColor: '#4B0082',
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: '#3E006A',
  },
  tabButtonText: {
    fontSize: 16,
    color: 'white',
  },
  contentContainer: {
    padding: 10,
  },
  header: {
    backgroundColor: '#9370DB',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 10,
    backgroundColor: '#E6E6FA',
    borderRadius: 8,
    marginTop: 5,
  },
  referenceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'purple',
  },
  timerInputContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerInput: {
    borderWidth: 1,
    borderColor: '#4B0082',
    borderRadius: 8,
    padding: 8,
    width: 200,
    textAlign: 'center',
  },
  setTimerButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#9370DB',
    borderRadius: 8,
  },
  setTimerButtonText: {
    fontSize: 16,
    color: 'white',
  },
  timerDisplay: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#9370DB',
    borderRadius: 8,
  },
  controlButtonText: {
    fontSize: 16,
    color: 'white',
  },
  currentTrackText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  musicDisplay: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#4B0082',
  },
});

export default MeditationScreen;

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImg}
            />
          </View>
          <Text style={styles.headerTitle}>Hoyo Piloting</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 16 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>Select a game to start your piloting service.</Text>
        </View>

        {/* Game List */}
        <View style={styles.gameList}>
          {/* Genshin Impact */}
          <TouchableOpacity 
            style={styles.gameCard} 
            onPress={() => router.push('/genshin')}
            activeOpacity={0.9}
          >
            <View style={styles.cardImageContainer}>
              <Image 
                source={require('../../assets/images/genshin.png')}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <View style={styles.cardGradient} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardCategory}>Open World RPG</Text>
              <Text style={styles.cardTitle}>Genshin Impact</Text>
            </View>
          </TouchableOpacity>

          {/* Honkai Star Rail */}
          <TouchableOpacity 
            style={styles.gameCard} 
            onPress={() => router.push('/hsr')}
            activeOpacity={0.9}
          >
            <View style={styles.cardImageContainer}>
              <Image 
                source={require('../../assets/images/hsr.png')}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <View style={styles.cardGradient} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardCategory, { color: '#C084FC' }]}>Turn-Based Strategy</Text>
              <Text style={styles.cardTitle}>Honkai Star Rail</Text>
            </View>
          </TouchableOpacity>

          {/* Zenless Zone Zero */}
          <TouchableOpacity 
            style={styles.gameCard} 
            onPress={() => router.push('/zzz')}
            activeOpacity={0.9}
          >
            <View style={styles.cardImageContainer}>
              <Image 
                source={require('../../assets/images/zzz.png')}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <View style={styles.cardGradient} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardCategory, { color: '#FACC15' }]}>Action RPG</Text>
              <Text style={styles.cardTitle}>Zenless Zone Zero</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171D',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A38141',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#A38141',
  },
  logoImg: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  menuBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  welcomeSection: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  gameList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gameCard: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E1E',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60A5FA',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

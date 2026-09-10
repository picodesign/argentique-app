import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
import CameraScreen from './components/CameraScreen';
import RollScreen from './components/RollScreen';
import { addPhotoToRoll, loadRoll, remainingShots, type Roll } from './lib/roll';
import { colors } from './theme';

type Screen = 'camera' | 'roll';

export default function App() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const [roll, setRoll] = useState<Roll | null>(null);
  const [screen, setScreen] = useState<Screen>('camera');

  useEffect(() => {
    loadRoll().then(setRoll);
  }, []);

  if (!roll) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.ink} />
      </View>
    );
  }

  const handleCapture = async (uri: string) => {
    const updated = await addPhotoToRoll(roll, uri);
    setRoll(updated);
  };

  return (
    <View style={styles.container}>
      {screen === 'camera' ? (
        <CameraScreen
          remaining={remainingShots(roll)}
          rollNumber={roll.rollNumber}
          onCapture={handleCapture}
          onOpenRoll={() => setScreen('roll')}
        />
      ) : (
        <RollScreen roll={roll} onClose={() => setScreen('camera')} />
      )}
      <StatusBar style={screen === 'roll' && !isDark ? 'dark' : 'light'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import { checkHealth } from "../../api/connection.js";

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotesScreen() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
     checkHealth().then((data: any) => {
       setHealth(data.ok);
     });
  }, []);

  return (
    <ThemedView style={styles.headContainer}>
      <ThemedView style={styles.quoteContainer}>
        <ThemedText style={{ padding: 10, fontSize: 24 }} type="title">
          "The best way to predict the future is to invent it."
        </ThemedText>
      </ThemedView>
    
      <ThemedView style={styles.healthContainer}>
        <ThemedText style={{ padding: 10, fontSize: 18 }}>
          API Health Check: Testing...
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20, 
    paddingVertical: 40,
  },
  quoteContainer: {
    flex: 1,
    backgroundColor: '#C9B9F4',
  },
  healthContainer: {
    flex: 1,
    backgroundColor: '#B4E4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
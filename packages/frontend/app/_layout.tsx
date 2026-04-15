import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDb } from '@/db/schema';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="bcr.db" onInit={migrateDb}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
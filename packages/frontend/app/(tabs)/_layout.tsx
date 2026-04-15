import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9B8FD9',
        headerStyle: {
          backgroundColor: '#9B8FD9',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Головна',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />

      <Tabs.Screen
        name="notesList"
        options={{
          title: 'Нотатки',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📝</Text>,
        }}
      />

      <Tabs.Screen
        name="summaryList"
        options={{
          title: 'Підсумки',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📈</Text>,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профіль',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}

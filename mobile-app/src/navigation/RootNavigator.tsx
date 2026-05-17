import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import Splash from '../screens/auth/Splash';
import Welcome from '../screens/auth/Welcome';
import Auth from '../screens/auth/Auth';

import Home from '../screens/app/Home';
import Modules from '../screens/app/Modules';
import ModuleDetail from '../screens/app/ModuleDetail';
import LessonReader from '../screens/app/LessonReader';
import LessonCode from '../screens/app/LessonCode';
import Bookmarks from '../screens/app/Bookmarks';
import AIChat from '../screens/app/AIChat';
import Profile from '../screens/app/Profile';
import Settings from '../screens/app/Settings';

import TabBar from '../components/TabBar';
import { useAuth } from '../context/AuthContext';
import {
  AuthStackParamList,
  ExploreStackParamList,
  HomeStackParamList,
  ProgressStackParamList,
  ChatStackParamList,
  ProfileStackParamList,
  AppTabParamList,
  RootStackParamList,
} from './types';
import { colors } from '../theme/tokens';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProgressStack = createNativeStackNavigator<ProgressStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tabs = createBottomTabNavigator<AppTabParamList>();

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.splashBg } }}>
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen name="Auth" component={Auth} />
    </AuthStack.Navigator>
  );
}

function HomeTab() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={Home} />
    </HomeStack.Navigator>
  );
}

function ExploreTab() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Modules" component={Modules} />
      <ExploreStack.Screen name="ModuleDetail" component={ModuleDetail} />
      <ExploreStack.Screen name="LessonReader" component={LessonReader} />
      <ExploreStack.Screen name="LessonCode" component={LessonCode} />
    </ExploreStack.Navigator>
  );
}

function ProgressTab() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="Bookmarks" component={Bookmarks} />
    </ProgressStack.Navigator>
  );
}

function ChatTab() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="AIChat" component={AIChat} />
    </ChatStack.Navigator>
  );
}

function ProfileTab() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="Settings" component={Settings} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="Home" component={HomeTab} />
      <Tabs.Screen name="Explore" component={ExploreTab} />
      <Tabs.Screen name="Progress" component={ProgressTab} />
      <Tabs.Screen name="Chat" component={ChatTab} />
      <Tabs.Screen name="Profile" component={ProfileTab} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isGuest, hydrated } = useAuth();
  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.splashBg }} />;
  const authed = !!user || isGuest;
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authed ? (
          <RootStack.Screen name="App" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthFlow} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

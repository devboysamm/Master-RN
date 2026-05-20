import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import Splash from '../screens/auth/Splash';
import Welcome from '../screens/auth/Welcome';
import Auth from '../screens/auth/Auth';
import VerifyOtp from '../screens/auth/VerifyOtp';
import Forgot from '../screens/auth/Forgot';

import Home from '../screens/app/Home';
import Modules from '../screens/app/Modules';
import ModuleDetail from '../screens/app/ModuleDetail';
import LessonReader from '../screens/app/LessonReader';
import Bookmarks from '../screens/app/Bookmarks';
import AIChat from '../screens/app/AIChat';
import Profile from '../screens/app/Profile';
import HelpFeedback from '../screens/app/HelpFeedback';
import About from '../screens/app/About';
import Notifications from '../screens/app/Notifications';
import Cheatsheets from '../screens/app/Cheatsheets';
import CheatsheetDetail from '../screens/app/CheatsheetDetail';
import ReportProblem from '../screens/app/ReportProblem';
import EditProfile from '../screens/app/EditProfile';

import TabBar from '../components/TabBar';
import { useAuth } from '../context/AuthContext';
import { useTabHistory } from '../context/TabHistoryContext';
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

function AuthFlow({
  pendingAuthMode,
  pendingReturnTab,
}: {
  pendingAuthMode: 'signin' | 'signup' | null;
  pendingReturnTab: 'Home' | 'Explore' | 'Progress' | 'Chat' | 'Profile' | null;
}) {
  // When a guest taps "Sign in" / "Create account" from inside the app,
  // skip Splash + Welcome and open the Auth screen on the matching tab.
  const initialRouteName = pendingAuthMode ? 'Auth' : 'Splash';
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.splashBg } }}>
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen
        name="Auth"
        component={Auth}
        initialParams={
          pendingAuthMode
            ? { mode: pendingAuthMode, returnTo: pendingReturnTab ?? undefined }
            : undefined
        }
      />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtp} />
      <AuthStack.Screen name="Forgot" component={Forgot} />
    </AuthStack.Navigator>
  );
}

const stackOptions = { headerShown: false } as const;

function HomeTab() {
  return (
    <HomeStack.Navigator screenOptions={stackOptions}>
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="ModuleDetail" component={ModuleDetail} />
      <HomeStack.Screen name="LessonReader" component={LessonReader} />
      {/* Right-side slide-in feel: native-stack default push animation. */}
      <HomeStack.Screen name="Notifications"  component={Notifications}  options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="Cheatsheets"      component={Cheatsheets}      options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="CheatsheetDetail" component={CheatsheetDetail} options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="ReportProblem"  component={ReportProblem}  options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="HelpFeedback"   component={HelpFeedback}   options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="About"          component={About}          options={{ animation: 'slide_from_right' }} />
    </HomeStack.Navigator>
  );
}

function ExploreTab() {
  return (
    <ExploreStack.Navigator screenOptions={stackOptions}>
      <ExploreStack.Screen name="Modules" component={Modules} />
      <ExploreStack.Screen name="ModuleDetail" component={ModuleDetail} />
      <ExploreStack.Screen name="LessonReader" component={LessonReader} />
    </ExploreStack.Navigator>
  );
}

function ProgressTab() {
  return (
    <ProgressStack.Navigator screenOptions={stackOptions}>
      <ProgressStack.Screen name="Bookmarks" component={Bookmarks} />
      <ProgressStack.Screen name="ModuleDetail" component={ModuleDetail} />
      <ProgressStack.Screen name="LessonReader" component={LessonReader} />
    </ProgressStack.Navigator>
  );
}

function ChatTab() {
  return (
    <ChatStack.Navigator screenOptions={stackOptions}>
      <ChatStack.Screen name="AIChat" component={AIChat} />
    </ChatStack.Navigator>
  );
}

function ProfileTab() {
  return (
    <ProfileStack.Navigator screenOptions={stackOptions}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="HelpFeedback" component={HelpFeedback} />
      <ProfileStack.Screen name="About" component={About} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} options={{ animation: 'slide_from_right' }} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  const { pendingReturnTab, clearPendingReturnTab } = useAuth();
  const { setPreviousTab } = useTabHistory();
  // If the user just bailed out of AuthFlow (cancelled or finished), land
  // back on the tab they came from — read it once at mount, then clear.
  const initialRouteName = (pendingReturnTab ?? 'Home') as keyof AppTabParamList;
  useEffect(() => {
    if (pendingReturnTab) clearPendingReturnTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Tabs.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
      tabBar={(props) => <TabBar {...props} />}
      // Record the previously-focused tab on every tab press so screens
      // like AIChat / LessonReader can route their back button to it.
      screenListeners={({ navigation }) => ({
        tabPress: (e) => {
          // e.target = "TabName-<key>". Strip the suffix for the route name.
          const next = (e.target || '').split('-')[0];
          const state = navigation.getState();
          const current = state?.routes?.[state.index]?.name as string | undefined;
          if (current && current !== next) {
            setPreviousTab(current as never);
          }
        },
      })}>
      <Tabs.Screen name="Home" component={HomeTab} />
      <Tabs.Screen name="Explore" component={ExploreTab} />
      <Tabs.Screen name="Progress" component={ProgressTab} />
      <Tabs.Screen name="Chat" component={ChatTab} />
      <Tabs.Screen name="Profile" component={ProfileTab} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isGuest, hydrated, pendingAuthMode, pendingReturnTab } = useAuth();
  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.splashBg }} />;
  const authed = !!user || isGuest;
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authed ? (
          <RootStack.Screen name="App" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Auth">
            {() => (
              <AuthFlow
                pendingAuthMode={pendingAuthMode}
                pendingReturnTab={pendingReturnTab}
              />
            )}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

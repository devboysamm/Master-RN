import React, { useEffect, useRef } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
  type Theme,
} from '@react-navigation/native';
import * as ExpoNotifications from 'expo-notifications';
import { registerForPush } from '../lib/push';
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
  const initialRouteName = pendingAuthMode ? 'AuthMain' : 'Splash';
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.splashBg } }}>
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen
        name="AuthMain"
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

// Safety net: paint every navigation surface (container + card backgrounds)
// in the app's cream rather than the default white. If a scene ever fails to
// lay out / render content, the user sees the branded cream background — never
// a stark "white screen of death" that looks like a hard crash.
const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.cream, card: colors.cream },
};

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
      <ProfileStack.Screen name="ProfileMain" component={Profile} />
      <ProfileStack.Screen name="HelpFeedback" component={HelpFeedback} />
      <ProfileStack.Screen name="About" component={About} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} options={{ animation: 'slide_from_right' }} />
      <ProfileStack.Screen name="ReportProblem" component={ReportProblem} options={{ animation: 'slide_from_right' }} />
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
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
        // NOTE: we deliberately do NOT set `animation: 'shift'` here. The
        // animated scene transition could race the tab-bar show/hide
        // re-layout (AIChat / LessonReader toggle the parent's tabBarStyle on
        // focus) and occasionally leave a scene settled offscreen → an
        // intermittent blank/white screen on tab switches with no JS error.
        // A plain (non-animated) tab switch lays out deterministically.
      }}
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

// Bridges expo-notifications into the app: registers the Expo push token once
// per session for a signed-in user (guests are skipped), and opens the bell
// screen when a notification is tapped. Renders nothing.
function PushBridge({
  navigationRef,
}: {
  navigationRef: ReturnType<typeof useNavigationContainerRef<RootStackParamList>>;
}) {
  const { user, token } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    if (user && token) {
      if (!registered.current) {
        registered.current = true;
        // Best-effort; never blocks or crashes (handles denial/simulator).
        registerForPush(token);
      }
    } else {
      // Reset so a fresh sign-in re-registers.
      registered.current = false;
    }
  }, [user, token]);

  useEffect(() => {
    const sub = ExpoNotifications.addNotificationResponseReceivedListener(() => {
      if (!navigationRef.isReady()) return;
      try {
        // Open the bell screen (App → Home tab → Notifications). Cast the
        // navigate fn since nested params aren't expressible on the typed ref.
        const navigate = navigationRef.navigate as unknown as (
          name: string,
          params?: Record<string, unknown>,
        ) => void;
        navigate('App', { screen: 'Home', params: { screen: 'Notifications' } });
      } catch (e) {
        console.log('[push] could not open Notifications on tap:', e);
      }
    });
    return () => sub.remove();
  }, [navigationRef]);

  return null;
}

export default function RootNavigator() {
  const { user, isGuest, hydrated, pendingAuthMode, pendingReturnTab } = useAuth();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.splashBg }} />;
  const authed = !!user || isGuest;
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navTheme}
      // Surface silently-dropped navigation actions (e.g. navigate() to a
      // route name no navigator can handle). React Navigation otherwise
      // no-ops these — which can look like a blank screen with no error.
      onUnhandledAction={(action) => {
        console.warn(
          '[nav] unhandled navigation action (route may not exist):',
          JSON.stringify(action),
        );
      }}>
      <PushBridge navigationRef={navigationRef} />
      <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
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

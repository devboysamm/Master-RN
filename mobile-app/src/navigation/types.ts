export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: { mode?: 'signup' | 'signin'; returnTo?: AppTabName } | undefined;
  Forgot: undefined;
};

export type AppTabName = 'Home' | 'Explore' | 'Progress' | 'Chat' | 'Profile';

export type ContentRoutes = {
  ModuleDetail: { moduleId: number };
  LessonReader: { lessonId: number; moduleId?: number };
  LessonCode: { lessonId: number };
};

export type ExploreStackParamList = ContentRoutes & {
  Modules: undefined;
};

export type HomeStackParamList = ContentRoutes & {
  HomeMain: undefined;
};

export type ProgressStackParamList = ContentRoutes & {
  Bookmarks: undefined;
};

export type ChatStackParamList = {
  AIChat: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  HelpFeedback: undefined;
  About: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Explore: undefined;
  Progress: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

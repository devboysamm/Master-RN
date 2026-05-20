export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: { mode?: 'signup' | 'signin'; returnTo?: AppTabName } | undefined;
  VerifyOtp: { email: string; name: string; password: string };
  Forgot: undefined;
};

export type AppTabName = 'Home' | 'Explore' | 'Progress' | 'Chat' | 'Profile';

export type ContentRoutes = {
  ModuleDetail: { moduleId: number };
  LessonReader: { lessonId: number; moduleId?: number };
};

export type ExploreStackParamList = ContentRoutes & {
  Modules: undefined;
};

export type HomeStackParamList = ContentRoutes & {
  HomeMain: undefined;
  Notifications: undefined;
  Cheatsheets: undefined;
  CheatsheetDetail: { id: string };
  ReportProblem: undefined;
  HelpFeedback: undefined;
  About: undefined;
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
  EditProfile: undefined;
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

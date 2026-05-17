export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
};

export type ExploreStackParamList = {
  Modules: undefined;
  ModuleDetail: { moduleId: number };
  LessonReader: { lessonId: number; moduleId?: number };
  LessonCode: { lessonId: number };
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type ProgressStackParamList = {
  Bookmarks: undefined;
};

export type ChatStackParamList = {
  AIChat: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
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

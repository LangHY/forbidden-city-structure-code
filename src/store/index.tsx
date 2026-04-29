/**
 * 全局状态管理 - Context + useReducer
 *
 * 管理应用加载状态和 UI 状态
 */

import { createContext, useContext, useReducer, type ReactNode } from 'react';

// ========================================
// 类型定义
// ========================================

interface OpeningState {
  isLoading: boolean;
  loadProgress: number;
  phase: 'loading' | 'burst' | 'fadein' | 'complete';
}

interface UIState {
  isNavbarVisible: boolean;
  isScrollHintVisible: boolean;
}

interface AppState {
  opening: OpeningState;
  ui: UIState;
}

type AppAction =
  | { type: 'SET_LOAD_PROGRESS'; payload: number }
  | { type: 'COMPLETE_LOADING' }
  | { type: 'UPDATE_UI'; payload: Partial<UIState> };

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// ========================================
// 初始状态
// ========================================

const initialState: AppState = {
  opening: {
    isLoading: true,
    loadProgress: 0,
    phase: 'loading',
  },
  ui: {
    isNavbarVisible: false,
    isScrollHintVisible: true,
  },
};

// ========================================
// Reducer
// ========================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOAD_PROGRESS':
      return {
        ...state,
        opening: {
          ...state.opening,
          loadProgress: action.payload,
        },
      };
    case 'COMPLETE_LOADING':
      return {
        ...state,
        opening: {
          ...state.opening,
          isLoading: false,
          phase: 'complete',
        },
      };
    case 'UPDATE_UI':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

// ========================================
// Context
// ========================================

const AppContext = createContext<AppContextValue | null>(null);

// ========================================
// Provider
// ========================================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ========================================
// Hooks
// ========================================

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

export function useUIState() {
  const { state } = useAppState();
  return state.ui;
}

export function useOpeningState() {
  const { state } = useAppState();
  return state.opening;
}

/**
 * AIChatWidget - AI 聊天悬浮组件
 *
 * 主组件，管理展开/收起状态
 * 使用底部液态玻璃胶囊横条设计
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatBar from './ChatBar';
import ChatWindow from './ChatWindow';
import type { ThemeMode } from '@/components/exhibition/types';

interface AIChatWidgetProps {
  theme: ThemeMode;
}

export default function AIChatWidget({ theme }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <ChatWindow
          key="window"
          theme={theme}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <ChatBar
          key="bar"
          theme={theme}
          onClick={() => setIsOpen(true)}
        />
      )}
    </AnimatePresence>
  );
}
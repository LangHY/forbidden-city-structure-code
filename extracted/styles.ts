/**
 * ===========================================
 * CSS样式变量提取 (Extracted CSS Variables)
 * ===========================================
 *
 * 从 opening.html <style> 标签提取的核心样式
 * 使用 CSS-in-JS 风格，便于 React 组件使用
 */

/**
 * 根变量 (CSS Variables)
 */
export const cssVariables = `
:root {
  --bg-color: #faf9f7;
  --accent-color: #1a1a1a;
  --primary-color: #b91c1c;
  --secondary-color: #78716c;
  --accent-glow: rgba(185, 28, 28, 0.1);
  --light-accent: #f5f5f4;
  --text-muted: #78716c;
  --gold-accent: #b91c1c;
  --dark-blue: #1e3a5f;
  --img-h: 70vh;
  --img-w: 50vh;
  --gap: 3vh;
}
`;

/**
 * 基础样式 (Base Styles)
 */
export const baseStyles = {
  html: {
    overflow: 'auto',
    scrollbarWidth: 'none',
  },
  body: {
    backgroundColor: '#faf9f7',
    color: '#1a1a1a',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    margin: 0,
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
  },
  grain: {
    position: 'fixed',
    inset: '-50%',
    height: '200%',
    width: '200%',
    backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
    opacity: 0.04,
    pointerEvents: 'none',
    zIndex: 500,
  },
  flash: {
    position: 'fixed',
    inset: 0,
    background: '#fff',
    opacity: 0,
    zIndex: 200,
    pointerEvents: 'none',
  },
};

/**
 * 加载器样式 (Loader Styles)
 */
export const loaderStyles = {
  container: {
    position: 'fixed',
    top: '8vh',
    left: '5vw',
    zIndex: 100,
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    pointerEvents: 'none',
  },
  progressNum: {
    fontSize: '8rem',
    fontWeight: 700,
    fontStyle: 'normal' as const,
    lineHeight: 0.8,
    display: 'block',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.05em',
    opacity: 0.08,
    color: '#1a1a1a',
    textShadow: 'none',
  },
  progressBar: {
    height: '2px',
    width: '12rem',
    backgroundColor: '#292524',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
  },
  loaderTag: {
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    color: '#78716c',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
    opacity: 0.4,
  },
};

/**
 * UI层样式 (UI Layer Styles)
 */
export const uiLayerStyles = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    paddingTop: '25vh',
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  quoteContainer: {
    marginTop: '1rem',
    opacity: 0,
  },
  quoteText: {
    letterSpacing: '0.2em',
    fontSize: '1.25rem',
    opacity: 0.8,
    fontWeight: 300,
    fontFamily: "'Noto Serif SC', serif",
    textShadow: '0 2px 10px rgba(255,255,255,0.5)',
  },
};

/**
 * AI按钮样式 (AI Panel Styles)
 */
export const aiPanelStyles = {
  container: {
    position: 'fixed',
    bottom: '5vh',
    right: '5vw',
    zIndex: 150,
    opacity: 0,
    textAlign: 'right',
  },
  button: {
    position: 'relative' as const,
    padding: '12px 32px',
    borderRadius: '50px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: `
      0 8px 32px 0 rgba(31, 38, 135, 0.07),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 2px 10px rgba(255, 255, 255, 0.3)
    `,
    color: '#1a1a1a',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  },
  buttonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: `
      0 15px 35px rgba(185, 28, 28, 0.15),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
    color: '#b91c1c',
  },
};

/**
 * 滚动提示样式 (Scroll Hint Styles)
 */
export const scrollHintStyles = {
  container: {
    position: 'fixed',
    bottom: '4vh',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 300,
    opacity: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    pointerEvents: 'none',
  },
  text: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.65rem',
    letterSpacing: '0.4em',
    textTransform: 'uppercase' as const,
    opacity: 0.4,
    color: '#1a1a1a',
  },
  arrow: {
    width: '1px',
    height: '30px',
    background: 'rgba(26, 26, 26, 0.2)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
};

/**
 * Canvas样式 (Frame Canvas Styles)
 */
export const canvasStyles = {
  frameCanvas: {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 2,
    opacity: 0,
    pointerEvents: 'none',
  },
  whiteMask: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.75)',
    zIndex: 3,
    opacity: 0,
    pointerEvents: 'none',
    backdropFilter: 'blur(2px)',
  },
};

/**
 * 瀑布流窗口样式 (Waterfall Window Styles)
 */
export const waterfallStyles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'var(--img-w)',
    height: 'var(--img-h)',
    overflow: 'hidden',
    zIndex: 50,
  },
  reel: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--gap)',
  },
  reelImage: {
    width: 'var(--img-w)',
    height: 'var(--img-h)',
    objectFit: 'cover' as const,
    filter: 'grayscale(1) brightness(0.8)',
  },
};

/**
 * Dashboard样式 (Dashboard Styles)
 */
export const dashboardStyles = {
  section: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    background: 'transparent',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    pointerEvents: 'none',
  },
  sectionActive: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  frame: {
    width: '90vw',
    maxWidth: '1100px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    position: 'relative' as const,
  },
  bg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '400px',
    background: 'url("https://images.unsplash.com/photo-1584450150050-4b9bdb5be8a1?auto=format&fit=crop&w=1200&q=80") center/cover',
    borderRadius: '16px',
    opacity: 1,
    transition: 'opacity 0.5s ease',
  },
};

/**
 * 扑克牌卡片样式 (Poker Card Styles)
 */
export const cardStyles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    perspective: '1200px',
    transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative' as const,
    zIndex: 1,
  },
  wrapperSplitting: {
    gap: '3rem',
  },
  card: {
    width: '280px',
    height: '400px',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'stretch',
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer',
  },
  cardFlipped: {
    transform: 'rotateY(180deg)',
  },
  cardFace: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    background: 'linear-gradient(145deg, #faf9f7 0%, #f0eeeb 100%)',
    border: '1px solid rgba(139, 0, 0, 0.15)',
  },
  cardBack: {
    background: 'linear-gradient(145deg, #faf9f7 0%, #f5f4f3 100%)',
    border: '1px solid rgba(139, 0, 0, 0.15)',
    transform: 'rotateY(180deg)',
  },
  bigNum: {
    fontFamily: "'Ma Shan Zheng', cursive",
    fontSize: '10rem',
    color: '#1a1a1a',
    opacity: 0.15,
    lineHeight: 1,
  },
  title: {
    fontFamily: "'Ma Shan Zheng', cursive",
    fontSize: '2.2rem',
    color: '#1a1a1a',
    marginBottom: '0.3rem',
    letterSpacing: '0.1em',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#78716c',
    opacity: 0.6,
    marginBottom: '1rem',
  },
  divider: {
    width: '40px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #8b0000, transparent)',
    marginBottom: '1rem',
    opacity: 0.4,
  },
  desc: {
    fontFamily: "'Noto Serif SC', serif",
    fontSize: '0.75rem',
    lineHeight: 1.7,
    color: '#78716c',
    opacity: 0.8,
    maxWidth: '200px',
    textAlign: 'center' as const,
  },
  corner: {
    position: 'absolute' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    lineHeight: 1,
    zIndex: 2,
  },
  cornerTopLeft: {
    top: '16px',
    left: '16px',
  },
  cornerBottomRight: {
    bottom: '16px',
    right: '16px',
    transform: 'rotate(180deg)',
  },
  suit: {
    fontSize: '1.2rem',
    color: '#8b0000',
  },
};

/**
 * 导航栏样式 (Navbar Styles)
 */
export const navbarStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 200,
    opacity: 0,
    transform: 'translateY(-100%)',
    transition: 'all 0.4s ease',
    pointerEvents: 'none',
  },
  containerVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto',
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 5vw',
    background: 'transparent',
    backdropFilter: 'none',
    borderBottom: 'none',
  },
  title: {
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif",
    fontSize: '1.1rem',
    fontWeight: 300,
    letterSpacing: '0.25em',
    color: '#1a1a1a',
    transition: 'all 0.3s ease',
  },
  link: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: 'rgba(26, 26, 26, 0.8)',
    textDecoration: 'none',
    padding: '0.6rem 1.4rem',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  },
};

/**
 * Destination页面样式
 */
export const destinationStyles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    minHeight: '100vh',
    background: 'rgba(250, 249, 247, 0)',
    zIndex: 401,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.8s ease',
    marginTop: '-100vh',
  },
  containerVisible: {
    background: 'rgba(250, 249, 247, 0.95)',
  },
  inner: {
    textAlign: 'center' as const,
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'all 1s ease',
  },
  innerVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.2rem',
    letterSpacing: '0.5em',
    textTransform: 'uppercase' as const,
    color: '#78716c',
    opacity: 0.6,
  },
};

/**
 * 关键帧动画 (Keyframe Animations)
 */
export const keyframeAnimations = {
  noise: `
@keyframes noise {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-5%, -5%); }
  100% { transform: translate(5%, 5%); }
}
`,
  scrollArrow: `
@keyframes scrollArrow {
  0% { top: -100%; }
  50% { top: 100%; }
  100% { top: 100%; }
}
`,
  gentleFloat: `
@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`,
};

/**
 * 响应式断点 (Responsive Breakpoints)
 */
export const breakpoints = {
  mobile: '768px',
  small: '480px',
};

/**
 * 移动端卡片样式调整
 */
export const mobileCardStyles = {
  card: {
    width: '200px',
    height: '280px',
    borderRadius: 0,
  },
  cardFirst: {
    borderRadius: '12px 0 0 12px',
  },
  cardLast: {
    borderRadius: '0 12px 12px 12px',
  },
  title: {
    fontSize: '1.6rem',
  },
  subtitle: {
    fontSize: '0.5rem',
  },
  desc: {
    fontSize: '0.65rem',
    maxWidth: '160px',
  },
};

export const smallMobileCardStyles = {
  card: {
    width: '120px',
    height: '180px',
  },
  title: {
    fontSize: '1.2rem',
  },
  subtitle: {
    display: 'none',
  },
  desc: {
    fontSize: '0.55rem',
    maxWidth: '120px',
    lineHeight: 1.4,
  },
  corner: {
    display: 'none',
  },
};

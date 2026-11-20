export const Colors = {
  // Strict Visual Identity (as per reference image & specifications)
  primaryLime: '#C8F33A',
  brightLime: '#D9FF4D',
  lightLime: '#E9FF9C',
  darkForest: '#102000',
  deepGreen: '#172900',
  cardGreen: '#263D08',
  secondaryGreen: '#3D590A',
  textWhite: '#FFFFFF',
  mutedGreen: '#A9BD76',
  background: '#101C05',

  // Surfaces, Highlights & Borders
  surfaceDark: '#172900',
  surfaceCard: '#263D08',
  surfaceOverlay: 'rgba(38, 61, 8, 0.85)',
  surfaceHighlight: 'rgba(200, 243, 58, 0.15)',
  borderLime: 'rgba(200, 243, 58, 0.25)',
  borderDark: '#263D08',
  glowLime: 'rgba(217, 255, 77, 0.4)',
  badgeGreen: '#1D3306',
  badgeText: '#C8F33A',
  
  // Feedback Colors
  errorRed: '#FF4D4D',
  successGreen: '#C8F33A',
  warningYellow: '#FCD34D',
  infoLime: '#A9BD76',

  // Gradients
  gradients: {
    limeHeader: ['#D9FF4D', '#C8F33A'] as const,
    balanceCard: ['#D9FF4D', '#C8F33A', '#B7E823'] as const,
    forestBg: ['#101C05', '#102000', '#0B1502'] as const,
    cardDark: ['#263D08', '#172900'] as const,
    cardGlow: ['#2E4A0B', '#1D3306'] as const,
    buttonLime: ['#D9FF4D', '#C8F33A'] as const,
    navLime: ['#D9FF4D', '#C8F33A'] as const,
    cardLime: ['#C8F33A', '#D9FF4D', '#AEE620'] as const,
  },

  // Shadows
  shadows: {
    limeGlow: {
      shadowColor: '#C8F33A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 8,
    },
    darkSoft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
    },
    navFloating: {
      shadowColor: '#C8F33A',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.28,
      shadowRadius: 20,
      elevation: 14,
    },
  },
};

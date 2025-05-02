declare module 'react-native-card-stack-swiper' {
  import { ReactNode } from 'react';
  import { ViewStyle } from 'react-native';

  export interface CardStackProps {
    style?: ViewStyle;
    cardContainerStyle?: ViewStyle;
    renderNoMoreCards?: () => ReactNode;
    onSwipedLeft?: (index: number) => void;
    onSwipedRight?: (index: number) => void;
    onSwipe?: (event: any, gestureState: { dx: number; dy: number }) => void;
    onSwipeEnd?: () => void;
    disableTopSwipe?: boolean;
    disableBottomSwipe?: boolean;
    verticalSwipe?: boolean;
    stackSize?: number;
    swipeThreshold?: number;
    children?: ReactNode;
  }

  export class Card extends React.Component<{ children: ReactNode }> {}

  export default class CardStack extends React.Component<CardStackProps> {
    swipeLeft(): void;
    swipeRight(): void;
    goBackFromLeft(): void;
  }
} 
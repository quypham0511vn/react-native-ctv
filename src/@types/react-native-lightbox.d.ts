declare module 'react-native-lightbox' {
    import { Animated, StyleProp, ViewStyle } from 'react-native';
  
    interface LightboxProps {
      activeProps?: any
      renderHeader?: (close: () => void) => void
      renderContent?: () => void
      underlayColor?: string
      backgroundColor?: string
      didOpen?: () => void
      onOpen?: () => void
      willClose?: () => void
      onClose?: () => void
      springConfig?: Animated.SpringAnimationConfig['friction' | 'tension']
      swipeToDismiss?: boolean
      style?: StyleProp<ViewStyle>
      onLongPress?: (...args: any) => void
    }
  
    const Lightbox: React.FC<LightboxProps>;
  
    export default Lightbox;
  }
  
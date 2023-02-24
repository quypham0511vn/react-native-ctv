import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'transparent',
    shadowColor: '#333333',
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 1
  },
  svg: {
    backgroundColor: 'transparent',
    width: '200%',
    top: 0,
    position: 'absolute',
    zIndex: 1,
  },
  rowTab: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
  },
});

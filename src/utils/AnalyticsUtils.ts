// import analytics from '@react-native-firebase/analytics';

function trackEvent(event: string, param?: any) {
    if (param) {
        // analytics().logEvent(event, param);
    } else {
        // analytics().logEvent(event);
    }
}

function trackScreen(screen: any) {
    // analytics().logScreenView({ screen_class: screen, screen_name: screen });
}

export default {
    trackEvent,
    trackScreen
};

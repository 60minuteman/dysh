import { openBrowserAsync } from 'expo-web-browser';
import { Platform, TouchableOpacity, Text } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      // Open the link in an in-app browser on native.
      await openBrowserAsync(href);
    } else {
      // On web, open in new tab
      window.open(href, '_blank');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
}

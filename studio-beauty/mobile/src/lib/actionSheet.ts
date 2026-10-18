import { ActionSheetIOS, Alert, Platform } from 'react-native';

export interface SheetAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

/** Native action sheet on iOS, alert buttons elsewhere. */
export function showActionSheet(title: string, actions: SheetAction[], cancelLabel: string, message?: string) {
  if (Platform.OS === 'ios') {
    const destructiveButtonIndex = actions.map((a, i) => (a.destructive ? i : -1)).filter((i) => i >= 0);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: [...actions.map((a) => a.label), cancelLabel],
        cancelButtonIndex: actions.length,
        destructiveButtonIndex,
      },
      (i) => actions[i]?.onPress(),
    );
    return;
  }
  Alert.alert(title, message, [
    ...actions.map((a) => ({ text: a.label, onPress: a.onPress, style: a.destructive ? ('destructive' as const) : ('default' as const) })),
    { text: cancelLabel, style: 'cancel' as const },
  ]);
}

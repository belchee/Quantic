import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Icon, ListGroup, ListRow, Screen } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { setLanguage } from '@/features/language';
import { LANGUAGES } from '@/i18n';

export default function Language() {
  const { i18n } = useTranslation();
  const { session } = useAuth();
  return (
    <Screen>
      <ListGroup>
        {LANGUAGES.map((l, i) => (
          <ListRow
            key={l.code}
            label={l.label}
            chevron={false}
            last={i === LANGUAGES.length - 1}
            right={i18n.language === l.code ? <Icon name="check" size={18} color="primary" /> : undefined}
            onPress={() => {
              void setLanguage(l.code, session?.user.id);
              router.back();
            }}
          />
        ))}
      </ListGroup>
    </Screen>
  );
}

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { QuickContact } from '../../types';
import { Plus } from 'lucide-react-native';

interface ContactCarouselProps {
  contacts: QuickContact[];
  onAddContact?: () => void;
  onSelectContact: (contact: QuickContact) => void;
  onViewAll?: () => void;
}

export const ContactCarousel: React.FC<ContactCarouselProps> = ({
  contacts,
  onAddContact,
  onSelectContact,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Favourite Contacts</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View all &gt;</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {onAddContact && (
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={onAddContact}
          >
            <View style={styles.addCircle}>
              <Plus size={20} color={Colors.primaryLime} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        )}

        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            activeOpacity={0.8}
            onPress={() => onSelectContact(contact)}
          >
            <Image source={{ uri: contact.avatar }} style={styles.avatar} />
            <Text style={styles.contactName} numberOfLines={1}>
              {contact.name}
            </Text>
            <Text style={styles.contactSub}>{contact.accountMasked}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  addCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cardGreen,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    alignItems: 'center',
    width: 66,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
  },
  contactName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
    marginTop: 6,
  },
  contactSub: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 1,
  },
});

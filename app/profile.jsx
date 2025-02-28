import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { db, auth } from './config';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  router = useRouter();

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            console.log("✅ User detected:", currentUser.email);
            setUser(currentUser);
            fetchUserData(currentUser.uid);
        } 
        else {
            console.log("🚨 No user detected.");
            setLoading(false);
        }
        });
        return () => unsubscribe();
    }, []);

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="User Profile" titleStyle={styles.title} />
        <Card.Content>
          {userData ? (
            <View>
              <Text style={styles.label}>Race:</Text>
              <Text style={styles.value}>{userData.race || 'Not specified'}</Text>
              
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{userData.gender || 'Not specified'}</Text>

              <Text style={styles.label}>Birthdate:</Text>
              <Text style={styles.value}>{userData.birthdate ? new Date(userData.birthdate).toDateString() : 'Not specified'}</Text>

              <Text style={styles.label}>Dietary Preferences:</Text>
              <Text style={styles.value}>{
                userData.dietaryPreferences?.length > 0 
                  ? userData.dietaryPreferences.join(', ') 
                  : 'None'
              }</Text>

              <Text style={styles.label}>Allergies:</Text>
              <Text style={styles.value}>{
                userData.allergies?.length > 0 
                  ? userData.allergies.join(', ') 
                  : 'None'
              }</Text>
            </View>
          ) : (
            <Text>No data available</Text>
          )}
        </Card.Content>
        <Card.Actions>
            <Button mode="contained" onPress={() => router.push('/onboard')}>
                Edit Profile
            </Button>
        </Card.Actions>

      </Card>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

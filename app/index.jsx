import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { useRouter } from 'expo-router';
import { Button, TextInput, Card, Text } from 'react-native-paper';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import  { db, auth } from './config';



export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRegistered, setUserRegistered] = useState(true);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ User detected:", user.email);
  
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            console.log("✅ User data found, redirecting to Profile");
            router.replace('/profile');
          } else {
            console.log("🚨 No user data found, redirecting to Onboarding");
            router.replace('/onboard');
          }
        } catch (error) {
          console.error("🔥 Firestore Error:", error.message);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
    
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // ✅ Save an empty user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        race: "",
        gender: "",
        birthdate: null,
        dietaryPreferences: [],
        allergies: []
      });
  
      console.log("✅ New user created & Firestore initialized");
  
      router.replace('/onboard');
    } catch (error) {
      console.error('🔥 Sign Up Error:', error.message);
    }
  };
  

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("✅ User signed in:", user.email);
  
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        console.log("✅ User data found, redirecting to Profile");
        router.replace('/profile');
      } else {
        console.log("🚨 No user data found, redirecting to Onboarding");
        router.replace('/onboard');
      }
    } catch (error) {
      console.error('🔥 Sign In Error:', error.message);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={userRegistered ? 'Sign In' : 'Sign Up'} />
        <Card.Content>
          <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" mode="outlined" />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={userRegistered ? handleSignIn : handleSignUp} style={styles.button}>
            {userRegistered ? 'Sign In' : 'Sign Up'}
          </Button>
          <Text style={styles.toggleText} onPress={() => setUserRegistered(!userRegistered)}>
            {userRegistered ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </Card.Content>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 16,
  },
});

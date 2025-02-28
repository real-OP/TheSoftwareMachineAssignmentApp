import React, { useState } from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { Text, Button, TextInput, Card, Divider,Checkbox} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { DatePickerModal } from 'react-native-paper-dates';
import { registerTranslation, en } from 'react-native-paper-dates';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getAuth } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { db, auth } from './config'; 
import { useRouter } from 'expo-router';

// Register English locale
registerTranslation('en', en);


export default function OnboardProfile() {
    const [race, setRace] = useState('Caucasian (White)');
    const [gender, setGender] = useState('Male');
    const [birthdate, setBirthdate] = useState(null);
    const [open, setOpen] = useState(false);
    const router = useRouter(); // Define router inside the component

    registerTranslation('en', en);
    // Dietary Preferences
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    // Allergies
    const [allergies, setAllergies] = useState([]);

    // Toggle Selection
    const toggleDietary = (preference) => {
        setDietaryPreferences((prev) =>
            prev.includes(preference) ? prev.filter((item) => item !== preference) : [...prev, preference]
        );
    };
    const toggleAllergy = (allergy) => {
        setAllergies((prev) =>
            prev.includes(allergy) ? prev.filter((item) => item !== allergy) : [...prev, allergy]
        );
    };

    const handleSaveOnboarding = async () => {
        try{
            console.log("continue button pressed")
            const auth = getAuth();
            const user = auth.currentUser;
            if(!user){
                console.error('User not found');
                return;
            }
            const userData = {
                race,
                gender,
                birthdate: birthdate ? birthdate.toISOString() : null,
                dietaryPreferences,
                allergies,
            };
            console.log('Saving onboarding data:');
            await setDoc(doc(db, 'users', user.uid), userData);

            console.log('Onboarding data saved Successfully!');
            router.replace('/profile');

        }
        catch(error){
            console.error('Error saving onboarding data:', error.message);
        }
    }

    return (

        <View style={styles.container}>
            <ScrollView 
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            >
            
            <Card style={styles.card}>
                <Card.Title title="Tell Us About Yourself" titleStyle={styles.title} />
                <Card.Content>
                    
                    {/* Race Selection */}
                    <Text variant="titleMedium" style={styles.label}>Race</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={race}
                            onValueChange={(itemValue) => setRace(itemValue)}
                        >
                            <Picker.Item label="Caucasian (White)" value="Caucasian (White)" />
                            <Picker.Item label="African" value="African" />
                            <Picker.Item label="Asian" value="Asian" />
                            <Picker.Item label="Indigenous/Native" value="Indigenous/Native" />
                            <Picker.Item label="Latino/Hispanic" value="Latino/Hispanic" />
                            <Picker.Item label="Pacific Islander" value="Pacific Islander" />
                        </Picker>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Gender Selection */}
                    <Text variant="titleMedium" style={styles.label}>Gender</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={gender}
                            onValueChange={(itemValue) => setGender(itemValue)}
                        >
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Others" value="Others" />
                        </Picker>
                    </View>
                     {/* Birthdate Selection */}
                     <Text variant="titleMedium" style={styles.label}>Birthdate</Text>
                    <Button mode="outlined" onPress={() => setOpen(true)} style={styles.dateButton}>
                        {birthdate ? birthdate.toDateString() : 'Select Birthdate'}
                    </Button>

                    <DatePickerModal
                        locale="en"
                        mode="single"
                        visible={open}
                        onDismiss={() => setOpen(false)}
                        date={birthdate || new Date()} // ✅ Ensures a default date
                        onConfirm={(params) => {
                            setBirthdate(params.date);
                            setOpen(false);
                        }}
                    />

                     <Divider style={styles.divider} />

                    {/* Dietary Preferences */}
                    <Text variant="titleMedium" style={styles.label}>Dietary Preferences</Text>
                    {["Vegan", "Vegetarian", "Keto", "Halal"].map((option) => (
                        <Checkbox.Item
                            key={option}
                            label={option}
                            status={dietaryPreferences.includes(option) ? 'checked' : 'unchecked'}
                            onPress={() => toggleDietary(option)}
                        />
                    ))}

                    <Divider style={styles.divider} />

                    {/* Allergies */}
                    <Text variant="titleMedium" style={styles.label}>Allergies</Text>
                    {["Nuts", "Dairy", "Gluten"].map((option) => (
        
                        <Checkbox.Item
                            key={option}
                            label={option}
                            status={allergies.includes(option) ? 'checked' : 'unchecked'}
                            onPress={() => toggleAllergy(option)}
                        />
                        ))}

                    {/* Continue Button */}
                    <Button mode="contained" style={styles.button} onPress={handleSaveOnboarding}>
                        Continue
                    </Button>
                </Card.Content>
            </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    card: {
        padding: 10,
        borderRadius: 10,
        elevation: 3,  // Material UI shadow
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 10,
        fontWeight: '600',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 5,
    },
    divider: {
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
    }
});

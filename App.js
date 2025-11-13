import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { database } from './data/database';

const App = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const subscription = database.collections
      .get('notes')
      .query()
      .observe()
      .subscribe(notes => {
        setData(notes);
      });

    return () => subscription.unsubscribe();
  }, []);

  const saveDataOnLocal = async () => {
    if (!title.trim()) return;
    
    await database.write(async () => {
      await database.collections.get('notes').create(note => {
        note.title = title;
        note.desc = desc;
      });
    });

    setTitle('');
    setDesc('');
  };

  const deleteAllNotes = async () => {
    await database.write(async () => {
      const allNotes = await database.collections.get('notes').query().fetch();
      await Promise.all(allNotes.map(note => note.destroyPermanently()));
    });
  };

  const deleteNote = async (note) => {
    await database.write(async () => {
      await note.destroyPermanently();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardViewStyle}>
        <TextInput
          style={styles.textInputStyle}
          placeholder="Enter Title"
          value={title}
          onChangeText={txt => setTitle(txt)}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder="Enter Title"
          value={desc}
          onChangeText={txt => setDesc(txt)}
        />

        <TouchableOpacity
          style={[styles.filledButtonStyle]}
          onPress={saveDataOnLocal}
        >
          <Text style={[styles.actionButtonTextStyle, { color: 'white' }]}>
            Add Note
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButtonStyle} onPress={deleteAllNotes}>
          <Text style={styles.actionButtonTextStyle}>Remove All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Title: {item.title}</Text>
                <Text style={styles.itemDesc}>Description: {item.desc}</Text>
              </View>

              <TouchableOpacity onPress={() => deleteNote(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.addButtonStyle}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'purple',
    position: 'absolute',
    alignSelf: 'center',
    height: 60,
    width: '90%',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  cardViewStyle: {
    padding: 20,
    // On Android, shadow* styles are ignored. You have to use elevation for shadow.
    elevation: 4, // Added for Android shadow support
    // The "shadowColor" and related styles only work on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowOffset: {
      height: 9,
    },

    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    gap: 10,
  },
  textInputStyle: {
    borderRadius: 10,
    borderColor: '#f2f',
    borderWidth: 1,
    paddingHorizontal: 10,
  },

  filledButtonStyle: {
    backgroundColor: 'purple',
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  outlineButtonStyle: {
    borderColor: 'purple',
    borderWidth: 1,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonTextStyle: {
    fontSize: 17,
    fontWeight: '500',
  },
  itemContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
  },
  deleteText: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 14,
  },
});

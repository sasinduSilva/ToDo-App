

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import {SafeAreaView,StyleSheet, View,Text, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
const COLORS = {primary: '#1f145c', white: '#fff'};

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


const App = () => {
  const [todos,setTodos] = useState([]);
  const [textInput,setTextInput] = useState("");

  

  useEffect(()=>{
    getTodosFromUserDeveice();
  },[]);



  const ListItem = ({todo}) => {
    return (<View style={styles.listItem}>
          <View style={{flex:1}}>
            <Text style={{fontWeight:'bold', fontSize:15, color:COLORS.primary, textDecorationLine: todo?.completed?"line-through":"none"}}>
              {todo?.task}
            </Text>
          </View>
          {!todo?.completed && (<TouchableOpacity style={[styles.actionIcon]} onPress={()=>markTodoComplete(todo?.id)}>
            <Icon name='done' size={20} color={COLORS.white}/>
          </TouchableOpacity>)}
          <TouchableOpacity style={[styles.actionIcon, {backgroundColor:'red'}]} onPress={()=>deleteTodo(todo?.id)}>
            <Icon name='delete' size={20} color={COLORS.white}/>
          </TouchableOpacity>
    </View>);
  }

  const addTodo = async() => {
    if(textInput != ""){
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos,newTodo]);
      removeItemFromSecureStore();
      saveTodoTouserDevice([...todos,newTodo]);
      setTextInput("");
      
    }else{
      alert('Please type your task');
    }

  };

  const markTodoComplete = (todoId) =>{
    const newTodos = todos.map(item=>{
      if(item.id == todoId){
        return {...item,completed:true};
      }
      return item;
    });

    setTodos(newTodos);
    removeItemFromSecureStore();
    saveTodoTouserDevice(newTodos);
  }

  const deleteTodo = (todoId) =>{
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
    removeItemFromSecureStore();
    saveTodoTouserDevice(newTodos);
  }

  const clearAllTodos = () =>{
    Alert.alert(
      "CONFIRM!",
      "Are you sure you want to delete all your todos?",
      [
        {
          text: "Cancel",
          
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => removeAlltodos()
        }
      ]
    );
  }

  const saveTodoTouserDevice = async todosItems => {
    try {
      const stringifyTodos = JSON.stringify(todosItems);
      await AsyncStorage.setItem('todos', stringifyTodos);
      
    } catch (error) {
      console.log(error);
    }
  }

  const getTodosFromUserDeveice = async () => {
    try {
      const existingTodos = await AsyncStorage.getItem('todos');
      setTodos(JSON.parse(existingTodos));
      
    } catch (error) {
      console.log(error);
    }
  }

  const removeItemFromSecureStore = async () =>{
    try {
      const existingTodos = await AsyncStorage.getItem('todos');
      if(existingTodos != null){
        await AsyncStorage.removeItem('todos');
        return true;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const removeAlltodos = async () => {
    setTodos([]);
    removeItemFromSecureStore();
  }
 
  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight:'bold', fontSize:20, color:COLORS.primary}}>
          TODO APP
        </Text>
        <TouchableOpacity onPress={()=>clearAllTodos()}>
        <Icon name="delete" size={25} color="red"/>
        </TouchableOpacity>
      </View>
      <FlatList 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding:20, paddingBottom:100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Add Todo' placeholderTextColor={COLORS.primary} style={{color:COLORS.primary}} value={textInput} onChangeText={(text)=>setTextInput(text)}/>
        </View>
        <TouchableOpacity onPress={addTodo} style={styles.iconContainer}> 
          <View style={styles.iconContainer}>
            <Icon name='add' color={COLORS.white} size={30}/>
          </View>
      </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:{
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  footer:{
    position: 'absolute',
    bottom: 0,
    color:COLORS.white,
    width: '100%',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:20
  },
  inputContainer:{
    backgroundColor:COLORS.white,
    elevation:40,
    flex:1,
    height:50,
    marginVertical:20,
    marginRight:20,
    borderRadius:30,
    paddingHorizontal:20,
    
  },
  iconContainer:{
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius:25,
    elevation:40,
    justifyContent:'center',
    alignItems:'center'
  },
  listItem:{
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10
  },
  actionIcon:{
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius:3
  }
  
});

export default App;

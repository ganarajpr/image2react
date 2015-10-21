'use strict';
<%

var typeToComponent = [
    getText,
    getImage,
    getTextInput,
    getDropdown,
    getDatePicker,
    getTabs,
    getView
];

function getText(){
  return "<View style={styles.labelView}><Text style={styles.label}>Dummy Text</Text></View>";
}

function getImage(){
  return "<View style={styles.imageView}><Image style={styles.image}></Image></View>";
}

function getDatePicker(){
  return "<DatePickerIOS date={this.state.date} mode='date'/>";
}

function getTabs(){
  return "<TabBarIOS></TabBarIOS>";
}

function getTextInput(){
  return "<TextInput value={this.state.text}/>";
}

function getView(children){
  return "<View>"+( children ? children : '' ) +"</View>";
}

function getButton(){
  return "<View>Button</View>";
}

function getDropdown(){
  return "<View>Dropdown</View>";
}


function convertTree(node){
    var childs = "";
    for (var i = 0; i < node.children.length; i++) {
          childs += convertTree(node.children[i]);
    }
    if(node.type === "root"){
        return getView(childs);
    }
    else{
        return typeToComponent[node.data[4]](childs);
    }
}%>
var React = require('react-native');
var {
  StyleSheet,
  View,
  TabBarIOS,
  Image,
  Text,
  TextInput,
  DatePickerIOS
} = React;

var <%= componentName %> = React.createClass({
  render: function() {
    return (
      <%=convertTree(tree)%>
    );
  }
});

var styles = StyleSheet.create({
  labelView : {

  },
  label : {

  }
});

module.exports = <%= componentName %>;

'use babel';
import React from 'react-for-atom';
var {PropTypes,Component} = React;
import NodeTree from 'react-node-tree';
//import boxTree from 'bbox-tree';

export default class TreeView extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <NodeTree node={root} depth="1"></NodeTree>
        );
    }
}

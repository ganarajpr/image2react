'use babel';
/* @flow */

import React from 'react-for-atom';
var {PropTypes,Component} = React;
import Overlay from './Overlay';

const styles = {
    container : {
        display  :"flex",
        flex : 1,
        height : "100%",
        justifyContent : "center",
        alignItems : "center"
    },
    wrapper : {
        position : "relative"
    }
};

export default class ImageEditorComponent extends Component{
    constructor(){
        super();
    }
    render(): ReactElement{
        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <img src={this.props.filePath}></img>
                    <Overlay></Overlay>
                </div>
            </div>
        );
    }
}

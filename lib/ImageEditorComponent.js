'use babel';
/* @flow */

import React from 'react-for-atom';
var {PropTypes,Component} = React;

const styles = {
    wrapper : {
        display  :"flex",
        flex : 1,
        height : "100%",
        justifyContent : "center",
        alignItems : "center"
    }
};

export default class ImageEditorComponent extends Component{
    constructor(){
        super();

    }
    render(): ReactElement{
        return (
            <div style={styles.wrapper}>
                <img src={this.props.filePath}></img>
            </div>
        );
    }
}

'use babel';

/* @flow */

import React from 'react-for-atom';
var {PropTypes,Component} = React;

const styles = {
    overlay : {
        position : "absolute",
        top : 0,
        left : 0,
        right : 0,
        bottom : 0
    }
};

export default class ImageEditorComponent extends Component{

    drawBoxes(){
        return this.props.boxes.map(box =>{
            return this.drawBox(box);
        });
    }

    onBoxClick(box){
        this.props.onBoxSelected(box);
    }

    drawBox(box){
        var style = {
                position : "absolute",
                top : Math.min(box.startY,box.endY),
                left : Math.min(box.startX,box.endX),
                width : Math.abs(box.startX - box.endX),
                height : Math.abs(box.startY - box.endY),
                border : "2px solid red"
        };
        if(box === this.props.currentBox){
            style.border = "2px solid green";
        }

        if(!this.props.isEditing){
            return (
                <div style={style} onClick={this.onBoxClick.bind(this,box)}></div>
            );
        }
        else{
            return (
                <div style={style}></div>
            );
        }

    }

    render():ReactElement{
        return (
            <div style={styles.overlay}>
                {this.drawBoxes()}
            </div>
        );
    }
}

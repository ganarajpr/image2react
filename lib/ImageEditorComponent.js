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
        this.state = {
            imageLoadComplete : false
        };
        this.imageLoaded = this.imageLoaded.bind(this);
    }

    imageLoaded(){
        var node = React.findDOMNode(this.refs.image);
        var position = node.getBoundingClientRect();
        console.log(position);
        this.setState({position:position});
    }

    drawOverlay(){
        if(this.state.position){
            return (
                <Overlay onEdit={this.props.onEdit} position={this.state.position}
                     bbox={this.props.bbox}></Overlay>
            );
        }
        return null;
    }
    render(): ReactElement{
        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <img ref="image" src={this.props.filePath} onLoad={this.imageLoaded}></img>
                    {this.drawOverlay()}
                </div>
            </div>
        );
    }
}

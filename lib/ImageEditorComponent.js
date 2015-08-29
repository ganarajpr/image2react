'use babel';
/* @flow */

import {CompositeDisposable} from 'atom';
import React from 'react-for-atom';
var {PropTypes,Component} = React;

export default class ImageEditorComponent extends Component{
    constructor(){
        super();

    }
    render(): ReactElement{
        return (
            <img src={this.props.filePath}></img>
        );
    }


}

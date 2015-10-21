'use babel';

import React from 'react-for-atom';

var {Component} = React;


export default class ModalComponent extends Component {
    constructor(props) {
        super(props);
        props.textContent = props.textContent || '';
        this._editor = null;
    }

    componentDidMount(){
        var textEditor = React.findDOMNode(this.refs.textEditor);
        this._editor = textEditor.getModel();
    }

    render(){
        return (
            <div ref="root" className="block">
                <atom-text-editor
                    ref="textEditor">{this.props.textContent}</atom-text-editor>
            </div>
        );
    }
}

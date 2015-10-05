'use babel';

import React from 'react-for-atom';

var {Component} = React;
const styles = {
    container : {
        display  :"flex",
        flex : 1,
        alignItems : "center",
        flexDirection : "column"
    }
};

export default class ImageButtonComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
      onConvert : React.PropTypes.func.isRequired
    }

    render(){
        return (
            <div style={styles.container}>
                <button onClick={this.props.onConvert}
                  className="btn btn-error">Convert To React</button>
            </div>
        );
    }
}

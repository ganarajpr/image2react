'use babel';
/* @flow */

import React from 'react-for-atom';
var {PropTypes,Component} = React;
import Overlay from './Overlay';
import BoxesLayer from './BoxesLayer';
import NuclideDropdown from './Dropdown';
const styles = {
    container : {
        display  :"flex",
        flex : 1,
        height : "100%",
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "column"
    },
    wrapper : {
        position : "relative"
    },
    toolbar: {
        padding : "20px"
    }
};

const menuItems = [
        {label : "Text"},
        {label : "Image"},
        {label : "Button"},
        {label : "Input"},
        {label : "Dropdown"},
        {label : "Datepicker"},
        {label : "Icon"},
        {label : "Tabs"},
        {label : "Other"}
];



export default class ImageEditorComponent extends Component{
    constructor(props){
        super();
        this.state = {
            imageLoadComplete : false,
            editMode : true,
            currentBox : null,
            selectedIndexForCurrent : 0,
            boxes : props.boxes.boxes || []
        };
        this.imageLoaded = this.imageLoaded.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSelectedChange = this.onSelectedChange.bind(this);
        this.onBoxSelected = this.onBoxSelected.bind(this);
        this.onBoxAdd = this.onBoxAdd.bind(this);
    }

    imageLoaded(){
        var node = React.findDOMNode(this.refs.image);
        var position = node.getBoundingClientRect();
        this.setState({position:position});
    }

    onBoxSelected(box){
        this.setState({
            currentBox : box,
            selectedIndexForCurrent: box.type
        });
    }

    drawBoxesLayer(){
        return (
            <BoxesLayer boxes={this.state.boxes}
                currentBox={this.state.currentBox}
                isEditing={this.state.editMode}
                onBoxSelected={this.onBoxSelected}/>
        );
    }

    onBoxAdd(box){
        var boxes = this.state.boxes;
        boxes.push(box);
        this.setState({boxes : boxes});
        this.props.onEdit({ boxes : boxes } );
    }

    drawOverlay(){
        if(this.state.position){
            return (
                <Overlay isEditing={this.state.editMode}
                    selectedIndex={this.state.selectedIndexForCurrent}
                    onEdit={this.onBoxAdd}
                    position={this.state.position}></Overlay>
            );
        }
        return null;
    }

    toggleEdit(){
        var editMode = this.state.editMode;
        editMode = !editMode;
        if(editMode){
            this.setState({
                editMode : editMode,
                currentBox : null
            });
        }
        else{
            this.setState({editMode : editMode});
        }
    }

    onSelectedChange(index){
        var currentBox = this.state.currentBox;
        currentBox.type = index;
        this.setState({
            selectedIndexForCurrent : index,
            currentBox : currentBox
        });
    }

    render(): ReactElement{
        var editMode = this.state.editMode;
        var btnText = editMode ? 'Editing' : 'Edit';
        var btnStyles = 'btn icon icon-edit';
        btnStyles = editMode ? btnStyles + " btn-warning selected" : btnStyles;
        return (
            <div style={styles.container}>
                <div className="block" style={styles.toolbar}>
                    <button onClick={this.toggleEdit} className={btnStyles}>{btnText}</button>
                </div>
                <div className="block" style={styles.toolbar}>
                    <NuclideDropdown menuItems={menuItems} selectedIndex={0}
                        onSelectedChange={this.onSelectedChange}/>
                </div>
                <div style={styles.wrapper}>
                    <img ref="image" src={this.props.filePath} onLoad={this.imageLoaded}></img>
                    {this.drawBoxesLayer()}
                    {this.drawOverlay()}
                </div>
            </div>
        );
    }
}

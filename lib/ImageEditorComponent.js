'use babel';
/* @flow */

import React from 'react-for-atom';
var {PropTypes,Component} = React;
import Overlay from './Overlay';
import BoxesLayer from './BoxesLayer';
import NuclideDropdown from './Dropdown';
import classNames from 'classnames';
const styles = {
    container : {
        display  :"flex",
        flex : 1,
        height : "100%",
        overflow : "scroll",
        alignItems : "center",
        flexDirection : "column"
    },
    wrapper : {
        position : "relative"
    },
    toolbar: {
        padding : "10px"
    }
};

const menuItems = [
        {label : "Text", value : "Text"},
        {label : "Image", value : "Image"},
        {label : "Button", value : "Button"},
        {label : "Input", value : "Input"},
        {label : "Dropdown", value : "Dropdown"},
        {label : "Datepicker", value : "Datepicker"},
        {label : "Tabs", value : "Tabs"},
        {label : "Other", value : "Other"}
];



export default class ImageEditorComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageLoadComplete : false,
            editMode : true,
            currentBox : null,
            selectedIndexForCurrent : 0,
            boxes : props.boxes || []
        };
        this.imageLoaded = this.imageLoaded.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSelectedChange = this.onSelectedChange.bind(this);
        this.onBoxSelected = this.onBoxSelected.bind(this);
        this.onBoxAdd = this.onBoxAdd.bind(this);
        this.deleteCurrentBox = this.deleteCurrentBox.bind(this);
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
        box.type = this.state.selectedIndexForCurrent;
        boxes.push(box);
        this.setState({
            boxes : boxes,
            currentBox : box
        });
        this.props.onBoxAdd(box);
    }

    drawOverlay(){
        if(this.state.position){
            return (
                <Overlay
                    isEditing={this.state.editMode}
                    onEdit={this.onBoxAdd}
                    position={this.state.position}>
                </Overlay>
            );
        }
    }

    deleteCurrentBox(){
        var index = this.state.boxes.indexOf(this.state.currentBox);
        if(index > -1){
            var boxes = this.state.boxes;
            boxes.splice(index,1);
            this.setState({
                boxes : boxes,
                currentBox : null
            });
        }
    }

    drawDeleteButton(){
        if(!this.state.editMode && this.state.currentBox){
            return (
                <button onClick={this.deleteCurrentBox} className="btn btn-error icon icon-x">Delete</button>
            );
        }
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
        //this.props.onEdit({ boxes : this.state.boxes } );
    }

    isDropdownDisabled(){
        return this.state.currentBox ? false : true;
    }

    onGenerate(){
      this.props.onGenerate(this.state.boxes);
    }

    onDeleteAll(){
      this.setState({
        boxes : []
      });
    }

    render() : ReactElement {
        var editMode = this.state.editMode;
        var btnText = editMode ? 'Editing' : 'Edit';
        var buttonClasses = {
            btn : true,
            icon : true,
            'icon-pencil' : true,
            'btn-warning' : editMode
        };
        var generateButtonClasses = {
            btn : true,
            'btn-error' : true
        };
        var btnStyles = classNames(buttonClasses);
        var geneStyles = classNames(generateButtonClasses);
        return (
            <div style={styles.container}>
                <div className="block" style={styles.toolbar}>
                    <button onClick={this.toggleEdit}
                        className={btnStyles}>{btnText}</button>
                </div>
                <div className="block" style={styles.toolbar}>
                    <NuclideDropdown menuItems={menuItems}
                        disabled={this.isDropdownDisabled()}
                        selectedIndex={this.state.selectedIndexForCurrent}
                        onSelectedChange={this.onSelectedChange}/>
                    {this.drawDeleteButton()}
                </div>
                <div style={styles.wrapper}>
                    <img ref="image" src={this.props.filePath} onLoad={this.imageLoaded}></img>
                    {this.drawBoxesLayer()}
                    {this.drawOverlay()}
                </div>
                <div className="block" style={styles.toolbar}>
                    <button onClick={::this.onGenerate} className={geneStyles}>Generate</button>
                    <button onClick={::this.onDeleteAll} className={geneStyles}>Delete All</button>
                </div>
            </div>
        );
    }
}

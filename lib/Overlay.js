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
}
export default class Overlay extends Component{
    constructor(props){
        super(props);
        this.startDraw = this.startDraw.bind(this);
        this.endDraw = this.endDraw.bind(this);
        this.updateDraw = this.updateDraw.bind(this);
        this.hasStartedDrawing = false;
        this.state = {
            boxes : props.bbox.boxes || [],
            currentBox : {
                startX : 0,
                startY :0,
                endX : 0,
                endY : 0
            }
        };
        this.position = props.position;
    }

    componentDidMount(){
        setTimeout(()=>{

            this.forceUpdate()
        },1000);
    }

    startCurrentBox(){
        var currentBox = {};
        currentBox.startX = 0;
        currentBox.startY = 0;
        currentBox.endX = 0;
        currentBox.endY = 0;
        this.setState({currentBox : currentBox});
    }

    startDraw(event){
        this.hasStartedDrawing = true;
        var currentBox = this.state.currentBox;
        currentBox.startX = event.pageX - this.position.left;
        currentBox.endX = event.pageX - this.position.left;
        currentBox.startY = event.pageY - this.position.top;
        currentBox.endY = event.pageY - this.position.top;
        this.setState({currentBox:currentBox});

    }

    endDraw(event){
        this.updateDraw(event);
        var boxes = this.state.boxes;
        boxes.push(this.state.currentBox);
        this.setState({boxes: boxes});
        this.startCurrentBox();
        this.props.onEdit({
            image:this.position,
            boxes : boxes
        });
        this.hasStartedDrawing = false;
    }

    updateDraw(event){
        if(this.hasStartedDrawing){
            var currentBox = this.state.currentBox;
            currentBox.endX = event.pageX - this.position.left;
            currentBox.endY = event.pageY - this.position.top;
            this.setState({currentBox:currentBox});
        }
    }

    drawBoxes(){
        return this.state.boxes.map(box =>{
            return this.drawBox(box);
        });
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
        return (
                <div style={style}></div>
        );
    }

    render(): ReactElement{
        return (
            <div style={styles.overlay}>
                {this.drawBoxes()}
                {this.drawBox(this.state.currentBox)}
                <div style={styles.overlay}
                    onMouseUp={this.endDraw}
                    onMouseMove={this.updateDraw}
                    onMouseDown={this.startDraw}>
                </div>
            </div>

        );
    }
}

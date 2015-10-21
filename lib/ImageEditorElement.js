'use babel';
/* @flow */

import path from 'path';
import React from 'react-for-atom';
import ImageEditorComponent from './ImageEditorComponent';
import boundingTree from 'bbox-tree';
import _ from 'underscore-plus';
import fs from 'fs';
import {allowUnsafeNewFunction} from 'loophole';
import ModalElement from './panel/ModalElement';
import {CompositeDisposable} from 'event-kit';
import {Bitmap} from 'imagejs';
import FormData from 'form-data';
import http from 'http';
import {Promise} from 'bluebird';
import {detect,detectWithDim} from './detector';

class ImageEditorElement extends HTMLElement {
  _uri: string;
  boxes: any;

  initialize(uri: string,boxes) {
    this._uri = uri;
    this.boxes = boxes;
    this.rendered = React.render(
        <ImageEditorComponent onGenerate={::this.onGenerate}
         onBoxAdd={::this.onBoxAdd} boxes={this.boxes}
          filePath={this._uri}/>,
      this
    );
    this.subscriptions = new CompositeDisposable;
    var fileContents = fs.readFileSync("reacttmpl.js", "utf8");
    this.tmplContent= allowUnsafeNewFunction( ()=>{
      return _.template(fileContents);
    });
    this.modalElement = new ModalElement();
    this.modalPanel = atom.workspace.addModalPanel({
          item : this.modalElement,
          visible : false
      });

    // Hitting enter when this panel has focus should confirm the dialog.
    this.subscriptions.add(atom.commands.add(
        this.modalElement,
        'core:confirm',
        (event) => this.onConfirm()));

    // Hitting escape when this panel has focus should cancel the dialog.
    this.subscriptions.add(atom.commands.add(
        this.modalElement,
        'core:cancel',
        (event) => this.onCancel()));
    return this;
  }

  onConfirm(){
        this.modalPanel.hide();
    }

    onCancel(){
        this.modalPanel.hide();
    }

  setBoundingBox({bbox}){
    this.boxes = bbox.map((box)=>{
      return {
        startX : box[0],
        startY : box[1],
        endX : box[2],
        endY : box[3],
        type : 0
      };
    });

    var images = bbox.map((box)=>{
      return {
        top : box[1],
        left : box[0],
        width : box[2] - box[0],
        height : box[3] - box[1]
      }
    });
    var bitmap = new Bitmap();
    bitmap.readFile(this._uri)
      .then(()=> {
          var nodes = [];
          images.map((imgDim,index)=>{
            var cropped = bitmap.crop(imgDim);
            var fileName = 'patch'+index+'.jpg'
            cropped.writeFile(fileName)
              .then(()=>{
                detect(fileName)
                  .then((result)=>{
                    fs.unlinkSync(fileName);
                    nodes.push({
                      startX : imgDim.left,
                      startY : imgDim.top,
                      endX : imgDim.left + imgDim.width,
                      endY : imgDim.top + imgDim.height,
                      type : result
                    });
                    if(images.length === nodes.length){
                      React.unmountComponentAtNode(this);
                      this.rendered = React.render(
                          <ImageEditorComponent onBoxAdd={::this.onBoxAdd}
                            onGenerate={::this.onGenerate}
                            boxes={nodes}
                            filePath={this._uri}/>,
                        this
                      );
                    }
                  });
              });
          });
      });

    React.unmountComponentAtNode(this);
    this.rendered = React.render(
        <ImageEditorComponent onBoxAdd={::this.onBoxAdd}
          onGenerate={::this.onGenerate}
          boxes={this.boxes}
          filePath={this._uri}/>,
      this
    );
    return this;
  }

  onGenerate(boxes){
      var formattedBbox =  boxes.map(function (box) {
          return [
              box.startX,
              box.startY,
              box.endX,
              box.endY,
              box.type
          ];
      });
      var boundTree = boundingTree(formattedBbox);
      var input = {
        componentName : "NewComponent",
        tree : boundTree
      };
      var outputString = this.tmplContent(input);
      console.log(outputString);
      this.modalElement.setModalContent(outputString);
      this.modalPanel.show();
  }

  onBoxAdd(box){
    detectWithDim(this._uri,{
      top : box.startY,
      left : box.startX,
      width : box.endX - box.startX,
      height : box.endY - box.startY
    }).then((result)=>{
      box.type = result;
      this.rendered.onSelectedChange(result);
    });
  }

  detachedCallback() {
    React.unmountComponentAtNode(this);
  }

  /**
   * Return the tab title for the opened diff view tab item.
   */
  getTitle(): string {
    return path.basename(this._uri);
  }

  /**
   * Return the tab URI for the opened diff view tab item.
   * This guarantees only one diff view will be opened per URI.
   */
  getURI(): string {
    return this._uri;
  }

  getPath(): string {
    return this._uri;
  }

}

module.exports = ImageEditorElement = document.registerElement('image-editor-view', {
  prototype: ImageEditorElement.prototype,
});

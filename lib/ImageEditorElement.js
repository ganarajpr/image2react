'use babel';
/* @flow */

import path from 'path';
import React from 'react-for-atom';
import ImageEditorComponent from './ImageEditorComponent';
import boundingTree from 'bbox-tree';
import _ from 'underscore-plus';
import fs from 'fs';
import {allowUnsafeNewFunction} from 'loophole';

class ImageEditorElement extends HTMLElement {
  _uri: string;
  boxes: any;

  initialize(uri: string,boxes) {
    this._uri = uri;
    this.boxes = boxes;
    React.render(
        <ImageEditorComponent onGenerate={::this.onGenerate}
         onEdit={::this.onEdit} boxes={this.boxes}
          filePath={this._uri}/>,
      this
    );
    var fileContents = fs.readFileSync("reacttmpl.js", "utf8");
    this.tmplContent= allowUnsafeNewFunction( ()=>{
      return _.template(fileContents);
    });
    return this;
  }

  setBoundingBox({bbox}){
    this.boxes = bbox;
    React.unmountComponentAtNode(this);
    React.render(
        <ImageEditorComponent onEdit={::this.onEdit}
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

  }

  onEdit(){

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

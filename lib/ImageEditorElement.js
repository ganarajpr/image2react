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

import {Bitmap} from 'imagejs';
import FormData from 'form-data';
import http from 'http';
import {Promise} from 'bluebird';

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
    this.modalElement = new ModalElement();
    this.modalPanel = atom.workspace.addModalPanel({
          item : this.modalElement,
          visible : false
      });
    return this;
  }

  detect(fileName){
    return new Promise((resolve,reject)=>{
      var form = new FormData();
      form.append('wireframe', fs.createReadStream(fileName));

      var request = http.request({
        method: 'post',
        host: 'api.dhi.io',
        path: '/detect',
        headers: form.getHeaders()
      });

      form.pipe(request);

      request.on('response',(res) =>{
        var body = '';
        res.on('data', (chunk) =>{
          body += chunk;
        });
        res.on('end',() =>{
          var resp = JSON.parse(body);
          console.log(fileName,+resp.result);
          resolve(+resp.result);
        });
      });
    });

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
    var nodes = [];
    bitmap.readFile(this._uri)
        .then(()=> {
            images.map((imgDim,index)=>{
              var cropped = bitmap.crop(imgDim);
              var fileName = 'patch'+index+'.jpg'
              cropped.writeFile(fileName)
                .then(()=>{
                  this.detect(fileName)
                    .then((result)=>{
                      nodes.push({
                        startX : imgDim.left,
                        startY : imgDim.top,
                        endX : imgDim.left + imgDim.width,
                        endY : imgDim.top + imgDim.height,
                        type : result
                      });
                      if(images.length === nodes.length){
                        React.unmountComponentAtNode(this);
                        React.render(
                            <ImageEditorComponent onEdit={::this.onEdit}
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
      this.modalElement.setModalContent(outputString);
      this.modalPanel.show();
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

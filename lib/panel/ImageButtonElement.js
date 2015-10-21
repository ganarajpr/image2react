'use babel';

/* @flow */
import React from 'react-for-atom';
import ImageButtonComponent from './ImageButtonComponent';

import FormData from 'form-data';
import fs from 'fs';
import http from 'http';


class ImageButtonElement extends HTMLElement {

  initialize(path) {
    this.filePath = path;
    return this;
  }

  onConvert(){
    var form = new FormData();
    form.append('wireframe', fs.createReadStream(this.filePath));

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
        var parsedBBox = JSON.parse(body);
        console.log(body);
        atom.workspace.open(this.filePath+'.image2react').then((editor)=>{
          //editor.setBoundingBox(parsedBBox);
        });
      });
    });
  }

  attachedCallback() {
    React.render(
        <ImageButtonComponent onConvert={::this.onConvert}/>,
      this
    );
  }

  detachedCallback() {
    React.unmountComponentAtNode(this);
  }

}

module.exports = ImageButtonElement = document.registerElement('image-button-element', {
  prototype: ImageButtonElement.prototype,
});

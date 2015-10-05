'use babel';

/* @flow */
import React from 'react-for-atom';
import ImageButtonComponent from './ImageButtonComponent';

class ImageButtonElement extends HTMLElement {

  initialize(path) {
    this.filePath = path;
    return this;
  }

  onConvert(){
    console.log('converting to react',this.filePath);
    atom.workspace.open(this.filePath+'.image2react');
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

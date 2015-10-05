'use babel';
/* @flow */

import path from 'path';
import React from 'react-for-atom';
import ImageEditorComponent from './ImageEditorComponent';

class ImageEditorElement extends HTMLElement {
  _uri: string;
  boxes: any;

  initialize(uri: string,boxes) {
    console.log("creating image editor");
    this._uri = uri;
    this.boxes = boxes;
    React.render(
        <ImageEditorComponent onEdit={::this.onEdit} boxes={this.boxes}
          filePath={this._uri}/>,
      this
    );
    return this;
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

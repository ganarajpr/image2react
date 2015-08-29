'use babel';
/* @flow */

import path from 'path';

class ImageEditorElement extends HTMLElement {
  _uri: string;

  initialize(uri: string) {
    this._uri = uri;
    return this;
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

}

module.exports = ImageEditorElement = document.registerElement('image-editor-view', {
  prototype: ImageEditorElement.prototype,
});

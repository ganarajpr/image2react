'use babel';

import {$, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';


class ImageEditorStatusView extends View{

  constructor(){
    super();
    this.disposables = new CompositeDisposable();
    this.attach();
    this.disposables.add(atom.workspace.onDidChangeActivePaneItem(()=>{
      this.updateImageSize();
    }));
  }

  attach(){
    return this.statusBar.addLeftTile({
      item: this
    });
  }

  attached(){
    return this.updateImageSize();
  }

  getImageSize(originalWidth,originalHeight) {
    return this.imageSizeStatus.text(originalWidth + "x" + originalHeight).show();
  };

  updateImageSize(){
    if(this.imageLoadDisposable){
      this.imageLoadDisposable.dispose();
    }
    var editor = atom.workspace.getActivePaneItem();
    if (editor instanceof ImageEditor) {
      this.editorView = $(atom.views.getView(editor)).view();
      if (this.editorView.loaded) {
        this.getImageSize(this.editorView);
      }
      return this.imageLoadDisposable = this.editorView.onDidLoad(()=> {
        if (editor === atom.workspace.getActivePaneItem()) {
            return this.getImageSize(this.editorView);
          }
      });
    } else {
      return this.imageSizeStatus.hide();
    }
  }

  content(){
    this.div({'class': 'status-image inline-block'}, ()=> {
      this.span({'class': 'image-size', outlet: 'imageSizeStatus'});
    });
  }
}

export default ImageEditorStatusView;

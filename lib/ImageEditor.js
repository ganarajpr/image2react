'use babel';

import fs from 'fs-plus';
import path from 'path';
import {File} from 'pathwatcher';
import {CompositeDisposable} from 'atom';

export default class ImageEditor{

  constructor(filePath){

    atom.deserializers.add(this);
    this.file = new File(filePath);
    this.subs = new CompositeDisposable();

    this.subs.add(atom.commands.add('atom-workspace', 'core:undo',(e)=>{
        var editorView = this.handleCoreEvent(e);
        if(editorView){
          editorView.undoLastChange();
        }
    }));

    this.subs.add(atom.commands.add('atom-workspace', 'core:save',(e)=>{
        var editorView = this.handleCoreEvent(e);
        if(editorView){
          editorView.saveImage();
        }
    }));

    this.subs.add(atom.commands.add('atom-workspace', 'core:save-as',(e)=>{
        var editorView = this.handleCoreEvent(e);
        if(editorView){
          this.saveContentAs(editorView);
        }
    }));
  }

  handleCoreEvent(event){
    var editor = atom.workspace.getActivePaneItem();
    var editorView;
    if(this.isEqual(editor)){
      event.preventDefault();
      event.stopImmediatePropagation();
      //TODO : change from jquery style
      editorView = atom.views.getView(editor);
      return editorView;
    }
  }

  saveContentAs(editorView){
    var saveOptions = {};
    saveOptions.defaultPath = editorView.proposeSavePath();
    var newItemPath = atom.showSaveDialogSync(saveOptions);
    if(newItemPath){
      try {
        editorView.saveImageAs(newItemPath);
      } catch (e) {
        this.addWarningWithPath(newItemPath);
      }
    }
  }

  addWarningWithPath(filePath){
    atom.notifications.addWarning('Unable to save image to : '+ filePath );
  }

  getViewClass(){
    //TODO: change this
    return HTMLDivElement;
  }

  onDidChange(callback){
    var changeSubscription = this.file.onDidChange(callback);
    this.subs.add(changeSubscription);
    return changeSubscription;
  }

  onDidChangeTitle(callback){
    var renameSubscrition = this.file.onDidRename(callback);
    this.subs.add(renameSubscrition);
    return renameSubscrition;
  }

  getTitle(){
    var filePath = this.getPath();
    if(filePath){
      return path.basename(filePath);
    }
    else{
      return 'Untitled';
    }
  }

  getURI(){
    return this.getPath();
  }

  getPath(){
    this.file.getPath();
  }

  isEqual(other){
    return other instanceof ImageEditor && this.getURI() === other.getURI();
  }

  serialize(){
    return {
      filePath: this.getPath(),
      deserializer : this.constructor.name
    };
  }

  deserialize(filePath){
    if(fs.isFileSync(filePath)){
      return new ImageEditor(filePath);
    }
    else{
      console.warn("could not deserialize image editor for path "+
        filePath + ' because that file no longer exists');
    }
  }


}

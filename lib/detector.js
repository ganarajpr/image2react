'use babel';
import FormData from 'form-data';
import http from 'http';
import {Promise} from 'bluebird';
import {Bitmap} from 'imagejs';
import fs from 'fs';

var fromServerToLocal = [
  2,0,1,5,4,6,7
]

export function detect(fileName){
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
        console.log(fileName,fromServerToLocal[resp.result]);
        resolve(fromServerToLocal[resp.result]);
      });
    });
  });
}

export function detectWithDim(fileUri,cropDim){
  return new Promise((resolve,reject)=>{
    var bitmap = new Bitmap();
    bitmap.readFile(fileUri)
      .then(()=> {
        var cropped = bitmap.crop(cropDim);
        var fileName = 'patch.jpg';
        cropped.writeFile(fileName)
          .then(()=>{
            detect(fileName)
              .then((result)=>{
                fs.unlinkSync(fileName);
                resolve(result);
              });
          });
      });
  });

}

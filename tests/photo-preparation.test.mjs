import test from 'node:test';
import assert from 'node:assert/strict';
import {photoDimensions,photoLimits,preparePhoto,sourcePhotoType} from '../src/photo-preparation.js';

const source=()=>new File(['photo fixture'],'room.jpg',{type:'image/jpeg'});
function browserFixture(width=4032,height=3024){
 const bitmap={width,height,closed:false,close(){this.closed=true;}},canvas={width:0,height:0,getContext(){return {fillRect(){},drawImage(){}};}};
 return {bitmap,canvas,decode:async()=>bitmap,makeCanvas:()=>canvas};
}
test('Phone photos fit the website without stretching, cropping or enlarging small photos',()=>{
 assert.deepEqual(photoDimensions(4032,3024),{width:1600,height:1200});
 assert.deepEqual(photoDimensions(3024,4032),{width:1200,height:1600});
 assert.deepEqual(photoDimensions(800,600),{width:800,height:600});
 assert.throws(()=>photoDimensions(10000,10000),/50 megapixels/);
 assert.throws(()=>photoDimensions(0,3000),/too large/);
});
test('Unsupported, empty and oversized sources are rejected before decoding',async()=>{
 assert.equal(sourcePhotoType({name:'room.JPG',type:'',size:100}),'image/jpeg');
 for(const file of [{name:'room.heic',type:'image/heic',size:100},{name:'room.jpg',type:'image/jpeg',size:0},{name:'room.jpg',type:'image/jpeg',size:photoLimits.sourceBytes+1}]){
  let decoded=false;await assert.rejects(preparePhoto(file,{decode:async()=>{decoded=true;}}));assert.equal(decoded,false);
 }
});
test('Prepared copies satisfy the server byte limit and release image/canvas resources',async()=>{
 const fixture=browserFixture(),file=source(),original=await file.text();
 const result=await preparePhoto(file,{...fixture,encode:async()=>new Blob(['prepared'],{type:'image/webp'})});
 assert.equal(result.width,1600);assert.equal(result.height,1200);assert.ok(result.blob.size<photoLimits.outputBytes);
 assert.equal(await file.text(),original);assert.equal(result.sourceName,'room.jpg');assert.equal(fixture.bitmap.closed,true);assert.equal(fixture.canvas.width,1);
});
test('Browsers without WebP encoding fall back to a correctly typed JPEG',async()=>{
 const fixture=browserFixture();
 const result=await preparePhoto(source(),{...fixture,encode:async(canvas,type)=>new Blob(['copy'],{type:type==='image/webp'?'image/png':'image/jpeg'})});
 assert.equal(result.blob.type,'image/jpeg');assert.equal(fixture.bitmap.closed,true);
});
test('Cancellation during encoding prevents the partially prepared photo from being added',async()=>{
 const controller=new AbortController(),fixture=browserFixture();
 await assert.rejects(preparePhoto(source(),{...fixture,signal:controller.signal,encode:async()=>{controller.abort();return new Blob(['copy'],{type:'image/webp'});}}),error=>error.name==='AbortError');
 assert.equal(fixture.bitmap.closed,true);assert.equal(fixture.canvas.width,1);
});
test('Excessive decoded dimensions and uncompressible files fail safely',async()=>{
 const oversized=browserFixture(10000,10000);await assert.rejects(preparePhoto(source(),oversized),/50 megapixels/);assert.equal(oversized.bitmap.closed,true);
 const large=browserFixture();await assert.rejects(preparePhoto(source(),{...large,encode:async()=>new Blob([new Uint8Array(photoLimits.outputBytes)],{type:'image/webp'})}),/website limit/);assert.equal(large.bitmap.closed,true);assert.equal(large.canvas.width,1);
 await assert.rejects(preparePhoto(source(),{decode:async()=>{throw Error('bad JPEG');}}),/Could not read/);
});

export const photoLimits={sourceBytes:25000000,batchBytes:100000000,pixels:50000000,edge:1600,outputBytes:400000};
const types=new Set(['image/jpeg','image/png','image/webp']);
export function sourcePhotoType(file){
 const inferred=/\.jpe?g$/i.test(file.name||'')?'image/jpeg':/\.png$/i.test(file.name||'')?'image/png':/\.webp$/i.test(file.name||'')?'image/webp':'';
 const type=file.type||inferred;
 if(!types.has(type))throw Error('Choose a JPG, PNG, or WebP photo. Export HEIC/HEIF photos as JPG first.');
 if(!Number.isFinite(file.size)||file.size<=0||file.size>photoLimits.sourceBytes)throw Error('Choose a photo between 1 byte and 25 MB.');
 return type;
}
export function photoDimensions(width,height,edge=photoLimits.edge){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>photoLimits.pixels)throw Error('This photo is too large to prepare here. Export a copy below 50 megapixels.');
 const ratio=Math.min(1,edge/Math.max(width,height));
 return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};
}
export function photoSize(bytes){return bytes<1000000?Math.max(1,Math.round(bytes/1000))+' KB':(bytes/1000000).toFixed(1)+' MB';}
const cancelled=signal=>{if(signal?.aborted)throw new DOMException('Photo preparation cancelled','AbortError');};
const canvasBlob=(canvas,type,quality)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Could not prepare this photo. Try exporting it as JPG.')),type,quality));

// Re-encode locally before upload. Originals are neither changed nor uploaded.
export async function preparePhoto(file,{signal,decode=blob=>createImageBitmap(blob),makeCanvas=()=>document.createElement('canvas'),encode=canvasBlob}={}){
 sourcePhotoType(file);cancelled(signal);
 let bitmap,canvas;
 try{
  bitmap=await decode(file);cancelled(signal);photoDimensions(bitmap.width,bitmap.height);
  canvas=makeCanvas();const context=canvas.getContext('2d');if(!context)throw Error('Photo preparation is unavailable in this browser. Try another browser.');
  for(const edge of [1600,1280,1024]){
   const dimensions=photoDimensions(bitmap.width,bitmap.height,edge);canvas.width=dimensions.width;canvas.height=dimensions.height;
   context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);
   for(const quality of [.86,.76,.66]){
    cancelled(signal);let blob=await encode(canvas,'image/webp',quality);cancelled(signal);
    if(blob.type!=='image/webp'){blob=await encode(canvas,'image/jpeg',quality);cancelled(signal);}
    if(types.has(blob.type)&&blob.size>0&&blob.size<photoLimits.outputBytes)return {blob,width:canvas.width,height:canvas.height,sourceSize:file.size,sourceName:file.name};
   }
  }
  throw Error('This photo could not fit the website limit. Export a smaller JPG and add it again.');
 }catch(error){
  if(error.name==='AbortError')throw error;
  if(!bitmap)throw Error('Could not read this photo. Try exporting it as JPG.');
  throw error;
 }finally{bitmap?.close();if(canvas){canvas.width=1;canvas.height=1;}}
}

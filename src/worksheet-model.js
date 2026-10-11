// A text-only export from the current page; no persistence or submission.
export function worksheetText({title,items,notes}){
 const clean=value=>typeof value==='string'?value.trim():'';
 const rows=(Array.isArray(items)?items:[]).slice(0,18).map(item=>({label:clean(item?.label).slice(0,250),reviewed:item?.reviewed===true})).filter(item=>item.label);
 const reviewed=rows.filter(item=>item.reviewed).length;
 return [clean(title).slice(0,100)||'Conversation worksheet',`Prompts reviewed: ${reviewed} of ${rows.length}`,rows.map(item=>(item.reviewed?'[reviewed] ':'[ ] ')+item.label).join('\n'),'Questions / notes:\n'+(clean(notes).slice(0,1200)||'No notes added.'),'Brad Hazen · Realty Pro, Inc.\n(360) 921-9484 · b.hazen@hotmail.com'].join('\n\n')+'\n';
}

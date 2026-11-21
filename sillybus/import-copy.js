'use strict';
function mergeSavedBoardCopies(existing,payload,makeId){
 if(!Array.isArray(payload.items))throw Error('The saved board has no assignment list.');
 const tasks=existing.mode==='sample'?[]:existing.tasks.slice(),byId=new Map(tasks.filter(t=>t.importId).map(t=>[t.importId,t])),sourceIds=new Set(),changes=[];let added=0;
 for(const i of payload.items){const importId=String(i.item_id||i.id||`${i.course_key}:${i.title}:${i.due_date||i.due||''}`);sourceIds.add(importId);const sourceDue=i.due||i.due_date||'Unconfirmed';const old=byId.get(importId);
  if(old){if(old.sourceDue&&old.sourceDue!==sourceDue)changes.push({id:old.id,title:old.title,previous:old.sourceDue,current:sourceDue});continue}
  const due=i.due||'',t={id:makeId(),importId,title:i.title||'Untitled assignment',course:i.course||i.course_key||'Unsorted',courseKey:i.course_key||'',date:i.due_date||(due?due.slice(0,10):''),time:due?due.slice(11,16):'',status:i.done?'done':'todo',source:i.source==='canvas'?'Canvas':i.source==='doc'?'Syllabus':i.source||'SillyBus',sourceDue,dateNote:i.date_note||'',detail:i.detail||'',notes:'',url:i.url||'',flags:i.flags||[],points:i.points??null};tasks.push(t);byId.set(importId,t);added++;
 }
 return {tasks,audit:{sourceCount:payload.items.length,uniqueSourceCount:sourceIds.size,copiedCount:[...sourceIds].filter(k=>byId.has(k)).length,missing:[...sourceIds].filter(k=>!byId.has(k)),unconfirmed:payload.items.filter(i=>!i.due&&!i.due_date).length,added,changes,sourceGeneratedAt:payload.source_generated_at||null,sourceVersion:payload.source_app_version||null,copiedAt:new Date().toISOString()}};
}
if(typeof module!=='undefined')module.exports={mergeSavedBoardCopies};

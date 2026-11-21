'use strict';
function resolveWorkspaceContext(workspace,question='',choice='auto'){
 const normalize=s=>String(s||'').toLowerCase().replace(/\s*\/\s*/g,'/').replace(/[^\p{L}\p{N}./]+/gu,' ').trim();
 const q=normalize(question),tasks=workspace.tasks||[];
 const taskContext=(t,reason)=>({kind:'assignment',id:t.id,title:t.title,course:t.course,date:t.date||null,time:t.time||null,instructions:t.detail||'',notes:t.notes||'',reason,contentScope:'Saved assignment instructions and notes; linked worksheet contents are not automatically read.'});
 if(question){
  if(/\b(?:all (?:my )?assignments|across (?:my )?classes|overall workload|general question|not this (?:page|assignment))\b/i.test(question))return {kind:'workspace',title:'All assignments',reason:'You asked about the whole workspace'};
  const exact=tasks.filter(t=>normalize(t.title).length>=5&&q.includes(normalize(t.title)));
  if(exact.length===1)return taskContext(exact[0],'Assignment named in your question');
  const sections=q.match(/\b\d+\.\d+(?:\/\d+\.\d+)?\b/g)||[];
  if(sections.length){const matches=tasks.filter(t=>sections.some(s=>normalize(t.title).includes(s)));
   if(matches.length===1)return taskContext(matches[0],'Section named in your question');
   if(matches.length>1&&/instead|switch|different|about/i.test(question))return {kind:'ambiguous',title:'Choose an assignment',matches:matches.map(t=>({id:t.id,title:t.title,course:t.course})),reason:'More than one assignment matches that section'};
  }
  const courses=(workspace.courses||[]).filter(c=>{const alias=normalize(c.name).replace(/^honors /,'').replace(/\s+\d+$/,'');return alias.length>2&&q.includes(alias)});
  if(courses.length===1&&(!workspace.taskId||!normalize(tasks.find(t=>t.id===workspace.taskId)?.course).includes(normalize(courses[0].name))))return {kind:'class',title:courses[0].name,course:courses[0].name,reason:'Class named in your question'};
 }
 if(choice.startsWith('class:'))return {kind:'class',title:choice.slice(6),course:choice.slice(6),reason:'Class context selected'};
 if(choice==='general')return {kind:'workspace',title:'All assignments',reason:'Workspace context selected'};
 if(choice.startsWith('task:')){const t=tasks.find(t=>t.id===choice.slice(5));if(t)return taskContext(t,'Assignment context selected')}
 const task=tasks.find(t=>t.id===workspace.taskId);if(task)return taskContext(task,'Open assignment');
 const page=workspace.page||'home';
 if(page.startsWith('class:'))return {kind:'class',title:page.slice(6),course:page.slice(6),reason:'Open class page'};
 if(page==='assignments')return {kind:'assignment_list',title:workspace.courseFilter?workspace.courseFilter+' assignments':'All assignments',course:workspace.courseFilter||null,reason:'Open assignment list'};
 if(page==='settings')return {kind:'settings',title:'Workspace settings',reason:'Open settings'};
 if(page==='weekly-plan')return {kind:'plan',title:'Recommended weekly plan',reason:'Open weekly plan'};
 const note=(workspace.pages||[]).find(p=>p.id===page);if(note)return {kind:'note',id:note.id,title:note.title,text:(note.blocks||[]).map(b=>b.text||'').join('\n'),reason:'Open notes page'};
 return {kind:'home',title:'School dashboard',reason:'Open homepage'};
}
if(typeof module!=='undefined')module.exports={resolveWorkspaceContext};

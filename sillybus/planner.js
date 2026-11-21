'use strict';
// Pure scheduling logic; no school writes or network access.
function recommendWeek(tasks,p={},now=new Date()){
 const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const start=key(now),length=Math.max(15,Math.min(60,Number(p.session)||25)),daily=Math.max(length,Math.min(240,Number(p.budget)||90));
 const hour=p.energy==='evening'?18:p.energy==='morning'?9:16;
 const cutoff=Number((p.cutoff||'21:00').split(':')[0])*60+Number((p.cutoff||'21:00').split(':')[1]||0);
 let days=Array.from({length:7},(_,i)=>{const d=new Date(start+'T12:00:00');d.setDate(d.getDate()+i);const date=key(d);let begin=hour*60;if(i===0)begin=Math.max(begin,Math.ceil((now.getHours()*60+now.getMinutes()+10)/15)*15);return {date,start:begin,cursor:begin,minutes:0,sessions:[]}});
 const unscheduled=[],unknown=[],warnings=[];
 const pending=tasks.filter(t=>t.status!=='done').slice().sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.status==='progress'?-1:1));
 for(const t of pending){if(!t.date){unknown.push(t);continue}if(t.date<start){unscheduled.push({task:t,reason:'Past due — check whether it is still needed.'});continue}
 let remaining=Math.max(15,Math.min(240,Number(t.estimate)||(/essay|project|lab/i.test(t.title)?60:30)));
 const last=t.date;for(const d of days){if(!remaining)break;if(d.date>last)break;let end=d.date===last&&!t.time?0:cutoff;if(d.date===last&&t.time){const [h,m]=t.time.split(':').map(Number);end=Math.min(end,h*60+m)}
 while(remaining&&d.minutes<daily&&d.cursor<end){let minutes=Math.min(length,remaining,daily-d.minutes,end-d.cursor);if(minutes<5)break;d.sessions.push({taskId:t.id,title:t.title,course:t.course,start:d.cursor,minutes,reason:t.status==='progress'?'Continue work you already started.':`Start before the ${t.date} deadline.`,estimated:true});d.minutes+=minutes;remaining-=minutes;d.cursor+=minutes+5;}}
 if(remaining)unscheduled.push({task:t,reason:`${remaining} estimated minutes do not fit before the deadline. Adjust your availability or start earlier.`});}
 if(p.challenge==='scrolling')warnings.push('Keep your phone out of reach during sessions. The plan stops at your evening cutoff.');
 if(p.challenge==='starting')warnings.push('Start each session with a two-minute first step. You can stop and reassess after that.');
 return {createdAt:now.toISOString(),days,unknown,unscheduled,warnings,preferences:{...p},taskSignature:JSON.stringify(tasks.map(t=>[t.id,t.date,t.time,t.status,t.estimate]))};
}
if(typeof module!=='undefined')module.exports={recommendWeek};

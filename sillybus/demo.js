'use strict';
// Public demonstration uses fictional assignments and browser-local storage only.
importLive=async()=>toast('This public demo uses sample assignments. School connections are available in the installed app.');
askAI=async()=>({text:'Demo only: '+localReply('What should I work on first?'),provider:'local'});
const demoReply=localReply;
localReply=function(message,context){return demoReply(message,context).replace(/Local guidance · use AI[^]*$/,'Local sample guidance. Live AI is not connected in this demo.').replace(/enable AI for a conversational answer\./,'live AI is not connected in this demo.').replace(/AI can help[^]*$/,'Live AI is not connected in this demo.');};
guide=function(){modal(`${header('SillyBus · interactive demo')}<p>Built from the workspace bundled with <b>0.23.13.28</b>, the latest local packaged version verified November 20, 2026.</p><div class="notice"><b>Fictional sample data.</b> Changes stay in this browser. No school login, live AI, account sync, payments, or real submissions are connected.</div><h3>Try it</h3><p>Open an assignment and edit it, check off completed work, switch between List, Table, Board and Calendar, create a notes page, or make a weekly study plan.</p><h3>Appearance</h3><p>Settings includes Notion, SillyBus and Hybrid themes, light/dark appearance, font choices and layout options.</p><h3>Latest development</h3><p>Version 0.23.13.28 improves reading later Canvas announcement pages and warns when collection is incomplete. Those collection services are not running in this static mock.</p><p>This demo is separate from the Chrome Web Store release and does not imply Store approval.</p><div class="modal-actions"><button class="primary" data-action="close">Explore the demo</button></div>`)};
const demoSettings=settings;
settings=function(){demoSettings();document.querySelectorAll('[data-action="import-live"],[data-action="import-backup"],[data-workspace-action="copy-report"]').forEach(x=>x.remove());document.querySelectorAll('.modal p').forEach(p=>{if(p.textContent.startsWith('Importing your board'))p.textContent='This public mock uses fictional sample assignments. Changes are saved only in this browser.'});};
function demoLabels(){
 document.querySelectorAll('.workspace small').forEach(e=>e.textContent='SILLYBUS · DEMO 0.23.13.28');
 document.querySelectorAll('.source-note').forEach(e=>e.textContent='Fictional sample assignments. Your edits stay in this browser.');
 document.querySelectorAll('.preview-pill').forEach(e=>e.textContent='Interactive demo · local saves');
 document.querySelectorAll('.chat-options').forEach(e=>e.innerHTML='<input type="checkbox" id="use-ai" hidden><span>Demo helper · local sample guidance. Live AI is not connected.</span>');
 document.querySelectorAll('#context-chat-root footer').forEach(e=>e.innerHTML='<span>Demo helper · local sample guidance. Live AI is not connected.</span>');
}
// Preserve expected checkbox lookups without offering a non-working AI switch.
const demoChat=renderChat;renderChat=function(){chatAI=false;demoChat();demoLabels();};
const demoRender=render;render=function(){demoRender();demoLabels();};
const demoWork=renderWork;renderWork=function(){demoWork();const opts=document.querySelector('.chat-options');if(opts){opts.innerHTML='<input type="checkbox" id="use-ai" hidden><span>Demo helper · local sample guidance. Live AI is not connected.</span>';}};
const demoBar=document.createElement('div');demoBar.id='demo-bar';demoBar.innerHTML='<a href="../">Josiah’s projects</a><span>Interactive mock · v0.23.13.28 · sample data</span><button id="demo-about">About this demo</button>';document.body.prepend(demoBar);document.getElementById('demo-about').onclick=guide;
if(!localStorage.getItem('demo-visited-v1')){state.display.size='16';state.display.style='notion';state.display.assignmentView='list';view='list';localStorage.setItem('demo-visited-v1','1');}
render();
// Keep the home form’s required false-valued checkbox present after relabeling.
const homeOptions=document.querySelector('.chat-options');if(homeOptions&&!document.getElementById('use-ai'))homeOptions.insertAdjacentHTML('afterbegin','<input type="checkbox" id="use-ai" hidden>');

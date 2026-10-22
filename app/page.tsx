"use client";
import {useState} from "react";
import {FEATURES,CONDS,QUIZ} from "@/lib/data";
const TABS=["Assess","Pathophysiology","Treatment","Learn"];
export default function Home(){
const [tab,setTab]=useState(0);const [sel,setSel]=useState<string[]>([]);const [cid,setCid]=useState(CONDS[0].id);
const [qa,setQa]=useState<Record<number,number>>({});
const cond=CONDS.find(c=>c.id===cid)!;
const tog=(id:string)=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
const res=CONDS.map(c=>{const max=Object.values(c.w).reduce((a,b)=>a+b,0)||1;const sc=sel.reduce((a,f)=>a+(c.w[f]||0),0);return{c,pct:Math.min(100,Math.round(sc/max*100)),sc};}).filter(r=>r.sc>0).sort((a,b)=>b.pct-a.pct);
const alarms=FEATURES.filter(f=>f.alarm&&sel.includes(f.id));
const score=Object.entries(qa).filter(([i,v])=>QUIZ[+i].a===v).length;
const Chips=()=>(<div className="flex flex-wrap gap-2 mb-4">{CONDS.map(c=>(<button key={c.id} onClick={()=>setCid(c.id)} className={"px-3 py-1 rounded-full text-sm border "+(cid===c.id?"bg-teal-700 text-white border-teal-700":"bg-white")}>{c.name.split(" (")[0].split(" /")[0]}</button>))}</div>);
return(<main className="max-w-3xl mx-auto p-4">
<h1 className="text-2xl font-bold text-teal-800">GI Disorders Companion</h1>
<p className="text-sm text-slate-600 mb-3">Harrison's Ch.324–327: Gastritis · Malabsorption/Celiac · IBD · IBS. Educational tool; not a substitute for clinical judgement.</p>
<div className="flex gap-1 mb-4 sticky top-0 bg-[#f4f7f6] py-2">{TABS.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} className={"flex-1 py-2 rounded-lg text-sm font-medium "+(tab===i?"bg-teal-700 text-white":"bg-white border")}>{t}</button>))}</div>
{tab===0&&<section>
<p className="text-sm mb-2">Tick the features present:</p>
<div className="space-y-1 mb-4">{FEATURES.map(f=>(<label key={f.id} className={"flex gap-2 items-start p-2 rounded-lg border bg-white text-sm "+(f.alarm?"border-amber-300":"")}><input type="checkbox" checked={sel.includes(f.id)} onChange={()=>tog(f.id)} className="mt-1"/><span>{f.label}{f.alarm&&" ⚠"}</span></label>))}</div>
{alarms.length>0&&<div className="p-3 mb-3 rounded-lg bg-amber-50 border border-amber-300 text-sm">Alarm features present — organic disease (IBD, celiac, malignancy) must be actively excluded before labelling IBS.</div>}
<h2 className="font-semibold mb-2">Pattern match</h2>
{res.length===0?<p className="text-sm text-slate-500">Select features to see ranked possibilities.</p>:res.map(r=>(<div key={r.c.id} className="bg-white border rounded-lg p-3 mb-2"><div className="flex justify-between text-sm font-medium"><span>{r.c.name}</span><span>{r.pct}%</span></div><div className="h-2 bg-slate-200 rounded mt-1"><div className="h-2 bg-teal-600 rounded" style={{width:r.pct+"%"}}/></div><button className="text-xs text-teal-700 mt-1 underline" onClick={()=>{setCid(r.c.id);setTab(2)}}>View treatment</button></div>))}
<button onClick={()=>setSel([])} className="text-sm underline mt-2">Clear</button>
<p className="text-xs text-slate-500 mt-3">Scores are a simple educational weighting of textbook features, not a validated diagnostic tool. Confirm with serology, endoscopy and histology.</p></section>}
{tab===1&&<section><Chips/><h2 className="font-semibold mb-2">{cond.name} <span className="text-xs text-slate-500">(Ch.{cond.ch})</span></h2><ul className="list-disc pl-5 space-y-2 text-sm">{cond.patho.map((p,i)=><li key={i}>{p}</li>)}</ul></section>}
{tab===2&&<section><Chips/><h2 className="font-semibold mb-2">{cond.name}</h2><ul className="list-disc pl-5 space-y-2 text-sm">{cond.tx.map((p,i)=><li key={i}>{p}</li>)}</ul></section>}
{tab===3&&<section><Chips/><h2 className="font-semibold mb-2">Key points — {cond.name}</h2><ul className="list-disc pl-5 space-y-2 text-sm mb-6">{cond.learn.map((p,i)=><li key={i}>{p}</li>)}</ul>
<h2 className="font-semibold mb-2">Quiz ({score}/{Object.keys(qa).length} correct)</h2>
{QUIZ.map((q,i)=>(<div key={i} className="bg-white border rounded-lg p-3 mb-3 text-sm"><p className="font-medium mb-2">{i+1}. {q.q}</p>{q.o.map((o,j)=>{const done=qa[i]!==undefined;const cls=done?(j===q.a?"bg-green-100 border-green-400":qa[i]===j?"bg-red-100 border-red-400":""):"";return(<button key={j} disabled={done} onClick={()=>setQa(a=>({...a,[i]:j}))} className={"block w-full text-left px-2 py-1 mb-1 border rounded "+cls}>{o}</button>)})}{qa[i]!==undefined&&<p className="text-xs text-slate-600 mt-1">{q.e}</p>}</div>))}
<button onClick={()=>setQa({})} className="text-sm underline">Reset quiz</button></section>}
</main>);}

import{a as f,j as e,z as h}from"./index-CFUsAbVm.js";import{d as i}from"./vendor-B1kLmpHA.js";import{D as xe,C as V}from"./DashboardLayout-Djhf_-5p.js";import{m as x,A as J}from"./motion-BWH5FWdq.js";import{b as X,B as pe}from"./target-BsjTdEz1.js";import{C as ee}from"./clock--YedPVbj.js";import{Z as ue}from"./zap-xE1OFUDr.js";import{D as fe}from"./download-KjjVHVxM.js";import{c as se}from"./brain-CGZCLjja.js";import{S as ge}from"./star-CsJQTdTn.js";import{C as be}from"./check-circle-BOWEx3kM.js";import{A as we}from"./alert-circle-R1UcWA4a.js";import"./user-BeVLiey5.js";/**
 * @license lucide-react v0.306.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=se("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.306.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=se("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]),te=[{id:"hr",label:"HR Round",desc:"Behavioral & personal questions",color:"from-blue-500 to-cyan-500"},{id:"technical",label:"Technical Round",desc:"Coding & technical concepts",color:"from-purple-500 to-primary-500"},{id:"behavioral",label:"Behavioral",desc:"Situational & STAR method",color:"from-green-500 to-teal-500"},{id:"mixed",label:"Full Mock Interview",desc:"Comprehensive practice session",color:"from-orange-500 to-red-500"}],je={easy:"text-green-400",medium:"text-yellow-400",hard:"text-red-400"};function Fe(){var F,B,L,M,G,Q,H,W,_,U,Y,O,Z,K;const[m,u]=i.useState("setup"),[a,N]=i.useState(""),[d,ie]=i.useState("mixed"),[w,k]=i.useState(""),[S,R]=i.useState(!1),[I,ae]=i.useState(null),[l,le]=i.useState([]),[r,T]=i.useState(0),[g,y]=i.useState(""),[n,b]=i.useState(null),[v,C]=i.useState(!1),[p,re]=i.useState(null),[A,$]=i.useState(0),[q,P]=i.useState(!1),j=i.useRef(null),D=i.useRef(null);i.useEffect(()=>{f.get("/career/skills/profile").then(t=>{var s;t.data.profile&&(N(t.data.profile.targetRole||""),k(((s=t.data.profile.currentSkills)==null?void 0:s.map(c=>c.name).join(", "))||""))}).catch(()=>{})},[]),i.useEffect(()=>(q?j.current=setInterval(()=>$(t=>t+1),1e3):clearInterval(j.current),()=>clearInterval(j.current)),[q]);const E=t=>`${Math.floor(t/60).toString().padStart(2,"0")}:${(t%60).toString().padStart(2,"0")}`,ne=async()=>{var s,c;const t=w.split(",").map(o=>o.trim()).filter(Boolean);if(!a)return h.error("Enter target role");R(!0);try{const{data:o}=await f.post("/career/interview/generate",{role:a,type:d,skills:t});ae(o.session),le(o.session.questionDetails||[]),u("interview"),P(!0),h.success("Mock interview started! Good luck 🎯")}catch(o){h.error(((c=(s=o.response)==null?void 0:s.data)==null?void 0:c.message)||"Failed to start interview")}finally{R(!1)}},oe=async()=>{var t;if(!g.trim())return h.error("Please type an answer first");C(!0),b(null);try{const{data:s}=await f.post("/career/interview/answer",{sessionId:I._id,questionIndex:r,answer:g,question:(t=l[r])==null?void 0:t.question,role:a});b(s.evaluation)}catch{h.error("Evaluation failed")}finally{C(!1)}},z=()=>{var t;r<l.length-1?(T(s=>s+1),y(""),b(null),(t=D.current)==null||t.focus()):ce()},ce=async()=>{P(!1);try{const{data:t}=await f.post("/career/interview/complete",{sessionId:I._id});re(t),u("result"),h.success("Interview completed! 🎉")}catch{h.error("Failed to complete session")}},de=t=>t>=8?"text-green-400":t>=6?"text-yellow-400":"text-red-400",me=t=>t>=8?"bg-green-500":t>=6?"bg-yellow-500":"bg-red-500",he=()=>{const t=te.find(o=>o.id===d),s=w.split(",").map(o=>o.trim()).filter(Boolean),c=window.open("","_blank");c.document.write(`
      <!DOCTYPE html><html><head>
      <title>Interview Guide - ${a}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:750px;margin:0 auto;background:#fff;color:#1a1a2e}
        h1{color:#6366f1;font-size:26px;margin-bottom:4px}
        h2{color:#4f46e5;font-size:16px;margin:24px 0 8px;border-bottom:2px solid #e0e7ff;padding-bottom:6px}
        h3{color:#374151;font-size:14px;margin:12px 0 4px}
        p,li{color:#4b5563;font-size:13px;line-height:1.7}
        .tip{background:#f0fdf4;border-left:4px solid #10b981;padding:10px 14px;border-radius:4px;margin:8px 0}
        .warn{background:#fffbeb;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:4px;margin:8px 0}
        .star{background:#eff6ff;border-left:4px solid #6366f1;padding:10px 14px;border-radius:4px;margin:8px 0}
        ul{padding-left:20px}
        .meta{color:#6b7280;font-size:12px;margin-bottom:24px}
        @media print{body{padding:16px}}
      </style></head><body>
      <h1>🎯 Interview Preparation Guide</h1>
      <div class="meta">
        <strong>Role:</strong> ${a} &nbsp;|&nbsp;
        <strong>Type:</strong> ${(t==null?void 0:t.label)||d} &nbsp;|&nbsp;
        <strong>Skills:</strong> ${s.join(", ")}<br/>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>

      <h2>📋 Before the Interview</h2>
      <ul>
        <li>Research the company thoroughly — products, culture, recent news</li>
        <li>Review the job description and match your skills to requirements</li>
        <li>Prepare 3-5 specific examples from your experience using STAR method</li>
        <li>Test your tech setup (camera, mic, internet) 30 minutes before</li>
        <li>Dress professionally even for remote interviews</li>
        <li>Prepare 3 thoughtful questions to ask the interviewer</li>
      </ul>

      <h2>🗣️ How to Behave & Communicate</h2>
      <div class="tip">Speak clearly and at a moderate pace. Pause briefly before answering to collect your thoughts — this shows confidence, not hesitation.</div>
      <ul>
        <li>Maintain eye contact (look at the camera for video calls)</li>
        <li>Use positive body language — sit upright, smile naturally</li>
        <li>Listen carefully to the full question before answering</li>
        <li>If you don't know something, say "I haven't worked with that directly, but here's how I'd approach it..."</li>
        <li>Avoid filler words (um, uh, like) — practice pausing instead</li>
        <li>Show enthusiasm for the role and company</li>
      </ul>

      <h2>⭐ STAR Method for Behavioral Questions</h2>
      <div class="star">
        <strong>S</strong>ituation — Set the context briefly<br/>
        <strong>T</strong>ask — What was your responsibility?<br/>
        <strong>A</strong>ction — What specific steps did YOU take?<br/>
        <strong>R</strong>esult — What was the measurable outcome?
      </div>
      <p>Example: "Tell me about a challenging project" → Describe the project (S), your role (T), the specific decisions you made (A), and the impact/result with numbers if possible (R).</p>

      ${d==="technical"||d==="mixed"?`
      <h2>💻 Technical Round Tips for ${a}</h2>
      <ul>
        <li>Think out loud — explain your reasoning as you solve problems</li>
        <li>Clarify requirements before jumping into solutions</li>
        <li>Start with a brute-force solution, then optimize</li>
        <li>Discuss time and space complexity of your solutions</li>
        <li>For ${s.slice(0,3).join(", ")} — review core concepts, common patterns, and recent updates</li>
        <li>Practice coding on a whiteboard or shared editor beforehand</li>
      </ul>`:""}

      ${d==="hr"||d==="mixed"?`
      <h2>👔 HR Round — Common Questions & Tips</h2>
      <ul>
        <li>"Tell me about yourself" — 2-minute structured pitch: background → skills → why this role</li>
        <li>"Why do you want this job?" — Connect your goals to the company's mission</li>
        <li>"What's your weakness?" — Choose a real weakness you're actively improving</li>
        <li>"Where do you see yourself in 5 years?" — Show ambition aligned with the company</li>
        <li>Salary negotiation: Research market rates, give a range, not a single number</li>
      </ul>`:""}

      <h2>🚫 Common Mistakes to Avoid</h2>
      <div class="warn">
        <ul style="margin:0;padding-left:16px">
          <li>Badmouthing previous employers</li>
          <li>Giving vague answers without specific examples</li>
          <li>Not asking any questions at the end</li>
          <li>Lying or exaggerating your experience</li>
          <li>Checking your phone or being distracted</li>
          <li>Forgetting to follow up with a thank-you email</li>
        </ul>
      </div>

      <h2>📝 Key Topics to Study for ${a}</h2>
      <ul>
        ${s.map(o=>`<li><strong>${o}</strong> — core concepts, best practices, common interview questions</li>`).join("")}
        <li>System design basics (for senior roles)</li>
        <li>Data structures & algorithms fundamentals</li>
        <li>Version control (Git) workflows</li>
      </ul>

      <h2>✅ After the Interview</h2>
      <ul>
        <li>Send a thank-you email within 24 hours</li>
        <li>Note down questions you struggled with for future practice</li>
        <li>Follow up if you haven't heard back within the stated timeline</li>
      </ul>

      <p style="margin-top:32px;color:#9ca3af;font-size:11px;text-align:center">Generated by CareerIQ AI Platform — Good luck! 🍀</p>
      </body></html>
    `),c.document.close(),c.focus(),setTimeout(()=>{c.print(),c.close()},500)};return e.jsx(xe,{children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs(x.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center",children:e.jsx(X,{className:"w-7 h-7 text-white"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-black text-white",children:"Interview Prep Agent"}),e.jsx("p",{className:"text-slate-400 text-sm",children:"AI-powered mock interview with real-time feedback"})]}),m==="interview"&&e.jsxs("div",{className:"ml-auto flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl",children:[e.jsx(ee,{className:"w-4 h-4 text-accent-cyan"}),e.jsx("span",{className:"text-white font-mono font-bold",children:E(A)})]})]}),e.jsxs(J,{mode:"wait",children:[m==="setup"&&e.jsxs(x.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"space-y-6",children:[e.jsxs("div",{className:"glass-card p-6 space-y-4",children:[e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-1.5 block",children:"Target Role"}),e.jsx("input",{value:a,onChange:t=>N(t.target.value),placeholder:"e.g. React Developer, Data Analyst",className:"input-field"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-1.5 block",children:"Your Skills"}),e.jsx("input",{value:w,onChange:t=>k(t.target.value),placeholder:"JavaScript, React, SQL...",className:"input-field"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-3 block",children:"Interview Type"}),e.jsx("div",{className:"grid sm:grid-cols-2 gap-3",children:te.map(t=>e.jsxs("button",{onClick:()=>ie(t.id),className:`p-4 rounded-xl border text-left transition-all
                          ${d===t.id?"border-primary-500/60 bg-primary-500/15":"border-white/10 bg-white/5 hover:border-white/20"}`,children:[e.jsx("div",{className:`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-2`,children:e.jsx(X,{className:"w-4 h-4 text-white"})}),e.jsx("p",{className:"text-white font-semibold text-sm",children:t.label}),e.jsx("p",{className:"text-slate-400 text-xs",children:t.desc})]},t.id))})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx(x.button,{onClick:ne,disabled:S,whileHover:{scale:1.01},whileTap:{scale:.99},className:"btn-primary flex-1 flex items-center justify-center gap-2",children:S?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"})," Preparing..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ue,{className:"w-5 h-5"})," Start Mock Interview"]})}),e.jsxs("button",{onClick:he,className:"btn-ghost flex items-center gap-2 px-4",children:[e.jsx(fe,{className:"w-4 h-4"})," Guide PDF"]})]})]}),e.jsxs("div",{className:"glass-card p-5 border border-accent-cyan/20",children:[e.jsxs("h3",{className:"text-white font-bold mb-3 flex items-center gap-2",children:[e.jsx(pe,{className:"w-4 h-4 text-accent-cyan"})," Quick Study Notes"]}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{className:"p-3 rounded-xl bg-white/5 border border-white/8",children:[e.jsx("p",{className:"text-accent-cyan font-semibold mb-1",children:"STAR Method"}),e.jsx("p",{className:"text-slate-400 text-xs",children:"Situation → Task → Action → Result. Use for all behavioral questions."})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-white/5 border border-white/8",children:[e.jsx("p",{className:"text-accent-green font-semibold mb-1",children:"Body Language"}),e.jsx("p",{className:"text-slate-400 text-xs",children:"Eye contact, upright posture, smile. Pause before answering."})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-white/5 border border-white/8",children:[e.jsx("p",{className:"text-accent-yellow font-semibold mb-1",children:"Technical Tips"}),e.jsx("p",{className:"text-slate-400 text-xs",children:"Think out loud. Clarify before solving. Start simple, then optimize."})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-white/5 border border-white/8",children:[e.jsx("p",{className:"text-accent-purple font-semibold mb-1",children:"HR Tips"}),e.jsx("p",{className:"text-slate-400 text-xs",children:"Research the company. Prepare 3 questions to ask. Follow up after."})]})]})]}),e.jsx(Ne,{})]},"setup"),m==="interview"&&l.length>0&&e.jsxs(x.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"space-y-4",children:[e.jsxs("div",{className:"glass-card p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("span",{className:"text-slate-400 text-sm",children:["Question ",r+1," of ",l.length]}),e.jsx("span",{className:`text-xs capitalize font-medium ${je[(F=l[r])==null?void 0:F.difficulty]}`,children:(B=l[r])==null?void 0:B.difficulty})]}),e.jsx("div",{className:"w-full h-2 bg-white/10 rounded-full",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-primary-500 to-accent-purple rounded-full transition-all duration-500",style:{width:`${(r+1)/l.length*100}%`}})})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("span",{className:`text-xs capitalize px-2 py-0.5 rounded-full border
                    ${((L=l[r])==null?void 0:L.category)==="hr"?"text-blue-400 bg-blue-500/10 border-blue-500/30":((M=l[r])==null?void 0:M.category)==="technical"?"text-purple-400 bg-purple-500/10 border-purple-500/30":"text-green-400 bg-green-500/10 border-green-500/30"}`,children:(G=l[r])==null?void 0:G.category}),e.jsxs("span",{className:"text-slate-500 text-xs flex items-center gap-1",children:[e.jsx(ee,{className:"w-3 h-3"})," ",(Q=l[r])==null?void 0:Q.timeLimit,"s suggested"]})]}),e.jsx("h2",{className:"text-white text-lg font-bold mb-3 leading-relaxed",children:(H=l[r])==null?void 0:H.question}),((W=l[r])==null?void 0:W.hint)&&e.jsxs("p",{className:"text-slate-500 text-xs italic mb-4",children:["💡 Hint: ",l[r].hint]}),e.jsx("textarea",{ref:D,value:g,onChange:t=>y(t.target.value),placeholder:"Type your answer here... Be clear, specific, and use examples where possible.",rows:5,className:"input-field resize-none w-full mb-4"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs(x.button,{onClick:oe,disabled:v||!g.trim(),whileHover:{scale:1.01},whileTap:{scale:.99},className:"btn-primary flex items-center gap-2",children:[v?e.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}):e.jsx(ve,{className:"w-4 h-4"}),v?"Evaluating...":"Submit Answer"]}),e.jsxs("button",{onClick:z,className:"btn-ghost flex items-center gap-2",children:[r<l.length-1?"Skip":"Finish",e.jsx(V,{className:"w-4 h-4"})]})]})]}),e.jsx(J,{children:n&&e.jsxs(x.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"glass-card p-6 border-l-4 border-primary-500",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(ge,{className:"w-5 h-5 text-yellow-400"}),e.jsx("h3",{className:"text-white font-bold",children:"AI Feedback"}),e.jsxs("div",{className:`ml-auto text-2xl font-black ${de(n.score)}`,children:[n.score,"/10"]})]}),e.jsx("div",{className:"w-full h-2 bg-white/10 rounded-full mb-4",children:e.jsx("div",{className:`h-full rounded-full ${me(n.score)} transition-all duration-1000`,style:{width:`${n.score*10}%`}})}),e.jsx("p",{className:"text-slate-300 text-sm mb-4 leading-relaxed",children:n.feedback}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[((_=n.strengths)==null?void 0:_.length)>0&&e.jsxs("div",{children:[e.jsx("p",{className:"text-green-400 font-semibold text-sm mb-2",children:"✅ Strengths"}),n.strengths.map((t,s)=>e.jsxs("p",{className:"text-slate-400 text-xs flex items-center gap-1",children:[e.jsx(be,{className:"w-3 h-3 text-green-400"})," ",t]},s))]}),((U=n.improvements)==null?void 0:U.length)>0&&e.jsxs("div",{children:[e.jsx("p",{className:"text-yellow-400 font-semibold text-sm mb-2",children:"💡 Improve"}),n.improvements.map((t,s)=>e.jsxs("p",{className:"text-slate-400 text-xs flex items-center gap-1",children:[e.jsx(we,{className:"w-3 h-3 text-yellow-400"})," ",t]},s))]})]}),n.betterAnswer&&e.jsxs("div",{className:"mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20",children:[e.jsx("p",{className:"text-primary-400 font-semibold text-xs mb-1",children:"Model Answer:"}),e.jsx("p",{className:"text-slate-300 text-xs leading-relaxed",children:n.betterAnswer})]}),e.jsxs("button",{onClick:z,className:"mt-4 btn-primary flex items-center gap-2 w-full justify-center",children:[r<l.length-1?"Next Question":"Finish Interview",e.jsx(V,{className:"w-4 h-4"})]})]})})]},"interview"),m==="result"&&p&&e.jsxs(x.div,{initial:{opacity:0,scale:.97},animate:{opacity:1,scale:1},className:"space-y-5",children:[e.jsxs("div",{className:"glass-card p-8 text-center",children:[e.jsx("div",{className:"w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-purple/20 border-2 border-primary-500/40 flex items-center justify-center mx-auto mb-4",children:e.jsxs("span",{className:"text-4xl font-black text-white",children:[p.overallScore,"%"]})}),e.jsx("h2",{className:"text-2xl font-black text-white mb-2",children:p.overallScore>=70?"🎉 Great Performance!":p.overallScore>=50?"👍 Good Effort!":"💪 Keep Practicing!"}),e.jsxs("p",{className:"text-slate-400",children:["Interview completed in ",E(A)]})]}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"glass-card p-5",children:[e.jsx("h3",{className:"text-green-400 font-bold mb-3",children:"✅ Strengths"}),(O=(Y=p.session)==null?void 0:Y.strengths)==null?void 0:O.map((t,s)=>e.jsxs("p",{className:"text-slate-300 text-sm mb-1",children:["• ",t]},s))]}),e.jsxs("div",{className:"glass-card p-5",children:[e.jsx("h3",{className:"text-yellow-400 font-bold mb-3",children:"🔧 Areas to Improve"}),(K=(Z=p.session)==null?void 0:Z.improvements)==null?void 0:K.map((t,s)=>e.jsxs("p",{className:"text-slate-300 text-sm mb-1",children:["• ",t]},s))]})]}),e.jsxs("button",{onClick:()=>{u("setup"),T(0),y(""),b(null),$(0)},className:"btn-primary w-full flex items-center justify-center gap-2",children:[e.jsx(ye,{className:"w-4 h-4"})," Practice Again"]})]},"result")]})]})})}function Ne(){const[m,u]=i.useState([]);return i.useEffect(()=>{f.get("/career/interview/history").then(a=>u(a.data.sessions||[])).catch(()=>{})},[]),m.length?e.jsxs("div",{className:"glass-card p-5",children:[e.jsx("h3",{className:"text-white font-bold mb-4",children:"Recent Interviews"}),e.jsx("div",{className:"space-y-3",children:m.slice(0,3).map(a=>e.jsxs("div",{className:"flex items-center justify-between p-3 rounded-xl bg-white/5",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-white text-sm font-medium",children:a.targetRole}),e.jsxs("p",{className:"text-slate-500 text-xs capitalize",children:[a.type," • ",new Date(a.createdAt).toLocaleDateString()]})]}),e.jsxs("div",{className:`text-lg font-black ${a.overallScore>=70?"text-green-400":a.overallScore>=50?"text-yellow-400":"text-red-400"}`,children:[a.overallScore,"%"]})]},a._id))})]}):null}export{Fe as default};

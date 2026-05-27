import{a as v,j as e,z as m}from"./index-CFUsAbVm.js";import{d as n}from"./vendor-B1kLmpHA.js";import{D as H,X as J}from"./DashboardLayout-Djhf_-5p.js";import{m as h,A as Q}from"./motion-BWH5FWdq.js";import{B as M}from"./brain-CGZCLjja.js";import{P as K}from"./plus-DeNwIv9f.js";import{Z}from"./zap-xE1OFUDr.js";import{D as B}from"./download-KjjVHVxM.js";import{C as _}from"./check-circle-BOWEx3kM.js";import{T as V}from"./trending-up-A1IdKE_p.js";import{T as q,B as ee}from"./target-BsjTdEz1.js";import{G as y}from"./graduation-cap-ItbQkGPu.js";import{E as O}from"./external-link-DQlEU3L4.js";import"./user-BeVLiey5.js";const se=["HTML","CSS","JavaScript","React","Node.js","Python","Java","SQL","MongoDB","Git","TypeScript","Express.js","PHP","Django","Flutter","Android","Machine Learning","Data Analysis","Figma","Adobe XD"],ae=[{value:"fresher",label:"Fresher (0 years)"},{value:"junior",label:"Junior (1-2 years)"},{value:"mid",label:"Mid Level (3-5 years)"},{value:"senior",label:"Senior (5+ years)"}],te=["Frontend Developer","Backend Developer","Full Stack Developer","Mobile Developer","Data Analyst","Machine Learning Engineer","DevOps Engineer","UI/UX Designer","QA Engineer","Product Manager"],N={high:"text-red-400 bg-red-500/10 border-red-500/30",medium:"text-yellow-400 bg-yellow-500/10 border-yellow-500/30",low:"text-green-400 bg-green-500/10 border-green-500/30"};function je(){var P,A,L,T,F,I;const[o,u]=n.useState([]),[w,k]=n.useState(""),[f,S]=n.useState(""),[b,$]=n.useState("fresher"),[C,z]=n.useState(!1),[r,R]=n.useState(null),[re,W]=n.useState(null),[x,E]=n.useState([]);n.useEffect(()=>{v.get("/career/skills/profile").then(s=>{var a,l;if(s.data.profile){W(s.data.profile),u(((a=s.data.profile.currentSkills)==null?void 0:a.map(d=>d.name))||[]),S(s.data.profile.targetRole||""),$(s.data.profile.experienceLevel||"fresher");const i=((l=s.data.profile.learningRoadmap)==null?void 0:l.filter(d=>d.completed).map((d,g)=>g))||[];E(i)}}).catch(()=>{})},[]);const j=s=>{const a=(typeof s=="string"?s:w).trim();if(a){if(o.includes(a))return m.error("Skill already added");u(l=>[...l,a]),k("")}},Y=s=>u(a=>a.filter(l=>l!==s)),U=async()=>{var s,a;if(!o.length)return m.error("Add at least one skill");z(!0),R(null);try{const{data:l}=await v.post("/career/skills/analyze",{skills:o,targetRole:f,experienceLevel:b});R(l.result),m.success("Skill analysis complete! 🎯")}catch(l){m.error(((a=(s=l.response)==null?void 0:s.data)==null?void 0:a.message)||"Analysis failed. Check your connection.")}finally{z(!1)}},X=async s=>{try{await v.put("/career/skills/roadmap/complete",{skillIndex:s}),E(a=>[...a,s]),m.success("Marked as complete! 🎉")}catch{}},D=()=>{var a,l,i,d,g,G;if(!r)return;const s=window.open("","_blank");s.document.write(`
      <!DOCTYPE html><html><head>
      <title>Skill Analysis Report</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:800px;margin:0 auto;background:#fff;color:#1a1a2e}
        h1{color:#6366f1;font-size:26px;margin-bottom:4px}
        h2{color:#4f46e5;font-size:16px;margin:24px 0 8px;border-bottom:2px solid #e0e7ff;padding-bottom:6px}
        p,li{color:#4b5563;font-size:13px;line-height:1.7}
        .meta{color:#6b7280;font-size:12px;margin-bottom:20px}
        .score{font-size:36px;font-weight:800;color:#6366f1}
        .summary{background:#f5f3ff;border-left:4px solid #6366f1;padding:12px 16px;border-radius:4px;margin:8px 0}
        .strength{background:#f0fdf4;border-left:4px solid #10b981;padding:8px 14px;border-radius:4px;margin:4px 0;font-size:13px;color:#065f46}
        .gap{padding:10px 14px;border-radius:6px;margin:6px 0;border:1px solid #e5e7eb}
        .gap.high{background:#fef2f2;border-color:#fca5a5}
        .gap.medium{background:#fffbeb;border-color:#fcd34d}
        .gap.low{background:#f0fdf4;border-color:#86efac}
        .gap-title{font-weight:700;font-size:13px;color:#111}
        .gap-reason{font-size:12px;color:#6b7280;margin-top:2px}
        .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;margin-left:8px}
        .badge.high{background:#fee2e2;color:#dc2626}
        .badge.medium{background:#fef3c7;color:#d97706}
        .badge.low{background:#dcfce7;color:#16a34a}
        .path{background:#eff6ff;border:1px solid #bfdbfe;padding:10px 14px;border-radius:6px;margin:6px 0}
        .path-title{font-weight:700;font-size:13px;color:#1d4ed8}
        .path-score{float:right;font-weight:800;color:#059669}
        .step{display:flex;gap:10px;padding:8px;background:#f9fafb;border-radius:6px;margin:5px 0;align-items:flex-start}
        .step-num{background:#6366f1;color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .course{background:#faf5ff;border:1px solid #e9d5ff;padding:8px 12px;border-radius:6px;margin:4px 0;font-size:12px}
        .course-name{font-weight:600;color:#7c3aed}
        .course-meta{color:#9ca3af;font-size:11px}
        .next-step{padding:6px 12px;background:#f0fdf4;border-left:3px solid #10b981;border-radius:4px;margin:4px 0;font-size:13px;color:#065f46}
        ul{padding-left:20px}
        @media print{body{padding:16px}}
      </style></head><body>
      <h1>🧠 Skill Analysis Report</h1>
      <div class="meta">
        <strong>Skills:</strong> ${o.join(", ")} &nbsp;|&nbsp;
        <strong>Target Role:</strong> ${f||"Not specified"} &nbsp;|&nbsp;
        <strong>Experience:</strong> ${b}<br/>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>

      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
        <div class="score">${r.overallReadiness}%</div>
        <div>
          <div style="font-weight:700;font-size:16px;color:#111">Overall Career Readiness</div>
          <div style="color:#6b7280;font-size:13px">for ${f||"your target role"}</div>
        </div>
      </div>

      <div class="summary">${r.summary}</div>

      ${(a=r.strengths)!=null&&a.length?`
        <h2>✅ Your Strengths</h2>
        ${r.strengths.map(t=>`<div class="strength">✓ ${t}</div>`).join("")}
      `:""}

      ${(l=r.careerPaths)!=null&&l.length?`
        <h2>🚀 Recommended Career Paths</h2>
        ${r.careerPaths.map(t=>`
          <div class="path">
            <span class="path-title">${t.role}</span>
            <span class="path-score">${t.matchScore}% match</span>
            <div style="clear:both;margin-top:4px;font-size:12px;color:#4b5563">${t.description}</div>
            <div style="font-size:12px;color:#6366f1;margin-top:2px">💰 ${t.avgSalary}</div>
          </div>
        `).join("")}
      `:""}

      ${(i=r.skillGaps)!=null&&i.length?`
        <h2>🎯 Skill Gaps to Fill</h2>
        ${r.skillGaps.map(t=>{var c;return`
          <div class="gap ${t.priority}">
            <div class="gap-title">${t.skill}<span class="badge ${t.priority}">${t.priority}</span></div>
            <div class="gap-reason">${t.reason}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px">⏱ ~${t.estimatedWeeks} weeks to learn</div>
            ${(c=t.courses)!=null&&c.length?`<div style="margin-top:6px;font-size:11px;color:#6b7280">Courses: ${t.courses.map(p=>p.name||p).join(", ")}</div>`:""}
          </div>
        `}).join("")}
      `:""}

      ${(d=r.learningRoadmap)!=null&&d.length?`
        <h2>📚 Learning Roadmap</h2>
        ${r.learningRoadmap.map((t,c)=>{var p;return`
          <div class="step">
            <div class="step-num">${t.step||c+1}</div>
            <div>
              <div style="font-weight:600;font-size:13px;color:#111">${t.skill}</div>
              <div style="font-size:11px;color:#9ca3af">⏱ ${t.weeks} weeks &nbsp;|&nbsp; Resources: ${(p=t.resources)==null?void 0:p.join(", ")}</div>
            </div>
          </div>
        `}).join("")}
      `:""}

      ${(g=r.suggestedCourses)!=null&&g.length?`
        <h2>🎓 Suggested Courses</h2>
        ${r.suggestedCourses.map(t=>`
          <div class="course">
            <div class="course-name">${t.name}</div>
            <div class="course-meta">${t.platform} &nbsp;·&nbsp; ${t.duration} &nbsp;·&nbsp; ${t.free?"Free":"Paid"} &nbsp;·&nbsp; ${t.url}</div>
          </div>
        `).join("")}
      `:""}

      ${(G=r.nextSteps)!=null&&G.length?`
        <h2>⚡ Your Next Steps</h2>
        ${r.nextSteps.map((t,c)=>`<div class="next-step">${c+1}. ${t}</div>`).join("")}
      `:""}

      <p style="margin-top:32px;color:#9ca3af;font-size:11px;text-align:center">Generated by CareerIQ AI Platform</p>
      </body></html>
    `),s.document.close(),s.focus(),setTimeout(()=>{s.print(),s.close()},500)};return e.jsx(H,{children:e.jsxs("div",{className:"max-w-5xl mx-auto space-y-6",children:[e.jsxs(h.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-500/30",children:e.jsx(M,{className:"w-7 h-7 text-white"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-black text-white",children:"Skill Analysis Agent"}),e.jsx("p",{className:"text-slate-400 text-sm",children:"AI-powered career gap analysis and learning roadmap"})]})]}),e.jsxs(h.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.1},className:"glass-card p-6 space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-2 block",children:"Your Current Skills"}),e.jsxs("div",{className:"flex gap-2 mb-3",children:[e.jsx("input",{value:w,onChange:s=>k(s.target.value),onKeyDown:s=>s.key==="Enter"&&j(),placeholder:"Type a skill and press Enter...",className:"input-field flex-1"}),e.jsx(h.button,{onClick:()=>j(),whileTap:{scale:.95},className:"btn-primary px-4 py-2",children:e.jsx(K,{className:"w-5 h-5"})})]}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-3",children:se.filter(s=>!o.includes(s)).map(s=>e.jsxs("button",{onClick:()=>j(s),className:"text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all",children:["+ ",s]},s))}),o.length>0&&e.jsx("div",{className:"flex flex-wrap gap-2",children:o.map(s=>e.jsxs("span",{className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 text-sm",children:[s,e.jsx("button",{onClick:()=>Y(s),className:"hover:text-red-400 transition-colors",children:e.jsx(J,{className:"w-3 h-3"})})]},s))})]}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-2 block",children:"Target Role"}),e.jsxs("select",{value:f,onChange:s=>S(s.target.value),className:"input-field",children:[e.jsx("option",{value:"",children:"Select target role..."}),te.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-300 font-medium mb-2 block",children:"Experience Level"}),e.jsx("select",{value:b,onChange:s=>$(s.target.value),className:"input-field",children:ae.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))})]})]}),e.jsx(h.button,{onClick:U,disabled:C||!o.length,whileHover:{scale:1.01},whileTap:{scale:.99},className:"btn-primary w-full flex items-center justify-center gap-2",children:C?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"})," Analyzing your profile..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Z,{className:"w-5 h-5"})," Analyze Skills with AI"]})})]}),e.jsx(Q,{children:r&&e.jsxs(h.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"space-y-5",children:[e.jsx("div",{className:"flex justify-end",children:e.jsxs("button",{onClick:D,className:"btn-ghost flex items-center gap-2 text-sm",children:[e.jsx(B,{className:"w-4 h-4"})," Download PDF Report"]})}),e.jsxs("div",{className:"glass-card p-6 border-l-4 border-primary-500",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx(M,{className:"w-6 h-6 text-primary-400"}),e.jsx("h2",{className:"text-white font-bold text-lg",children:"AI Analysis Summary"}),e.jsxs("span",{className:"ml-auto text-2xl font-black text-primary-400",children:[r.overallReadiness,"%"]})]}),e.jsx("p",{className:"text-slate-300 leading-relaxed",children:r.summary}),e.jsx("div",{className:"mt-3 flex flex-wrap gap-2",children:(P=r.strengths)==null?void 0:P.map(s=>e.jsxs("span",{className:"flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg",children:[e.jsx(_,{className:"w-3 h-3"})," ",s]},s))})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h2",{className:"text-white font-bold mb-4 flex items-center gap-2",children:[e.jsx(V,{className:"w-5 h-5 text-accent-green"})," Recommended Career Paths"]}),e.jsx("div",{className:"space-y-3",children:(A=r.careerPaths)==null?void 0:A.map(s=>e.jsxs("div",{className:"flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"text-white font-semibold",children:s.role}),e.jsxs("span",{className:"text-accent-green text-sm font-bold",children:[s.matchScore,"% match"]})]}),e.jsx("p",{className:"text-slate-400 text-xs mb-2",children:s.description}),e.jsxs("p",{className:"text-primary-400 text-xs",children:["💰 ",s.avgSalary]})]}),e.jsx("div",{className:"w-16 h-16 flex-shrink-0",children:e.jsxs("svg",{viewBox:"0 0 40 40",className:"w-full h-full -rotate-90",children:[e.jsx("circle",{cx:"20",cy:"20",r:"16",fill:"none",stroke:"rgba(255,255,255,0.1)",strokeWidth:"4"}),e.jsx("circle",{cx:"20",cy:"20",r:"16",fill:"none",stroke:"#10b981",strokeWidth:"4",strokeDasharray:`${s.matchScore} 100`,strokeLinecap:"round"})]})})]},s.role))})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h2",{className:"text-white font-bold mb-4 flex items-center gap-2",children:[e.jsx(q,{className:"w-5 h-5 text-accent-yellow"})," Skill Gaps to Fill"]}),e.jsx("div",{className:"grid sm:grid-cols-2 gap-3",children:(L=r.skillGaps)==null?void 0:L.map(s=>{var a;return e.jsxs("div",{className:`p-4 rounded-xl border ${N[s.priority]||N.medium}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-semibold text-white",children:s.skill}),e.jsx("span",{className:`text-xs capitalize px-2 py-0.5 rounded-full border ${N[s.priority]}`,children:s.priority})]}),e.jsx("p",{className:"text-slate-400 text-xs mb-1",children:s.reason}),e.jsxs("p",{className:"text-slate-500 text-xs",children:["⏱ ~",s.estimatedWeeks," weeks to learn"]}),((a=s.courses)==null?void 0:a.length)>0&&e.jsxs("div",{className:"mt-2 pt-2 border-t border-white/10",children:[e.jsxs("p",{className:"text-xs text-slate-500 mb-1 flex items-center gap-1",children:[e.jsx(y,{className:"w-3 h-3"})," Suggested Courses:"]}),e.jsx("div",{className:"space-y-1",children:s.courses.map((l,i)=>e.jsxs("a",{href:l.url||"#",target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors",children:[e.jsx(O,{className:"w-3 h-3 flex-shrink-0"}),e.jsx("span",{className:"truncate",children:l.name||l}),l.platform&&e.jsxs("span",{className:"text-slate-600 ml-auto flex-shrink-0",children:["(",l.platform,")"]})]},i))})]})]},s.skill)})})]}),((T=r.suggestedCourses)==null?void 0:T.length)>0&&e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h2",{className:"text-white font-bold mb-4 flex items-center gap-2",children:[e.jsx(y,{className:"w-5 h-5 text-accent-purple"})," Recommended Courses to Improve"]}),e.jsx("div",{className:"grid sm:grid-cols-2 gap-3",children:r.suggestedCourses.map((s,a)=>e.jsxs("a",{href:s.url||"#",target:"_blank",rel:"noopener noreferrer",className:"flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-primary-500/30 transition-all group",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center flex-shrink-0",children:e.jsx(y,{className:"w-5 h-5 text-accent-purple"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-white font-semibold text-sm group-hover:text-primary-300 transition-colors",children:s.name}),e.jsx("p",{className:"text-slate-500 text-xs",children:s.platform}),s.duration&&e.jsxs("p",{className:"text-slate-600 text-xs mt-0.5",children:["⏱ ",s.duration]}),s.free!==void 0&&e.jsx("span",{className:`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${s.free?"bg-green-500/10 text-green-400":"bg-yellow-500/10 text-yellow-400"}`,children:s.free?"Free":"Paid"})]}),e.jsx(O,{className:"w-4 h-4 text-slate-600 group-hover:text-primary-400 flex-shrink-0 mt-0.5 transition-colors"})]},a))})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h2",{className:"text-white font-bold mb-4 flex items-center gap-2",children:[e.jsx(ee,{className:"w-5 h-5 text-accent-cyan"})," Learning Roadmap"]}),e.jsx("div",{className:"space-y-3",children:(F=r.learningRoadmap)==null?void 0:F.map((s,a)=>{var l;return e.jsxs("div",{className:`flex gap-4 p-4 rounded-xl border transition-all ${x.includes(a)?"bg-green-500/10 border-green-500/30":"bg-white/5 border-white/8"}`,children:[e.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                        ${x.includes(a)?"bg-green-500 text-white":"bg-primary-500/30 text-primary-400"}`,children:x.includes(a)?e.jsx(_,{className:"w-4 h-4"}):s.step}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:`font-semibold ${x.includes(a)?"text-green-400 line-through":"text-white"}`,children:s.skill}),e.jsxs("span",{className:"text-slate-500 text-xs",children:[s.weeks,"w"]})]}),e.jsx("div",{className:"flex flex-wrap gap-1 mt-1",children:(l=s.resources)==null?void 0:l.map(i=>e.jsx("span",{className:"text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded",children:i},i))})]}),!x.includes(a)&&e.jsx("button",{onClick:()=>X(a),className:"text-xs text-slate-500 hover:text-green-400 transition-colors flex-shrink-0",children:"Mark done"})]},a)})})]}),e.jsxs("div",{className:"glass-card p-6 border border-accent-green/20",children:[e.jsx("h2",{className:"text-white font-bold mb-3",children:"🚀 Your Next Steps"}),e.jsx("div",{className:"space-y-2",children:(I=r.nextSteps)==null?void 0:I.map((s,a)=>e.jsxs("div",{className:"flex items-center gap-3 p-2 rounded-lg",children:[e.jsx("span",{className:"w-6 h-6 rounded-full bg-accent-green/20 text-accent-green text-xs flex items-center justify-center font-bold",children:a+1}),e.jsx("span",{className:"text-slate-300 text-sm",children:s})]},a))})]}),e.jsxs("button",{onClick:D,className:"btn-primary w-full flex items-center justify-center gap-2",children:[e.jsx(B,{className:"w-4 h-4"})," Download Full Analysis PDF"]})]})})]})})}export{je as default};

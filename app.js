(() => {
  const routine = window.GYM_COMPANION_ROUTINE;
  const state = JSON.parse(localStorage.getItem('gym-companion-v2') || '{}');
  let dayIndex = Math.min(new Date().getDay() || 1, 6) - 1;
  let timerId = null, remaining = 0, activeTimer = null;
  const $ = id => document.getElementById(id);
  const key = (...parts) => parts.join(':');
  const save = () => localStorage.setItem('gym-companion-v2', JSON.stringify(state));
  const dateFor = index => { const d = new Date(), target = index + 1, delta = (target - d.getDay() + 7) % 7; d.setDate(d.getDate() + (d.getDay() === 0 && index === 0 ? 1 : delta)); return d; };
  const format = seconds => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
  const validate = () => {
    const errors=[]; routine.forEach(day => {
      ['warmup','finish'].forEach(phase => { const group=day[phase]; if(!group?.total || !Array.isArray(group.steps) || !group.steps.length) errors.push(`${day.day} ${phase}`); group?.steps.forEach(step => { if(!step.title || !step.duration || typeof step.seconds !== 'number') errors.push(`${day.day} ${phase} step`); }); });
      day.slots.forEach((slot,i)=>{const options=[slot.primary,slot.alternative,slot.third].filter(Boolean);if(options.length<2||new Set(options.map(o=>o.image)).size!==options.length)errors.push(`${day.day} slot ${i+1}`);options.forEach(o=>{const image=new Image();image.onerror=()=>console.warn(`Missing asset: ${o.image}`);image.src=o.image;});});
    }); if(errors.length)console.error('Routine validation failed:',errors);
  };
  function renderTimer(){ const timer=$('timer'); if(!activeTimer){timer.hidden=true;return;} timer.hidden=false; $('timerLabel').textContent=activeTimer; $('timerValue').textContent=format(remaining); }
  function stopTimer(){clearInterval(timerId);timerId=null;activeTimer=null;remaining=0;renderTimer();}
  function startTimer(label, seconds){clearInterval(timerId);activeTimer=label;remaining=seconds;renderTimer();timerId=setInterval(()=>{remaining=Math.max(0,remaining-1);renderTimer();if(!remaining)stopTimer();},1000);}
  const phase = (day, name, label) => { const group=day[name]; return `<section class="phase card" data-phase="${name}"><button class="phase-head" data-toggle="${name}" aria-expanded="true"><span><b>${label}</b><small>${group.total}</small></span><span>⌄</span></button><div class="phase-body">${group.steps.map((step,index)=>{const done=state[key(day.day,name,index)]?.done;return `<label class="step ${done?'done':''}"><input type="checkbox" data-phase-done="${name}" data-step="${index}" ${done?'checked':''}><span><b>${step.title}</b><small>${step.duration} · ${step.cue}</small></span>${step.seconds?`<button type="button" class="timer-btn" data-timer-phase="${name}" data-timer-step="${index}">Start</button>`:''}</label>`;}).join('')}</div></section>`; };
  function render(){
    const day=routine[dayIndex], date=dateFor(dayIndex);
    $('date').textContent=date.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    $('days').innerHTML=routine.map((item,i)=>`<button class="day ${i===dayIndex?'active':''}" data-day="${i}"><b>${item.day.slice(0,3)}</b><small>${item.focus}</small></button>`).join('');
    $('head').innerHTML=`<div class="eyebrow">${date.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</div><h1>${day.focus}</h1><span class="tag">${day.time} · Complete the flow</span>`;
    $('guided').innerHTML=phase(day,'warmup','Warm-up');
    $('slots').innerHTML=day.slots.map((slot,index)=>{const choices=[slot.primary,slot.alternative,slot.third].filter(Boolean), saved=state[key(day.day,'slot',index)]||{}, chosen=Math.min(saved.choice ?? 0,choices.length-1), choice=choices[chosen];return `<article class="card workout-slot"><div class="slot-head"><span class="num">${String(index+1).padStart(2,'0')}</span><div><b>${choice.name}</b><small>${slot.scheme}</small></div><input type="checkbox" data-slot-done="${index}" aria-label="Mark ${choice.name} complete" ${saved.done?'checked':''}></div><div class="option-pills" role="radiogroup" aria-label="Exercise variations">${choices.map((item,i)=>`<button class="pill ${i===chosen?'selected':''}" data-choice="${index}" data-choice-index="${i}" role="radio" aria-checked="${i===chosen}">${i===0?'Primary':i===1?'Variation':'Cardio option'}</button>`).join('')}</div><div class="selected-exercise"><div class="visual" role="img" aria-label="${choice.name} exercise illustration" style="background-image:url('${choice.image}')"></div><div><h2>${choice.name}</h2><p>${slot.cue}</p><span>${slot.scheme}</span></div></div></article>`;}).join('');
    $('finish').innerHTML=phase(day,'finish','Recovery finish');
    const mainDone=day.slots.filter((_,i)=>state[key(day.day,'slot',i)]?.done).length, phaseSteps=[...day.warmup.steps,...day.finish.steps], phaseDone=['warmup','finish'].reduce((n,name)=>n+day[name].steps.filter((_,i)=>state[key(day.day,name,i)]?.done).length,0), total=day.slots.length+phaseSteps.length;
    $('score').textContent=`${mainDone}/${day.slots.length} exercises · ${phaseDone}/${phaseSteps.length} guided steps`;
    $('bar').style.width=`${(mainDone+phaseDone)/total*100}%`; save(); renderTimer();
  }
  document.addEventListener('click', event => {
    const dayButton=event.target.closest('[data-day]');if(dayButton){dayIndex=Number(dayButton.dataset.day);stopTimer();render();return;}
    const choice=event.target.closest('[data-choice]');if(choice){const day=routine[dayIndex], index=choice.dataset.choice;state[key(day.day,'slot',index)]={...(state[key(day.day,'slot',index)]||{}),choice:Number(choice.dataset.choiceIndex)};render();return;}
    const toggle=event.target.closest('[data-toggle]');if(toggle){const body=toggle.parentElement.querySelector('.phase-body'), open=!body.hidden;body.hidden=open;toggle.setAttribute('aria-expanded',String(!open));return;}
    const timer=event.target.closest('[data-timer-phase]');if(timer){const day=routine[dayIndex], step=day[timer.dataset.timerPhase].steps[Number(timer.dataset.timerStep)];startTimer(step.title,step.seconds);return;}
    if(event.target.id==='stopTimer')stopTimer();if(event.target.id==='print')window.print();if(event.target.id==='reset'&&confirm('Reset all V2 choices and checkmarks?')){Object.keys(state).forEach(k=>delete state[k]);localStorage.removeItem('gym-companion-v2');stopTimer();render();}
  });
  document.addEventListener('change', event => {const day=routine[dayIndex];if(event.target.dataset.slotDone!==undefined){const i=event.target.dataset.slotDone;state[key(day.day,'slot',i)]={...(state[key(day.day,'slot',i)]||{}),done:event.target.checked};}if(event.target.dataset.phaseDone){const phaseName=event.target.dataset.phaseDone,i=event.target.dataset.step;state[key(day.day,phaseName,i)]={done:event.target.checked};}render();});
  validate();render();
})();

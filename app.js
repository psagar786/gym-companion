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
  const guidedOption = (day, phaseName, stepIndex, step) => step.choices ? step.choices[Math.min(state[key(day.day,phaseName,stepIndex)]?.choice ?? 0, step.choices.length - 1)] : step;
  const validate = () => {
    const errors = [], guidedImages = new Set();
    routine.forEach(day => {
      ['warmup','finish'].forEach(phaseName => {
        const group=day[phaseName];
        if(!group?.total || !Array.isArray(group.steps) || !group.steps.length) errors.push(`${day.day} ${phaseName}`);
        group?.steps.forEach((step, index) => {
          if(!step.title || !step.duration || typeof step.seconds !== 'number' || !step.image || !step.alt || !step.recommended) errors.push(`${day.day} ${phaseName} step ${index + 1}`);
          if(phaseName === 'warmup' && /(rower|treadmill|exercise bike|band |ramp-up|dumbbell|barbell|machine|cable)/i.test(`${step.title} ${step.cue}`)) errors.push(`${day.day} warm-up must be zero-equipment`);
          [step, ...(step.choices || [])].forEach(item => { if(!item?.image) errors.push(`${day.day} ${phaseName} image`); else guidedImages.add(item.image); });
        });
      });
      day.slots.forEach((slot,i) => {
        const options=[slot.primary,slot.alternative,slot.third].filter(Boolean);
        if(options.length<2 || new Set(options.map(o => o.image)).size !== options.length) errors.push(`${day.day} slot ${i+1}`);
      });
    });
    [...guidedImages].forEach(src => { const image=new Image(); image.onerror=()=>console.warn(`Missing guided asset: ${src}`); image.src=src; });
    if(errors.length) console.error('Routine validation failed:', errors); else console.info(`Gym Companion V2: ${guidedImages.size} guided assets validated.`);
  };
  function renderTimer(){ const timer=$('timer'); if(!activeTimer){timer.hidden=true;return;} timer.hidden=false; $('timerLabel').textContent=activeTimer; $('timerValue').textContent=format(remaining); }
  function stopTimer(){clearInterval(timerId);timerId=null;activeTimer=null;remaining=0;renderTimer();}
  function startTimer(label, seconds){clearInterval(timerId);activeTimer=label;remaining=seconds;renderTimer();timerId=setInterval(()=>{remaining=Math.max(0,remaining-1);renderTimer();if(!remaining)stopTimer();},1000);}
  function phase(day, phaseName, label) {
    const group = day[phaseName], journeyKey = key(day.day, phaseName, 'journey'), current = Math.min(state[journeyKey] ?? 0, group.steps.length - 1);
    const step = group.steps[current], saved = state[key(day.day,phaseName,current)] || {}, choice = guidedOption(day, phaseName, current, step), done = saved.done;
    const choices = step.choices?.map((item,index) => `<button class="pill ${choice.name===item.name?'selected':''}" data-guided-choice="${phaseName}" data-guided-step="${current}" data-guided-choice-index="${index}" role="radio" aria-checked="${choice.name===item.name}">${item.name}</button>`).join('') || '';
    return `<section class="phase card" data-phase="${phaseName}">
      <button class="phase-head" data-toggle="${phaseName}" aria-expanded="true"><span><b>${label} <em>Recommended</em></b><small>${group.total} · optional</small></span><span>⌄</span></button>
      <div class="phase-body"><div class="journey-progress" aria-label="${label} step ${current + 1} of ${group.steps.length}">${group.steps.map((item,index)=>`<button class="journey-dot ${index===current?'active':''} ${state[key(day.day,phaseName,index)]?.done?'done':''}" data-journey="${phaseName}" data-journey-index="${index}" aria-label="View ${item.title}">${index + 1}</button>`).join('')}</div>
      <article class="journey-card"><div class="journey-visual" role="img" aria-label="${choice.alt || step.alt}" style="background-image:url('${choice.image || step.image}')"></div><div class="journey-copy"><span class="journey-count">${current + 1} / ${group.steps.length}</span><h2>${choice.name || step.title}</h2><p>${step.cue}</p><span class="journey-duration">${step.duration}</span>${choices ? `<div class="option-pills guided-options" role="radiogroup" aria-label="Recovery cardio choice">${choices}</div>` : ''}</div></article>
      <div class="journey-actions"><label class="guided-check ${done?'done':''}"><input type="checkbox" data-phase-done="${phaseName}" data-step="${current}" ${done?'checked':''}> Done</label>${step.seconds ? `<button type="button" class="timer-btn" data-timer-phase="${phaseName}" data-timer-step="${current}">Start timer</button>` : ''}<span></span><button type="button" class="journey-nav" data-journey-nav="${phaseName}" data-direction="-1" ${current===0?'disabled':''}>Previous</button><button type="button" class="journey-nav" data-journey-nav="${phaseName}" data-direction="1" ${current===group.steps.length-1?'disabled':''}>Next</button></div></div></section>`;
  }
  function render(){
    const day=routine[dayIndex], date=dateFor(dayIndex);
    $('date').textContent=date.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    $('days').innerHTML=routine.map((item,i)=>`<button class="day ${i===dayIndex?'active':''}" data-day="${i}"><b>${item.day.slice(0,3)}</b><small>${item.focus}</small></button>`).join('');
    $('head').innerHTML=`<div class="eyebrow">${date.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</div><h1>${day.focus}</h1><span class="tag">${day.time} · Complete the flow</span>`;
    $('guided').innerHTML=phase(day,'warmup','Warm-up');
    $('slots').innerHTML=day.slots.map((slot,index)=>{const choices=[slot.primary,slot.alternative,slot.third].filter(Boolean), saved=state[key(day.day,'slot',index)]||{}, chosen=Math.min(saved.choice ?? 0,choices.length-1), choice=choices[chosen];return `<article class="card workout-slot"><div class="slot-head"><span class="num">${String(index+1).padStart(2,'0')}</span><div><b>${choice.name}</b><small>${slot.scheme}</small></div><input type="checkbox" data-slot-done="${index}" aria-label="Mark ${choice.name} complete" ${saved.done?'checked':''}></div><div class="option-pills" role="radiogroup" aria-label="Exercise variations">${choices.map((item,i)=>`<button class="pill ${i===chosen?'selected':''}" data-choice="${index}" data-choice-index="${i}" role="radio" aria-checked="${i===chosen}">${i===0?'Primary':i===1?'Variation':'Cardio option'}</button>`).join('')}</div><div class="selected-exercise"><div class="visual" role="img" aria-label="${choice.name} exercise illustration" style="background-image:url('${choice.image}')"></div><div><h2>${choice.name}</h2><p>${slot.cue}</p><span>${slot.scheme}</span></div></div></article>`;}).join('');
    $('finish').innerHTML=phase(day,'finish','Recovery finish');
    const mainDone=day.slots.filter((_,i)=>state[key(day.day,'slot',i)]?.done).length;
    const warmupDone=day.warmup.steps.filter((_,i)=>state[key(day.day,'warmup',i)]?.done).length, finishDone=day.finish.steps.filter((_,i)=>state[key(day.day,'finish',i)]?.done).length;
    $('score').textContent=`${mainDone}/${day.slots.length} workout exercises`;
    $('recommendedScore').textContent=`Recommended: warm-up ${warmupDone}/${day.warmup.steps.length} · recovery ${finishDone}/${day.finish.steps.length}`;
    $('bar').style.width=`${mainDone/day.slots.length*100}%`; save(); renderTimer();
  }
  document.addEventListener('click', event => {
    const dayButton=event.target.closest('[data-day]'); if(dayButton){dayIndex=Number(dayButton.dataset.day);stopTimer();render();return;}
    const choice=event.target.closest('[data-choice]'); if(choice){const day=routine[dayIndex], index=choice.dataset.choice;state[key(day.day,'slot',index)]={...(state[key(day.day,'slot',index)]||{}),choice:Number(choice.dataset.choiceIndex)};render();return;}
    const guidedChoice=event.target.closest('[data-guided-choice]'); if(guidedChoice){const day=routine[dayIndex], phaseName=guidedChoice.dataset.guidedChoice, index=guidedChoice.dataset.guidedStep;state[key(day.day,phaseName,index)]={...(state[key(day.day,phaseName,index)]||{}),choice:Number(guidedChoice.dataset.guidedChoiceIndex)};render();return;}
    const jump=event.target.closest('[data-journey]'); if(jump){const day=routine[dayIndex];state[key(day.day,jump.dataset.journey,'journey')]=Number(jump.dataset.journeyIndex);render();return;}
    const navigate=event.target.closest('[data-journey-nav]'); if(navigate){const day=routine[dayIndex], phaseName=navigate.dataset.journeyNav, group=day[phaseName], current=state[key(day.day,phaseName,'journey')] ?? 0;state[key(day.day,phaseName,'journey')]=Math.max(0,Math.min(group.steps.length-1,current+Number(navigate.dataset.direction)));render();return;}
    const toggle=event.target.closest('[data-toggle]'); if(toggle){const body=toggle.parentElement.querySelector('.phase-body'), open=!body.hidden;body.hidden=open;toggle.setAttribute('aria-expanded',String(!open));return;}
    const timer=event.target.closest('[data-timer-phase]'); if(timer){const day=routine[dayIndex], phaseName=timer.dataset.timerPhase, index=Number(timer.dataset.timerStep), step=day[phaseName].steps[index], choice=guidedOption(day,phaseName,index,step);startTimer(choice.name || step.title,step.seconds);return;}
    if(event.target.id==='stopTimer')stopTimer(); if(event.target.id==='print')window.print(); if(event.target.id==='reset'&&confirm('Reset all V2 choices and checkmarks?')){Object.keys(state).forEach(k=>delete state[k]);localStorage.removeItem('gym-companion-v2');stopTimer();render();}
  });
  document.addEventListener('change', event => {const day=routine[dayIndex];if(event.target.dataset.slotDone!==undefined){const i=event.target.dataset.slotDone;state[key(day.day,'slot',i)]={...(state[key(day.day,'slot',i)]||{}),done:event.target.checked};}if(event.target.dataset.phaseDone){const phaseName=event.target.dataset.phaseDone,i=event.target.dataset.step;state[key(day.day,phaseName,i)]={...(state[key(day.day,phaseName,i)]||{}),done:event.target.checked};}render();});
  validate();render();
})();

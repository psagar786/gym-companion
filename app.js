(() => {
  const routine = window.GYM_COMPANION_ROUTINE;
  const state = JSON.parse(localStorage.getItem('gym-companion') || '{}');
  let dayIndex = Math.min(new Date().getDay() || 1, 6) - 1;
  const $ = id => document.getElementById(id);
  const key = (day, slot) => `${day.day}-${slot}`;
  const save = () => localStorage.setItem('gym-companion', JSON.stringify(state));
  const dateFor = index => { const d = new Date(), target = index + 1, delta = (target - d.getDay() + 7) % 7; d.setDate(d.getDate() + (d.getDay() === 0 && index === 0 ? 1 : delta)); return d; };
  const validate = () => {
    const errors = [];
    routine.forEach(day => day.slots.forEach((slot, i) => {
      const options = [slot.primary, slot.alternative, slot.third].filter(Boolean);
      if (options.length < 2 || new Set(options.map(o => o.image)).size !== options.length) errors.push(`${day.day} slot ${i + 1}`);
      options.forEach(option => { if (!option.name || !option.image) errors.push(`${day.day}: invalid option`); const image = new Image(); image.onerror = () => console.warn(`Missing asset: ${option.image}`); image.src = option.image; });
    }));
    if (errors.length) console.error('Routine validation failed:', errors);
  };
  function render() {
    const day = routine[dayIndex], date = dateFor(dayIndex);
    $('date').textContent = date.toLocaleDateString(undefined, {weekday:'short', day:'numeric', month:'short', year:'numeric'});
    $('days').innerHTML = routine.map((item, i) => `<button class="day ${i === dayIndex ? 'active' : ''}" data-day="${i}"><b>${item.day}</b><small>${item.focus}</small></button>`).join('');
    $('head').innerHTML = `<div class="eyebrow">${date.toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'long'})}</div><h1>${day.focus}</h1><span class="tag">${day.time} · Pick one option per slot</span>`;
    $('warm').innerHTML = `<b>Warm-up / 7–10 minutes</b><p>${day.warm}</p>`;
    $('slots').innerHTML = day.slots.map((slot, index) => {
      const saved = state[key(day,index)] || {}, choices = [slot.primary, slot.alternative, slot.third].filter(Boolean);
      const options = choices.map((choice, choiceIndex) => `<label class="option"><input type="radio" name="slot${index}" data-choice="${index}" value="${choiceIndex}" ${(saved.choice == null ? choiceIndex === 0 : saved.choice === choiceIndex) ? 'checked' : ''}><div class="visual" role="img" aria-label="${choice.name} exercise illustration" style="background-image:url('${choice.image}')"></div><b>${choice.name}</b><span>${choiceIndex === 0 ? slot.scheme : 'Variation'}</span></label>`).join('');
      return `<article class="card slot"><div class="slot-top"><span class="num">${String(index + 1).padStart(2,'0')}</span><div><h2>Choose one</h2><small>${slot.scheme}</small></div><input type="checkbox" data-done="${index}" aria-label="Mark slot ${index + 1} complete" ${saved.done ? 'checked' : ''}></div><div class="options" style="--count:${choices.length}">${options}</div></article>`;
    }).join('');
    $('finish').innerHTML = `<h2>Finish</h2><p>${day.finish}</p>`;
    const complete = day.slots.filter((_, index) => state[key(day,index)]?.done).length;
    $('score').textContent = `${complete} of ${day.slots.length} movement slots complete`;
    $('bar').style.width = `${complete / day.slots.length * 100}%`;
    save();
  }
  document.addEventListener('click', event => { const button = event.target.closest('[data-day]'); if (button) { dayIndex = Number(button.dataset.day); render(); } if (event.target.id === 'print') window.print(); if (event.target.id === 'reset' && confirm('Reset all saved choices and checkmarks?')) { Object.keys(state).forEach(k => delete state[k]); localStorage.removeItem('gym-companion'); render(); } });
  document.addEventListener('change', event => { const day = routine[dayIndex]; if (event.target.dataset.choice !== undefined) { const index = event.target.dataset.choice; state[key(day,index)] = {...state[key(day,index)], choice:Number(event.target.value)}; } if (event.target.dataset.done !== undefined) { const index = event.target.dataset.done; state[key(day,index)] = {...state[key(day,index)], done:event.target.checked}; } save(); render(); });
  validate(); render();
})();

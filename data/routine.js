/* Edit this file to update the active routine. Each option has an explicit, stable image path. */
(() => {
  const asset = name => `assets/exercises/${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}.png`;
  const option = name => ({name, image:asset(name)});
  const slot = (primary, alternative, scheme, cue, third) => ({primary:option(primary), alternative:option(alternative), third:third ? option(third) : null, scheme, cue});
  window.GYM_COMPANION_ROUTINE = [
    {day:'Monday',focus:'Back + Biceps',time:'65–75 min',warm:'5 min easy rower, band pull-aparts × 15, then two light pulldown sets.',slots:[
      slot('Pull-up','Band-assisted pull-up','3 × 6–10 · 120s','Use a full controlled range; keep ribs down.'),
      slot('Lat pulldown','Single-arm cable pulldown','3 × 8–12 · 90s','Drive elbows toward your pockets.'),
      slot('Chest-supported row','Machine row','3 × 8–12 · 90s','Keep your chest supported; pause at the squeeze.'),
      slot('Seated cable row','Barbell row','3 × 8–12 · 90s','Keep your torso still and pull elbows behind you.'),
      slot('Cable rear-delt fly','Incline dumbbell reverse fly','3 × 12–15 · 60s','Lead with elbows and keep traps relaxed.'),
      slot('Incline dumbbell curl','Cable curl','3 × 10–12 · 60s','Lower slowly; do not swing.'),
      slot('Hammer curl','Rope hammer curl','2 × 12–15 · 60s','Keep wrists neutral.')
    ],finish:'15–20 min incline treadmill walk, then 3 min easy cooldown.'},
    {day:'Tuesday',focus:'Chest + Triceps',time:'60–75 min',warm:'5 min easy cardio, shoulder circles, band work, and two light press sets.',slots:[
      slot('Incline dumbbell press','Incline machine press','3 × 6–10 · 120s','Keep shoulders packed and wrists over elbows.'),
      slot('Flat dumbbell press','Flat barbell press','3 × 8–12 · 90s','Control the descent and keep shoulder blades stable.'),
      slot('Cable fly','Dumbbell fly','2 × 12–15 · 60s','Use a pain-free arc and keep ribs down.'),
      slot('Rope pressdown','Close-grip press','3 × 10–15 · 60s','Keep upper arms still.'),
      slot('Overhead cable extension','Single-dumbbell extension','2 × 12–15 · 60s','Keep ribs down and elbows forward.')
    ],finish:'5 min easy walk and gentle chest/shoulder mobility.'},
    {day:'Wednesday',focus:'Abs + Cardio',time:'55–65 min',warm:'5–7 min easy treadmill walk, gradually increasing pace.',slots:[
      slot('Treadmill run/walk intervals','Incline treadmill walk','20 min · steady effort','Choose the option that lets you recover for Thursday legs.','Exercise bike'),
      slot('Cable crunch','Reverse crunch','3 × 12–15 · 45–60s','Move through your trunk, not by pulling with arms.'),
      slot('Pallof press','Side plank','3 × 10/side or 30–45s · 45–60s','Brace and resist rotation.'),
      slot('Plank','Dead bug','3 × 30–45 sec · 45s','Keep ribs down and breathe steadily.')
    ],finish:'6 min: calf stretch, hip-flexor stretch, and thoracic rotations.'},
    {day:'Thursday',focus:'Legs + Calves',time:'65–75 min',warm:'5 min bike, ankle/hip mobility, bodyweight squats, and ramp-up sets.',slots:[
      slot('Back squat','Leg press','3 × 6–10 · 120s','Brace first; knees track over toes.'),
      slot('Bulgarian split squat','Walking lunge','3 × 8–10/leg · 90s','Stay tall and control the bottom.'),
      slot('Leg extension','Hip-abductor machine','3 × 12–15 · 60s','Pause briefly at the contracted position.'),
      slot('Romanian deadlift','Dumbbell RDL','3 × 8–10 · 120s','Push hips back and keep the weight close.'),
      slot('Seated leg curl','Lying leg curl','3 × 10–15 · 75s','Keep hips pinned and lower slowly.'),
      slot('Standing calf raise','Seated calf raise','3 × 12–15 · 60s','Use a full stretch and controlled pause.')
    ],finish:'3–5 min easy walk and light lower-body mobility.'},
    {day:'Friday',focus:'Shoulders + Arms',time:'60–70 min',warm:'5 min easy cardio, shoulder circles, and two light press sets.',slots:[
      slot('Seated dumbbell shoulder press','Seated shoulder press','3 × 8–12 · 90s','Stay tall; do not lean your ribs back.'),
      slot('Dumbbell lateral raise','Cable lateral raise','3 × 12–15 · 60s','Lead with elbows; stop before shrugging.'),
      slot('Cable rear-delt fly','Incline dumbbell reverse fly','3 × 12–15 · 60s','Keep the movement in the rear delts.'),
      slot('Preacher curl','Alternating dumbbell curl','3 × 10–12 · 60s','Control every lowering phase.'),
      slot('Rope pressdown','Overhead cable extension','3 × 10–15 · 60s','Keep elbows fixed; use full extension.')
    ],finish:'5 min easy walk and shoulder mobility.'},
    {day:'Saturday',focus:'Abs + Remaining Arms',time:'60–70 min',warm:'5 min easy cardio, wrist/elbow mobility, and one light set for each first movement.',slots:[
      slot('Barbell curl','Alternating dumbbell curl','3 × 8–12 · 75s','Keep torso still and control the lowering.'),
      slot('Cable curl','Hammer curl','3 × 10–12 · 60s','Keep elbows near your sides.'),
      slot('Close-grip press','Single-dumbbell extension','3 × 8–12 · 75s','Use a comfortable elbow path.'),
      slot('Hanging knee raise','Reverse crunch','3 × 10–15 · 45–60s','Avoid swinging; curl pelvis upward.'),
      slot('Pallof press','Plank','3 × 10/side or 30–45 sec · 45s','Brace and keep hips square.')
    ],finish:'15–20 min incline treadmill walk, then a short calf, hip, and lat stretch.'}
  ];
})();

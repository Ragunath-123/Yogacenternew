/* ============================================================
   YogaLakshmi Wellness Center - BMI Calculator
   Pure frontend, no backend
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmiForm');
  if (!form) return;

  const heightCm = document.getElementById('bmiHeight');
  const weightKg = document.getElementById('bmiWeight');
  const numEl = document.getElementById('bmiValue');
  const catEl = document.getElementById('bmiCategory');
  const scaleMarker = document.getElementById('bmiMarker');

  const category = bmi => {
    if (bmi < 18.5)  return { label: 'Underweight',     color: '#4aa3df', pos: 8 };
    if (bmi < 25)    return { label: 'Normal Weight',   color: '#5aa667', pos: 28 };
    if (bmi < 30)    return { label: 'Overweight',      color: '#e0c25a', pos: 50 };
    if (bmi < 35)    return { label: 'Obese (Class I)', color: '#e88a4a', pos: 70 };
    return            { label: 'Obese (Class II+)',     color: '#d4534a', pos: 90 };
  };

  const calc = () => {
    const h = parseFloat(heightCm.value);
    const w = parseFloat(weightKg.value);
    if (!h || !w || h <= 0 || w <= 0) {
      numEl.textContent = '--';
      catEl.textContent = 'Enter valid height & weight';
      catEl.style.background = 'rgba(255,255,255,.15)';
      if (scaleMarker) scaleMarker.style.left = '0%';
      return;
    }
    const bmi = w / ((h / 100) * (h / 100));
    const c = category(bmi);
    numEl.textContent = bmi.toFixed(1);
    catEl.textContent = c.label;
    catEl.style.background = c.color;
    catEl.style.color = '#fff';
    if (scaleMarker) {
      scaleMarker.style.left = c.pos + '%';
      scaleMarker.style.background = c.color;
    }
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    calc();
  });
  [heightCm, weightKg].forEach(inp => inp && inp.addEventListener('input', calc));
});

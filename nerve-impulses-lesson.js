(() => {
  const steps = [...document.querySelectorAll('.lesson-step')];
  const tabs = [...document.querySelectorAll('[data-step]')];
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const key = 'lvwa-nerve-impulses-lesson-part-v1';
  let current = 0;
  function show(index, focus = false) {
    current = Math.max(0, Math.min(steps.length - 1, index));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    tabs.forEach((tab, i) => { if (i === current) tab.setAttribute('aria-current', 'step'); else tab.removeAttribute('aria-current'); });
    document.querySelector('#lesson-count').textContent = `${current + 1} / ${steps.length}`;
    document.querySelector('#lesson-progress').value = current + 1;
    previous.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? 'Finish lesson ✓' : 'Next part →';
    document.querySelector('#lesson-status').textContent = '';
    try { localStorage.setItem(key, String(current)); } catch {}
    if (focus) steps[current].querySelector('h2').focus();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => show(Number(tab.dataset.step), true)));
  previous.addEventListener('click', () => show(current - 1, true));
  next.addEventListener('click', () => {
    if (current < steps.length - 1) show(current + 1, true);
    else document.querySelector('#lesson-status').textContent = 'You have reached the end. Complete your review worksheet and revisit any parts you need.';
  });
  document.querySelectorAll('.check-answer').forEach(button => button.addEventListener('click', () => {
    const field = button.closest('.check');
    const selected = field.querySelector('input:checked');
    field.querySelector('.feedback').textContent = !selected ? 'Choose an answer first.' : `${selected.value === field.dataset.answer ? 'Correct.' : 'Try again.'} ${field.dataset.why}`;
  }));
  const viewer = document.querySelector('#image-viewer');
  document.querySelectorAll('.image-open').forEach(button => button.addEventListener('click', () => {
    const image = document.querySelector('#large-image');
    image.src = button.dataset.src; image.alt = button.dataset.alt;
    document.querySelector('#image-caption').textContent = button.dataset.alt;
    viewer.showModal();
  }));
  document.querySelector('#close-image').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  try { const saved = Number(localStorage.getItem(key)); if (Number.isInteger(saved)) current = saved; } catch {}
  show(current);
})();

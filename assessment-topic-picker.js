/* A checkbox picker backed by the builder's original topic select. */
(() => {
  function mount(id, label) {
    const select = document.getElementById(id);
    if (!select) return;
    select.multiple = true;
    select.hidden = true;
    select.style.display = 'none';
    const picker = document.createElement('details');
    const summary = document.createElement('summary');
    const choices = document.createElement('div');
    choices.style.cssText = 'max-height:15rem;overflow:auto;padding:0.4rem 0';
    picker.append(summary, choices);
    select.after(picker);

    function render() {
      const options = [...select.options].filter(option => option.value !== 'all');
      const count = options.filter(option => option.selected).length;
      summary.textContent = count ? label + ' (' + count + ' selected)' : 'All ' + label.toLowerCase();
      choices.replaceChildren();
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.textContent = 'Clear selection';
      clear.disabled = !count;
      clear.onclick = () => {
        select.value = 'all';
        changed();
        summary.focus();
      };
      if (options.length) choices.append(clear);
      else choices.textContent = 'No options available for these filters.';
      for (const option of options) {
        const row = document.createElement('label');
        row.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin:0.45rem 0;color:inherit;font-size:0.875rem';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.style.cssText = 'width:1rem;min-height:1rem;flex:none;margin:0';
        box.checked = option.selected;
        box.onchange = () => {
          option.selected = box.checked;
          if (box.checked) select.options[0].selected = false;
          changed();
          [...choices.querySelectorAll('input')][options.indexOf(option)]?.focus();
        };
        row.append(box, document.createTextNode(option.text));
        choices.append(row);
      }
    }

    function changed() {
      select.dispatchEvent(new Event('change', { bubbles: true }));
      render();
    }

    new MutationObserver(render).observe(select, { childList: true });
    render();
  }

  function matches(id, predicate) {
    const control = document.getElementById(id);
    const values = [...control.selectedOptions].map(option => option.value).filter(value => value !== 'all');
    return values.length === 0 || values.some(predicate);
  }

  window.AssessmentTopicPicker = { matches };
  mount('topic', 'Topics');
  mount('subtopic', 'Subtopics');
})();

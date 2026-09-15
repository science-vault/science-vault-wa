let activeFilter = "All";
const grid = document.getElementById("resourceGrid");
const input = document.getElementById("searchInput");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");

function render(){
  const q = input.value.trim().toLowerCase();
  const items = RESOURCES.filter(r => {
    const text = `${r.title} ${r.year} ${r.subject} ${r.type} ${r.desc}`.toLowerCase();
    return (!q || text.includes(q)) && (activeFilter==="All" || r.type===activeFilter);
  });
  grid.innerHTML = items.map(r => `<article class="resource-card">
    <div class="meta"><span class="tag">${r.year}</span><span class="tag">${r.subject}</span><span class="tag">${r.type}</span></div>
    <h3>${r.title}</h3><p>${r.desc}</p>
    <a href="${r.file}" ${r.file==="#"?'onclick="return false;"':''}>Open resource →</a>
  </article>`).join("");
  count.textContent = `${items.length} resource${items.length===1?"":"s"} shown`;
  empty.classList.toggle("hidden", items.length!==0);
}
input.addEventListener("input", render);
document.querySelectorAll("[data-search]").forEach(el => el.addEventListener("click", () => {
  input.value = el.dataset.search;
  activeFilter = "All";
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));
  render();
  document.getElementById("resources").scrollIntoView();
}));
document.querySelectorAll("[data-filter]").forEach(el => el.addEventListener("click", () => {
  activeFilter = el.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===el));
  render();
}));
render();
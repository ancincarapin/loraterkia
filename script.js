// Minimal gallery logic: fetch photos list and render, with accessible lightbox.
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  photos: [],
  currentIndex: 0
};

async function loadPhotos() {
  try {
    const res = await fetch('photos/photos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar photos.json');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('El JSON debe ser un array');
    state.photos = data;
    renderGallery();
  } catch (err) {
    console.warn(err);
    $('#gallery').innerHTML = `<div class="empty">
      <p>No hay fotos todavía. Sube imágenes al directorio <code>/photos</code> y luego añade objetos en <code>photos/photos.json</code> con este formato:</p>
<pre>[
  { "file": "mi-foto-1.jpg", "title": "Título opcional", "alt": "Descripción alternativa" }
]</pre>
    </div>`;
  }
}

function renderGallery() {
  const grid = $('#gallery');
  grid.innerHTML = '';
  const tpl = $('#card-template');
  state.photos.forEach((p, i) => {
    const node = tpl.content.cloneNode(true);
    const fig = node.querySelector('.card');
    const btn = node.querySelector('.thumb');
    const img = node.querySelector('img');
    const cap = node.querySelector('.caption');

    img.src = `photos/${encodeURIComponent(p.file)}`;
    img.alt = p.alt || p.title || 'Fotografía';
    cap.textContent = p.title || '';

    btn.addEventListener('click', () => openLightbox(i));
    grid.appendChild(node);
  });
}

function openLightbox(index) {
  state.currentIndex = index;
  const lb = $('#lightbox');
  const img = $('#lightbox-img');
  const cap = $('#lightbox-cap');
  const p = state.photos[index];
  img.src = `photos/${encodeURIComponent(p.file)}`;
  img.alt = p.alt || p.title || 'Fotografía ampliada';
  cap.textContent = p.title || '';
  lb.setAttribute('aria-hidden', 'false');
  $('#lightbox .close').focus();
}

function closeLightbox() {
  $('#lightbox').setAttribute('aria-hidden', 'true');
}

function nextPhoto() {
  if (!state.photos.length) return;
  state.currentIndex = (state.currentIndex + 1) % state.photos.length;
  openLightbox(state.currentIndex);
}

function prevPhoto() {
  if (!state.photos.length) return;
  state.currentIndex = (state.currentIndex - 1 + state.photos.length) % state.photos.length;
  openLightbox(state.currentIndex);
}

function wireEvents() {
  $('#year').textContent = new Date().getFullYear();
  $('#lightbox .close').addEventListener('click', closeLightbox);
  $('#lightbox .next').addEventListener('click', nextPhoto);
  $('#lightbox .prev').addEventListener('click', prevPhoto);
  $('#lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    const lbOpen = $('#lightbox').getAttribute('aria-hidden') === 'false';
    if (!lbOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

loadPhotos();
wireEvents();

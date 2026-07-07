import { getFavorites, isFavorite } from './storage.js';

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const el = document.createElement('div');
    el.textContent = String(text);
    return el.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return 'Fecha desconocida';
    try {
        return new Date(dateStr).toLocaleDateString('es-ES');
    } catch {
        return 'Fecha desconocida';
    }
}

export function renderCards(articles, container) {
    if (!container) return;

    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No encontramos noticias relacionadas con su búsqueda.</p></div>';
        return;
    }

    container.innerHTML = articles.map(article => {
        const imageUrl = article.image || '';
        const imgTag = imageUrl
            ? `<img class="card__image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.title)}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='block'"><div class="card__image card__image--placeholder" style="display:none"></div>`
            : '<div class="card__image card__image--placeholder"></div>';
        const isFav = isFavorite(article.url);
        const favIcon = isFav ? '★' : '⭐';
        const favText = isFav ? ' Quitar favorito' : ' Guardar favorito';

        return `
        <article class="card" data-url="${escapeHtml(article.url)}">
            ${imgTag}
            <div class="card__body">
                <h3 class="card__title">${escapeHtml(article.title)}</h3>
                <p class="card__description">${escapeHtml(article.description)}</p>
                <div class="card__meta">
                    <span class="card__source">📰 ${escapeHtml(article.source?.name || 'Fuente desconocida')}</span>
                    <span class="card__date">📅 ${formatDate(article.publishedAt)}</span>
                </div>
                <button class="card__fav-btn" data-url="${escapeHtml(article.url)}">${favIcon}${favText}</button>
            </div>
        </article>`;
    }).join('');

    container.querySelectorAll('.card__fav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            const article = articles.find(a => a.url === url);
            if (article) {
                document.dispatchEvent(new CustomEvent('toggle-favorite', { detail: article }));
            }
        });
    });
}

export function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;

    const favorites = getFavorites();

    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tienes noticias guardadas como favoritas.</p></div>';
        return;
    }

    container.innerHTML = favorites.map(article => `
        <article class="card card--favorite" data-url="${escapeHtml(article.url)}">
            <img class="card__image" src="${escapeHtml(article.image || '')}" alt="${escapeHtml(article.title)}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='block'"><div class="card__image card__image--placeholder" style="display:none"></div>
            <div class="card__body">
                <h3 class="card__title">${escapeHtml(article.title)}</h3>
                <p class="card__description">${escapeHtml(article.description)}</p>
                <div class="card__meta">
                    <span class="card__source">📰 ${escapeHtml(article.source)}</span>
                    <span class="card__date">📅 ${formatDate(article.date)}</span>
                </div>
                <button class="card__fav-btn card__fav-btn--remove" data-url="${escapeHtml(article.url)}">❌ Eliminar favorito</button>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.card__fav-btn--remove').forEach(btn => {
        btn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('remove-favorite', {
                detail: { url: btn.dataset.url }
            }));
        });
    });
}

export function showError(message) {
    showMessage(message, 'error');
}

export function showSuccess(message) {
    showMessage(message, 'success');
}

export function showWarning(message) {
    showMessage(message, 'warning');
}

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = `message message--${type}`;
    msgEl.textContent = message;
    container.appendChild(msgEl);

    setTimeout(() => {
        msgEl.classList.add('message--fade-out');
        setTimeout(() => msgEl.remove(), 300);
    }, 3000);
}

export function updateLastSearch(term, date) {
    const container = document.getElementById('last-search-container');
    if (!container) return;

    if (!term) {
        container.innerHTML = '<p class="empty-state" style="padding:16px 0">No hay consultas recientes.</p>';
        return;
    }

    container.innerHTML = `
        <p class="last-search__term">"${escapeHtml(term)}"</p>
        <p class="last-search__date">Consultado el: ${escapeHtml(date)}</p>
    `;
}

export function updateSearchHistory(history) {
    const container = document.getElementById('history-container');
    if (!container) return;

    if (!history || history.length === 0) {
        container.innerHTML = '<p class="empty-state" style="padding:16px 0">No hay historial de consultas.</p>';
        return;
    }

    container.innerHTML = `
        <ul class="history__list">
            ${history.map(item => `
                <li class="history__item" data-term="${escapeHtml(item.term)}">
                    <span class="history__item-term">${escapeHtml(item.term)}</span>
                    <span class="history__item-date">${escapeHtml(item.date)}</span>
                </li>
            `).join('')}
        </ul>
    `;

    container.querySelectorAll('.history__item').forEach(item => {
        item.addEventListener('click', () => {
            const term = item.dataset.term;
            document.dispatchEvent(new CustomEvent('search-term', {
                detail: { term }
            }));
        });
    });
}

export function showLoading(container) {
    if (container) {
        container.innerHTML = '<div class="loading-state"><p>⏳ Cargando noticias...</p></div>';
    }
}

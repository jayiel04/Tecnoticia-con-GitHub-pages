import * as api from './api.js';
import * as ui from './ui.js';
import * as storage from './storage.js';

const CATEGORY_QUERIES = {
    ultimas: 'tecnología',
    ia: 'inteligencia artificial',
    moviles: 'smartphones dispositivos móviles',
    hardware: 'hardware computadoras',
    gaming: 'videojuegos gaming',
    seguridad: 'ciberseguridad'
};

let currentArticles = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
    restoreLastSearch();
    ui.renderFavorites();
    restoreSearchHistory();
    loadTopNews();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => handleCategory(btn.dataset.category));
    });

    document.getElementById('clear-favorites-btn').addEventListener('click', () => {
        storage.clearAllFavorites();
        ui.renderFavorites();
        ui.showSuccess('Todos los favoritos han sido eliminados.');
    });

    document.getElementById('clear-last-search-btn').addEventListener('click', () => {
        storage.clearLastSearch();
        ui.updateLastSearch(null, null);
        ui.showSuccess('Última consulta eliminada.');
    });

    document.getElementById('clear-history-btn').addEventListener('click', () => {
        storage.clearSearchHistory();
        ui.updateSearchHistory([]);
        ui.showSuccess('Historial de consultas eliminado.');
    });

    document.addEventListener('toggle-favorite', handleToggleFavorite);
    document.addEventListener('remove-favorite', handleRemoveFavorite);
    document.addEventListener('search-term', handleHistorySearch);
}

async function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    const container = document.getElementById('results-container');
    ui.showLoading(container);

    try {
        const articles = await api.searchNews(query);
        currentArticles = articles;
        ui.renderCards(articles, container);
        storage.saveLastSearch(query);
        storage.saveSearchHistory(query);

        const lastSearch = storage.getLastSearch();
        if (lastSearch) {
            ui.updateLastSearch(lastSearch.term, lastSearch.date);
        }

        ui.updateSearchHistory(storage.getSearchHistory());
    } catch (error) {
        currentArticles = [];
        ui.renderCards([], container);
        ui.showError(error.message);
    }
}

function handleCategory(category) {
    const query = CATEGORY_QUERIES[category] || 'tecnología';
    document.getElementById('search-input').value = query;
    handleSearch();
}

function handleToggleFavorite(e) {
    const article = e.detail;

    try {
        storage.addFavorite(article);
        ui.showSuccess('Noticia guardada en favoritos.');
    } catch (err) {
        if (err.message.includes('ya está guardada')) {
            storage.removeFavorite(article.url);
            ui.showWarning('Noticia eliminada de favoritos.');
        } else {
            ui.showError(err.message);
        }
    }

    ui.renderFavorites();

    if (currentArticles.length > 0) {
        ui.renderCards(currentArticles, document.getElementById('results-container'));
    }
}

function handleRemoveFavorite(e) {
    const { url } = e.detail;
    storage.removeFavorite(url);
    ui.renderFavorites();
    ui.showSuccess('Favorito eliminado.');

    if (currentArticles.length > 0) {
        ui.renderCards(currentArticles, document.getElementById('results-container'));
    }
}

function handleHistorySearch(e) {
    const { term } = e.detail;
    document.getElementById('search-input').value = term;
    handleSearch();
}

function restoreLastSearch() {
    const lastSearch = storage.getLastSearch();
    if (lastSearch) {
        ui.updateLastSearch(lastSearch.term, lastSearch.date);
    }
}

function restoreSearchHistory() {
    const history = storage.getSearchHistory();
    if (history.length > 0) {
        ui.updateSearchHistory(history);
    }
}

async function loadTopNews() {
    const container = document.getElementById('results-container');
    ui.showLoading(container);

    try {
        const articles = await api.searchNews('tecnología');
        currentArticles = articles;
        ui.renderCards(articles, container);
    } catch {
        ui.renderCards([], container);
        ui.showWarning('No se pudieron cargar las últimas noticias. Realice una búsqueda para comenzar.');
    }
}

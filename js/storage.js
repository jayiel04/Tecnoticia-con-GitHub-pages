const FAVORITES_KEY = 'tecnoticias_favoritos';
const LAST_SEARCH_KEY = 'tecnoticias_ultima_busqueda';
const HISTORY_KEY = 'tecnoticias_historial';

function safeGetItem(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        throw new Error('No fue posible guardar los datos en el almacenamiento local.');
    }
}

export function getFavorites() {
    const favorites = safeGetItem(FAVORITES_KEY);
    return Array.isArray(favorites) ? favorites : [];
}

export function addFavorite(article) {
    const favorites = getFavorites();
    const exists = favorites.some(fav => fav.url === article.url);

    if (exists) {
        throw new Error('Esta noticia ya está guardada en favoritos.');
    }

    favorites.push({
        title: article.title,
        description: article.description,
        image: article.image,
        source: article.source?.name || 'Fuente desconocida',
        date: article.publishedAt,
        url: article.url
    });

    safeSetItem(FAVORITES_KEY, favorites);
    return favorites;
}

export function removeFavorite(url) {
    const favorites = getFavorites().filter(fav => fav.url !== url);
    safeSetItem(FAVORITES_KEY, favorites);
    return favorites;
}

export function isFavorite(url) {
    return getFavorites().some(fav => fav.url === url);
}

export function clearAllFavorites() {
    safeSetItem(FAVORITES_KEY, []);
}

export function saveLastSearch(term) {
    safeSetItem(LAST_SEARCH_KEY, {
        term: term,
        date: new Date().toLocaleDateString('es-ES')
    });
}

export function getLastSearch() {
    return safeGetItem(LAST_SEARCH_KEY);
}

export function clearLastSearch() {
    safeSetItem(LAST_SEARCH_KEY, null);
}

export function getSearchHistory() {
    const history = safeGetItem(HISTORY_KEY);
    return Array.isArray(history) ? history : [];
}

export function saveSearchHistory(term) {
    const history = getSearchHistory();
    const exists = history.some(item => item.term.toLowerCase() === term.toLowerCase());

    if (!exists) {
        history.unshift({
            term: term,
            date: new Date().toLocaleDateString('es-ES')
        });

        if (history.length > 10) {
            history.pop();
        }

        safeSetItem(HISTORY_KEY, history);
    }

    return history;
}

export function clearSearchHistory() {
    safeSetItem(HISTORY_KEY, []);
}

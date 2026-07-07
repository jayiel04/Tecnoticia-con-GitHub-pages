const API_KEY = 'bf22a6487c8be950831d7e0257d684c9';
const BASE_URL = 'https://gnews.io/api/v4';

const hostname = window.location.hostname;
const USE_PROXY = hostname !== 'localhost' && hostname !== '127.0.0.1';
const PROXY_URL = 'https://corsproxy.io/?';

function buildApiUrl(query) {
    const apiUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=es&country=any&max=12&apikey=${API_KEY}`;

    if (USE_PROXY) {
        return `${PROXY_URL}url=${encodeURIComponent(apiUrl)}`;
    }

    return apiUrl;
}

export async function searchNews(query) {
    const url = buildApiUrl(query);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('No se pudieron cargar las noticias. Intente nuevamente.');
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
        throw new Error('No encontramos noticias relacionadas con su búsqueda.');
    }

    return data.articles;
}

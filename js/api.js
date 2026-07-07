const API_KEY = 'bf22a6487c8be950831d7e0257d684c9';
const BASE_URL = 'https://gnews.io/api/v4';

export async function searchNews(query) {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=es&country=any&max=12&apikey=${API_KEY}`;

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

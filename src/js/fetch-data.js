import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = `29304756-51da1fab5abbfa991ea2eaa1b`; 

async function fetchData(textQuery, page, perPage) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: textQuery,
        image_type:'photo', 
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,   
    }); 

    const response = await axios.get(`${BASE_URL}?${params}`);

    return response;   
} 

export { fetchData };


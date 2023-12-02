import { fetchData } from './js/fetch-data';
import { createMarkup } from './js/create-markup';
import SimpleLightbox from "simplelightbox";
import iziToast from 'izitoast'; 
import "simplelightbox/dist/simple-lightbox.min.css";
import 'izitoast/dist/css/iziToast.css'; 

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    imageGallery: document.querySelector('photo-card'),
    submitBtn: document.querySelector('.submit-btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    loader: document.querySelector('.loader'),
}

let page = 1;
const perPage = 40;

let textQuery = '';

refs.submitBtn.disabled = true;
refs.loader.classList.add('hidden');

refs.searchForm.addEventListener('submit', onSearchForm);
refs.searchForm.addEventListener('input', (e) => e.target.value ? refs.submitBtn.disabled = false : refs.submitBtn.disabled = true);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchForm(e) {
    e.preventDefault();
    page = 1;
    textQuery = e.currentTarget.searchQuery.value.trim();

    if (textQuery === '') {
        iziToast.error({
            title: 'Error',
            message: `Sorry, you didn't write what to look for`,
            position: 'center',
        });
        refs.searchForm.reset();
        refs.submitBtn.disabled = true;
        return;
    }

    refs.gallery.innerHTML = '';

    if (/\d/.test(textQuery)) {
        return iziToast.error({
            title: 'Error',
            message: `Sorry, you can only use letters to search`,
            position: 'center',
        });
    }
    try {
        const { data } = await fetchData(textQuery, page, perPage);
        refs.loader.classList.remove('hidden');

            if (data.totalHits === 0) {
                refs.loader.classList.add('hidden');
                iziToast.error({
                    title: 'Error',
                    message: `Sorry, there are no images matching your search query. Please try again.`,
                    position: 'center',
                });
            } else {
                refs.loader.classList.add('hidden');

                createMarkup(data.hits);
                onSimpleLightbox(); 

                iziToast.info({
                    title: 'Information',
                    message: `Hooray! We found ${data.totalHits} images.`,
                    position: 'center',
                });

                if (data.totalHits > perPage) {
                    refs.loadMoreBtn.classList.remove('hidden');
                }
            } 
        }
        catch(error) {
            console.error(error);
            refs.loader.classList.add('hidden');  
            iziToast.error({
                title: 'Server error',
                message: 'Oops! Something went wrong! Try reloading the page!',
                position: 'center',
            });
        }
}

async function onLoadMore() {
    page += 1;
    try {
        const {data} = await fetchData(textQuery, page, perPage);
        createMarkup(data.hits);
        onSimpleLightbox();
            
        const totalPages = Math.ceil(data.totalHits / perPage);
            if (page < totalPages) {
                refs.loadMoreBtn.classList.remove('hidden');

            }
            else {
                iziToast.info({
                    title: 'Information',
                    message: `We're sorry, but you've reached the end of search results.`,
                    position: 'center',
                });
                return;
            }
        }
        catch(error) {
            console.log(error);
        }
}

function onSimpleLightbox() {
    new SimpleLightbox('.gallery a').refresh();
}




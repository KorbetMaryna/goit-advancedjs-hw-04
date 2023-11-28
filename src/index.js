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
}

let textQuery = '';
let page = 1;
const perPage = 40;

refs.submitBtn.disabled = true;

refs.searchForm.addEventListener('submit', onSearchForm);
refs.searchForm.addEventListener('input', (e) => e.target.value ? refs.submitBtn.disabled = false : refs.submitBtn.disabled = true);


function onSearchForm(e) {
    e.preventDefault();

    page = 1;
    textQuery = e.currentTarget.searchQuery.value.trim();

    refs.gallery.innerHTML = '';

    if (/\d/.test(textQuery)) {
        return iziToast.error({
                    title: 'Error',
                    message: `Sorry, you can only use letters to search`,
                    position: 'center',
                });
    }

    fetchData(textQuery, page, perPage)
        .then(({ data }) => {
            if (data.totalHits === 0) {
                iziToast.error({
                    title: 'Error',
                    message: `Sorry, there are no images matching your search query. Please try again.`,
                    position: 'center',
                });
            } else {
                createMarkup(data.hits);
                onSimpleLightbox();
                iziToast.info({
                    title: 'Information',
                    message: `Hooray! We found ${data.totalHits} images.`,
                    position: 'center',
                });
            }
        })
        .catch(error => {
            console.error(error);
            iziToast.error({
                    title: 'Server error',
                    message: 'Oops! Something went wrong! Try reloading the page!',
                    position: 'center',
                })
        });
}

function onSimpleLightbox() {
    new SimpleLightbox('.gallery a').refresh();
}
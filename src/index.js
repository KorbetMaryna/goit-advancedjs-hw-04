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
    guard: document.querySelector('.js-guard'),
    loader: document.querySelector('.loader'),
}

const options = {
    rootMargin: '300px',
    threshold: 0.5,
};

let page = 1;
const perPage = 40;

let textQuery = '';
let isObserving = false;

const observer = new IntersectionObserver(onIntersection, options);

refs.submitBtn.disabled = true;

refs.searchForm.addEventListener('submit', onSearchForm);
refs.searchForm.addEventListener('input', (e) => e.target.value ? refs.submitBtn.disabled = false : refs.submitBtn.disabled = true);

refs.loader.classList.add('hidden');

function onIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            page += 1;

            fetchData(textQuery, page, perPage)
                .then(({ data }) => {
                    if (!data.hits || data.hits.length === 0) {
                    return;
                    } 
                    
                    if (data.hits.length > 0) {
                        createMarkup(data.hits);
                        onSimpleLightbox();
                        } else {
                        observer.unobserve(entry.target);
                    }
                })
                .catch(error => {
                    console.error(error);

                    iziToast.error({
                        title: 'Server error',
                        message: 'Oops! Something went wrong! Try reloading the page!',
                        position: 'center',
                    });
                });
        }
    });
}

function observeLastElement() {
    const lastElement = refs.gallery.lastElementChild;
    if (lastElement && !isObserving) {
        observer.observe(lastElement);
        isObserving = true;
    }
}

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
            refs.loader.classList.remove('hidden');

            if (data.totalHits === 0) {
                iziToast.error({
                    title: 'Error',
                    message: `Sorry, there are no images matching your search query. Please try again.`,
                    position: 'center',
                });
            } else {

            if (!data.hits || data.hits.length === 0) {
                    return;
            } else {
                refs.loader.classList.add('hidden');

                createMarkup(data.hits);
                onSimpleLightbox(); 
                observeLastElement();
                } 

                iziToast.info({
                    title: 'Information',
                    message: `Hooray! We found ${data.totalHits} images.`,
                    position: 'center',
                });
            }
        })
        .catch(error => {
            console.error(error);
            refs.loader.classList.add('hidden');
            
            iziToast.error({
                title: 'Server error',
                message: 'Oops! Something went wrong! Try reloading the page!',
                position: 'center',
            })
        });
}

observeLastElement();

function onSimpleLightbox() {
    new SimpleLightbox('.gallery a').refresh();
}




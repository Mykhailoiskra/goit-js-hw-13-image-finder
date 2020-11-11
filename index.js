import PixabayApiService from './js/apiService.js';
import picturesTpl from './templates/picture-card.hbs';
import LoadMoreBtn from './js/load-more.js';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import './css/main.css';


const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery')
}
const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
let scrollPoint = 0;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

refs.galleryContainer.addEventListener('click', openModal);



function onSearch(event) {
    event.preventDefault();

    pixabayApiService.query = event.currentTarget.elements.query.value;

    if (pixabayApiService.query === '') {
        return error({
            title: 'Oh, no!',
            text: 'Please enter your search query',
            animation: 'fade',
            hide: true,
            delay: 2000,
            closer: true,
            sticker: false
        });
    }
    clearGalleryContainer();
    fetchPictures();
    loadMoreBtn.show();
    
}

function fetchPictures() {
    loadMoreBtn.disable();
    scrollPoint = document.body.clientHeight;
    pixabayApiService.fetchPictures().then(pictures => {
        if (pictures.length === 0) {
            loadMoreBtn.hide();
            return error({title: 'Oh, no!',
            text: 'No results, please specify your query',
            animation: 'fade',
            hide: true,
            delay: 2000,
            closer: true,
            sticker: false
            })
        } else {
            appendPicturesMarkup(pictures);
            loadMoreBtn.enable();
            window.scrollTo({
                top: scrollPoint, left: 0,
            behavior: 'smooth'})
           
        }
    })
    
}

function appendPicturesMarkup(pictures) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', picturesTpl(pictures));

}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}
function openModal(event) {
    if (event.target.nodeName !== 'IMG') {
        return
    }
    event.preventDefault();
    basicLightbox.create(`
		<img width="1400" height="900" src=${event.target.dataset.source}>
	`).show();
}


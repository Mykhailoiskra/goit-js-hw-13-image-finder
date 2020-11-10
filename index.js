import PixabayApiService from './js/apiService.js';
import picturesTpl from './templates/picture-card.hbs';
import LoadMoreBtn from './js/load-more.js';
import * as basicLightbox from 'basiclightbox';
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


refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

refs.galleryContainer.addEventListener('click', openModal);

function openModal(event) {
    if (event.target.nodeName !== 'IMG') {
        return
    };
    console.log("click")
    event.preventDefault();
    basicLightbox.create(`
		<img width="1400" height="900" src=${event.target.dataset.source}>
	`).show();
}

function onSearch(event) {
    event.preventDefault();

    pixabayApiService.query = event.currentTarget.elements.query.value;

    if (pixabayApiService.query === '') {
        return alert('Введи что-то нормальное');
    }
    clearGalleryContainer();
    fetchPictures();
    loadMoreBtn.show();
}

function fetchPictures() {
    loadMoreBtn.disable();
    pixabayApiService.fetchPictures().then(pictures => {
        appendPicturesMarkup(pictures);
    })
    loadMoreBtn.enable();
}

function appendPicturesMarkup(pictures) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', picturesTpl(pictures));

}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}
import PixabayApiService from './js/apiService.js';
import picturesTpl from './templates/picture-card.hbs';
import './css/main.css';


const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery')
}
const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSearch);



function onSearch(event) {
    event.preventDefault();

    pixabayApiService.query = event.currentTarget.elements.query.value;

    if (pixabayApiService.query === '') {
        return alert('Введи что-то нормальное');
    }
    clearGalleryContainer();
    fetchPictures();
}

function fetchPictures() {
    pixabayApiService.fetchPictures().then(pictures => {
        appendPicturesMarkup(pictures);
    })
}

function appendPicturesMarkup(pictures) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', picturesTpl(pictures));

}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}
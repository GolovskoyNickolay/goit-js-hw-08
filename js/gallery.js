import { images } from './imagesList.js';

const galleryContainer = document.querySelector('.gallery');
const galleryMarkup = createGalleryItems(images);
let currentIndex;

galleryContainer.addEventListener('click', onGalleryItemClick);

function createGalleryItems(images) {
    return images
        .map(({ preview, original, description }) => {
            return `
            <li class="gallery-item">
              <a class="gallery-link" href="${original}">
                <div class="relative overflow-hidden transform transition duration-300 hover:scale-105">
                  <img
                    class="gallery-image w-full h-full object-cover"
                    src="${preview}"
                    data-source="${original}"
                    alt="${description}"
                  />
                  <div class="modal-description absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
                    ${description}
                  </div>
                </div>
              </a>
            </li>
            `;
        })
        .join('');
}

function onGalleryItemClick(event) {
    event.preventDefault();

    const target = event.target;

    if (target.nodeName !== 'IMG') {
        return;
    }

    currentIndex = images.findIndex(i => i.original === target.dataset.source);
    openModal(currentIndex);
}

function openModal(index) {
    const { original, description } = images[index];

    const instance = basicLightbox.create(
        `
            <div class="relative">
                <img src="${original}" alt="${description}" class="w-full h-auto" />
                <button class="modal-prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-800 px-4 py-2 focus:outline-none">
                    ←
                </button>
                <button class="modal-next absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-800 px-4 py-2 focus:outline-none">
                    →
                </button>
                <div class="modal-description absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
                    ${description}
                </div>
            </div>
        `,
        {
            onShow: instance => {
                instance.element().querySelector('.modal-next').onclick = nextImage;
                instance.element().querySelector('.modal-prev').onclick = prevImage;
                window.addEventListener('keydown', onKeyDown);
            },
            onClose: instance => {
                window.removeEventListener('keydown', onKeyDown);
            },
        }
    );

    instance.show();

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateModalContent(instance, currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateModalContent(instance, currentIndex);
    }

    function onKeyDown(event) {
        if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'Escape') {
            instance.close();
        }
    }
}

function updateModalContent(instance, index) {
    const modalImage = instance.element().querySelector('img');
    const modalDescription = instance.element().querySelector('.modal-description');

    modalImage.src = images[index].original;
    modalImage.alt = images[index].description;
    modalDescription.textContent = images[index].description;
}

galleryContainer.innerHTML = galleryMarkup;

// Утилита для получения изображений отелей и номеров
// Использует локальные изображения из папки public/images

// Изображения отелей
const HOTEL_IMAGES = [
  '/images/moscow.jpg',
  '/images/piter.jpg',
  '/images/hotel.jpg',
  '/images/Hartwell.jpg',
  '/images/Saint-Petersburg.jpg',
];

// Изображения номеров
const ROOM_IMAGES = [
  '/images/hotel.jpg',
  '/images/moscow.jpg',
  '/images/piter.jpg',
  '/images/Hartwell.jpg',
  '/images/Saint-Petersburg.jpg',
];

// Фоновые изображения для заголовков
const HEADER_BACKGROUND_IMAGES = [
  '/images/moscow.jpg',
  '/images/piter.jpg',
  '/images/Saint-Petersburg.jpg',
];

export const getHotelImage = (hotelId: string): string => {
  const index = parseInt(hotelId) % HOTEL_IMAGES.length;
  return HOTEL_IMAGES[index] || HOTEL_IMAGES[0];
};

export const getRoomImage = (roomId: string): string => {
  const index = parseInt(roomId) % ROOM_IMAGES.length;
  return ROOM_IMAGES[index] || ROOM_IMAGES[0];
};

// Получить фоновое изображение для заголовка
export const getHeaderBackground = (id?: string): string => {
  if (id) {
    const index = parseInt(id) % HEADER_BACKGROUND_IMAGES.length;
    return HEADER_BACKGROUND_IMAGES[index] || HEADER_BACKGROUND_IMAGES[0];
  }
  // Для главной страницы используем первое изображение
  return HEADER_BACKGROUND_IMAGES[0];
};

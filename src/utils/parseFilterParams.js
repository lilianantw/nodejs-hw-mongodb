// src/utils/parseFilterParams.js

// функция для проверки и парсинга contactType
const parseContactType = (type) => {
  if (typeof type !== 'string') return;
  const allowedTypes = ['work', 'home', 'personal']; // ← здесь только те значения, что есть в модели
  if (allowedTypes.includes(type)) return type;
};

// функция для проверки и парсинга isFavourite
const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return undefined;
};

// основной экспорт: формируем объект фильтров
export const parseContactFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  const filters = {};
  if (parsedType) filters.contactType = parsedType;
  if (parsedIsFavourite !== undefined) filters.isFavourite = parsedIsFavourite;

  return filters;
};

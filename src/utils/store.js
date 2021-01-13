import axios from 'axios';
import { setLocalForage } from './localForage';
import localStorage from './localStorage';
export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError;
    onError = null;
  }
  return axios
    .create({
      baseURL: `${process.env.VUE_APP_EPUB_URL}`,
      method: 'get',
      responseType: 'blob',
      timeout: 180 * 1000,
      onDownloadProgress: progressEvent => {
        if (onProgress) onProgress(progressEvent);
      }
    })
    .get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data]);
      setLocalForage(
        book.fileName,
        blob,
        () => {
          if (onSuccess) onSuccess(book);
        },
        err => {
          if (onError) onError(err);
        }
      );
    })
    .catch(err => {
      if (onError) onError(err);
    });
}

export function addToBookShelf(book) {
  let shelfList = localStorage.getBookShelf();
  shelfList = removeAddToShelf(shelfList);
  book.type = 1;
  shelfList.push(book);
  shelfList = refreshAllShelfId(shelfList);
  shelfList = appendAddToShelf(shelfList);
  setLocalForage('shelf', shelfList);
  localStorage.saveBookShelf(shelfList);
  // console.log(shelfList);

  return shelfList;
}

export function removeFromBookShelf(book) {
  let shelfList = localStorage.getBookShelf();
  shelfList = shelfList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => {
        return subItem.fileName !== book.fileName;
      });
    }
    return item.fileName !== book.fileName;
  });
  shelfList = refreshAllShelfId(shelfList);
  setLocalForage('shelf', shelfList);
  localStorage.saveBookShelf(shelfList);
  // console.log(shelfList);
  return shelfList;
}

export function refreshAllShelfId(shelfList) {
  let i = 0;
  shelfList.forEach(item => {
    item.id = i;
    if (item.itemList) {
      i += 1;
      item.itemList.forEach(subItem => {
        subItem.id = i;
        i += 1;
      });
    }
    i += 1;
  });
  return shelfList;
}

export function gotoBookDetail(vue, item) {
  vue.$router.push({
    path: '/store/detail',
    query: {
      fileName: item.fileName,
      category: item.category
    }
  });
}

export function appendAddToShelf(list) {
  list.push({
    id: -1,
    type: 3
  });
  return list;
}

export function removeAddToShelf(list) {
  return list.filter(item => item.type !== 3);
}

export const flapCardList = [
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/gift-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/gift-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 100,
    rotateDegree: 0
  },
  {
    r: 74,
    g: 171,
    _g: 171,
    b: 255,
    imgLeft: 'url(' + require('@/assets/images/compass-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/compass-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 99,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 198,
    _g: 198,
    b: 102,
    imgLeft: 'url(' + require('@/assets/images/star-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/star-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 98,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/heart-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/heart-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 97,
    rotateDegree: 0
  },
  {
    r: 59,
    g: 201,
    _g: 201,
    b: 22,
    imgLeft: 'url(' + require('@/assets/images/crown-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/crown-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 96,
    rotateDegree: 0
  }
];

export function getCategoryFromId(id, vue) {
  switch (id) {
    case 1:
      return vue.$t('category.computerScience');
    case 2:
      return vue.$t('category.socialSciences');
    case 3:
      return vue.$t('category.economics');
    case 4:
      return vue.$t('category.education');
    case 5:
      return vue.$t('category.engineering');
    case 6:
      return vue.$t('category.environment');
    case 7:
      return vue.$t('category.geography');
    case 8:
      return vue.$t('category.history');
    case 9:
      return vue.$t('category.laws');
    case 10:
      return vue.$t('category.lifeSciences');
    case 11:
      return vue.$t('category.literature');
    case 12:
      return vue.$t('category.biomedicine');
    case 13:
      return vue.$t('category.businessandManagement');
    case 14:
      return vue.$t('category.earthSciences');
    case 15:
      return vue.$t('category.materialsScience');
    case 16:
      return vue.$t('category.mathematics');
    case 17:
      return vue.$t('category.medicineAndPublicHealth');
    case 18:
      return vue.$t('category.philosophy');
    case 19:
      return vue.$t('category.physics');
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations');
    case 21:
      return vue.$t('category.psychology');
    default:
      return vue.$t('category.statistics');
  }
}

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ComputerScience';
    case 2:
      return 'SocialSciences';
    case 3:
      return 'Economics';
    case 4:
      return 'Education';
    case 5:
      return 'Engineering';
    case 6:
      return 'Environment';
    case 7:
      return 'Geography';
    case 8:
      return 'History';
    case 9:
      return 'Laws';
    case 10:
      return 'LifeSciences';
    case 11:
      return 'Literature';
    case 12:
      return 'Biomedicine';
    case 13:
      return 'BusinessandManagement';
    case 14:
      return 'EarthSciences';
    case 15:
      return 'MaterialsScience';
    case 16:
      return 'Mathematics';
    case 17:
      return 'MedicineAndPublicHealth';
    case 18:
      return 'Philosophy';
    case 19:
      return 'Physics';
    case 20:
      return 'PoliticalScienceAndInternationalRelations';
    case 21:
      return 'Psychology';
    case 22:
      return 'Statistics';
  }
}

export function getCategoryFromName(name, vue) {
  switch (name) {
    case 'ComputerScience':
      return vue.$t('category.computerScience');
    case 'SocialSciences':
      return vue.$t('category.socialSciences');
    case 'Economics':
      return vue.$t('category.economics');
    case 'Education':
      return vue.$t('category.education');
    case 'Engineering':
      return vue.$t('category.engineering');
    case 'Environment':
      return vue.$t('category.environment');
    case 'Geography':
      return vue.$t('category.geography');
    case 'History':
      return vue.$t('category.history');
    case 'Laws':
      return vue.$t('category.laws');
    case 'LifeSciences':
      return vue.$t('category.lifeSciences');
    case 'Literature':
      return vue.$t('category.literature');
    case 'Biomedicine':
      return vue.$t('category.biomedicine');
    case 'BusinessandManagement':
      return vue.$t('category.businessandManagement');
    case 'EarthSciences':
      return vue.$t('category.earthSciences');
    case 'MaterialsScience':
      return vue.$t('category.materialsScience');
    case 'Mathematics':
      return vue.$t('category.mathematics');
    case 'MedicineAndPublicHealth':
      return vue.$t('category.medicineAndPublicHealth');
    case 'Philosophy':
      return vue.$t('category.philosophy');
    case 'Physics':
      return vue.$t('category.physics');
    case 'PoliticalScienceAndInternationalRelations':
      return vue.$t('category.politicalScienceAndInternationalRelations');
    case 'Psychology':
      return vue.$t('category.psychology');
    case 'Statistics':
      return vue.$t('category.statistics');
  }
}

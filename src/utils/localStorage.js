import Storage from 'web-storage-cache';
const lS = new Storage();

const lStorage = {
  setLocalStorage(key, value) {
    return lS.set(key, value);
  },
  getLocalStorage(key) {
    return lS.get(key);
  },
  removeLocalStorage(key) {
    return lS.delete(key);
  },
  clearLocalStorage() {
    return lS.clear();
  },
  saveBookShelf(shelf) {
    this.setLocalStorage('shelf', shelf);
  },
  getBookShelf() {
    return this.getLocalStorage('shelf');
  },
  setBookObject(fileName, key, value) {
    let bookInfo = this.getLocalStorage(`${fileName}-info`);
    if (!bookInfo) {
      bookInfo = {};
    }
    bookInfo[key] = value;
    this.setLocalStorage(`${fileName}-info`, bookInfo);
  },
  getBookObject(fileName, key) {
    const bookInfo = this.getLocalStorage(`${fileName}-info`);
    if (bookInfo) {
      return bookInfo[key];
    } else {
      return null;
    }
  },
  getFontFamily(fileName) {
    return this.getBookObject(fileName, 'fontFamily');
  },
  saveFontFamily(fileName, font) {
    return this.setBookObject(fileName, 'fontFamily', font);
  },
  getHome() {
    return this.getLocalStorage('home');
  },

  saveHome(home) {
    return this.setLocalStorage('home', home, 1800);
  },

  getLocale() {
    return this.getLocalStorage('locale');
  },

  saveLocale(locale) {
    return this.setLocalStorage('locale', locale);
  },

  getLocation(fileName) {
    return this.getBookObject(fileName, 'location');
  },

  saveLocation(fileName, location) {
    this.setBookObject(fileName, 'location', location);
  },

  getBookmark(fileName) {
    return this.getBookObject(fileName, 'bookmark');
  },

  saveBookmark(fileName, bookmark) {
    this.setBookObject(fileName, 'bookmark', bookmark);
  },

  getReadTime(fileName) {
    return this.getBookObject(fileName, 'time');
  },

  saveReadTime(fileName, theme) {
    this.setBookObject(fileName, 'time', theme);
  },

  getProgress(fileName) {
    return this.getBookObject(fileName, 'progress');
  },

  saveProgress(fileName, progress) {
    this.setBookObject(fileName, 'progress', progress);
  },

  getNavigation(fileName) {
    return this.getBookObject(fileName, 'navigation');
  },

  saveNavigation(fileName, navigation) {
    this.setBookObject(fileName, 'navigation', navigation);
  },

  getMetadata(fileName) {
    return this.getBookObject(fileName, 'metadata');
  },

  saveMetadata(fileName, metadata) {
    this.setBookObject(fileName, 'metadata', metadata);
  },

  getCover(fileName) {
    return this.getBookObject(fileName, 'cover');
  },

  saveCover(fileName, cover) {
    this.setBookObject(fileName, 'cover', cover);
  },

  getTheme(fileName) {
    return this.getBookObject(fileName, 'theme');
  },

  saveTheme(fileName, theme) {
    this.setBookObject(fileName, 'theme', theme);
  },

  getFontSize(fileName) {
    return this.getBookObject(fileName, 'fontSize');
  },

  saveFontSize(fileName, fontSize) {
    this.setBookObject(fileName, 'fontSize', fontSize);
  }
};

export default lStorage;

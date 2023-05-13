class Storage {
  getItem(key) {
    return this[key] || null;
  }
  setItem(key, value) {
    this[key] = value.toString();
  }
  removeItem(key) {
    delete this[key];
  }
  clear() {
    Object.keys(this).forEach((key) => delete this[key]);
  }
}

export const localStorageMock = Object.create(new Storage()) as Storage;
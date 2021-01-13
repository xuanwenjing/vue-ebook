import Mock from 'mockjs';
import categoryList from './bookCategoryList';
import flatList from './bookFlatList';
import home from './bookHome';
import list from './bookList';
import shelf from './bookShelf';

Mock.mock(/\/book\/home/, 'get', home);
Mock.mock(/\/book\/shelf/, 'get', shelf);
Mock.mock(/\/book\/list/, 'get', list);
Mock.mock(/\/book\/flat-list/, 'get', flatList);
Mock.mock(/\/book\/category-list/, 'get', categoryList);

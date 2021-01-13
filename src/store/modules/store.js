const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架的图书列表
    shelfSelected: [], // 书架图书选中的列表
    shelfTitleVisible: true, // 书架标题的显示状态,
    isCategory: false, // 是否处于分类页面
    categoryData: [],
    categoryName: ''
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY: (state, hotSearchOffsetY) => {
      state.hotSearchOffsetY = hotSearchOffsetY;
    },
    SET_FLAP_CARD_VISIBLE: (state, flapCardVisible) => {
      state.flapCardVisible = flapCardVisible;
    },
    SET_IS_EDIT_MODE: (state, isEditMode) => {
      state.isEditMode = isEditMode;
    },
    SET_SHELF_LIST: (state, list) => {
      state.shelfList = list;
    },
    SET_SHELF_SELECTED: (state, shelfSelected) => {
      state.shelfSelected = shelfSelected;
    },
    SET_SHELF_TITLE_VISIBLE: (state, shelfTitleVisible) => {
      state.shelfTitleVisible = shelfTitleVisible;
    },
    SET_IS_CATEGORY: (state, isCategory) => {
      state.isCategory = isCategory;
    },
    SET_CATEGORY_DATA: (state, categoryData) => {
      state.categoryData = categoryData;
    },
    SET_CATEGORY_NAME: (state, categoryName) => {
      state.categoryName = categoryName;
    }
  }
};
export default store;

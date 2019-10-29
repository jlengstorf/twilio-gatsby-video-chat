exports.onCreatePage = ({ page, actions }) => {
  if (page.path.match(/^\/room/)) {
    page.matchPath = '/room/*';
    actions.createPage(page);
  }
};

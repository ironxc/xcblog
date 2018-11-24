import { createSelector } from 'reselect'
const getarticle = (state) => state.article
export const selectArticle = createSelector(
  [getarticle],
  state => state.article
)
export const selectArticlelist = createSelector(
  [getarticle],
  state => state.articlelist
)

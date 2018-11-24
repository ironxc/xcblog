import { createSelector } from 'reselect'
const getInit = (state) => state.init
export const selectUerInfo = createSelector(
  [getInit],
  state => state.userInfo
)
export const selectAllTags = createSelector(
  [getInit],
  state => state.allTags
)
export const selectBingimg = createSelector(
  [getInit],
  state => state.bingimg
)
export const selectImagelist = createSelector(
  [getInit],
  state => state.imagelist
)


module.exports = babel => {
  var t = babel.types;

  return {
    name: "s2s-redux-actions-reducers-manager",
    visitor: {
      Program: {
        enter(path, state) {

        }
      }
    }
  }
}

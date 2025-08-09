let createSagaMiddleware: any;

try {
  const reduxSaga = require('redux-saga');

  if (reduxSaga && reduxSaga.default) {
    createSagaMiddleware = reduxSaga.default;
  } else if (reduxSaga && typeof reduxSaga === 'function') {
    createSagaMiddleware = reduxSaga;
  } else {
    console.error('Redux-saga structure:', reduxSaga);
    throw new Error('Could not find createSagaMiddleware in redux-saga');
  }
} catch (error) {
  console.error('Error importing redux-saga:', error);
  throw error;
}

export default createSagaMiddleware;

import TestApp from './TestApp.js';

// var app = TestApp();
// console.log("app: ", app);
// var appElement = app({ color: 'red' });
// console.log("appElement: ", appElement);
// document.body.appendChild(appElement);

var app = TestApp({ id: 'testapp' });
app._init();
app.attachTo(document.body);

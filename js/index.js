!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=18)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.KEYDOWN=0]="KEYDOWN",e[e.KEYUP=1]="KEYUP",e[e.UPDATE=2]="UPDATE",e[e.SPAWN_BULLET=3]="SPAWN_BULLET",e[e.SPAWN_ENEMY=4]="SPAWN_ENEMY",e[e.ENEMY_RECEIVES_BULLET=5]="ENEMY_RECEIVES_BULLET"}(t.ActionTypes||(t.ActionTypes={}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VIRT_WIDTH=1600,t.VIRT_HEIGHT=1e3},function(e,t,n){"use strict";(function(e,r){var o,i=n(5);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var a=Object(i.a)(o);t.a=a}).call(this,n(15),n(14)(e))},function(e,t,n){"use strict";var r=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n(1),a={enemies:[],collisionGrid:function(){for(var e={},n=0;n<i.VIRT_WIDTH;n+=t.COLLISION_GRID_SIZE)for(var r=0;r<i.VIRT_HEIGHT;r+=t.COLLISION_GRID_SIZE)e[n+"-"+r]=[];return e}()};t.COLLISION_GRID_SIZE=200;var u=function(e){for(var n={},o=function(r){for(var o=function(o){n[r+"-"+o]=[],e.enemies.forEach(function(e,i){var a=e.xPos-e.collisionRadius,u=e.xPos+e.collisionRadius,s=e.yPos-e.collisionRadius,c=e.yPos+e.collisionRadius,l=o+t.COLLISION_GRID_SIZE,d=r+t.COLLISION_GRID_SIZE;a>=r&&a<=d&&s>=o&&s<=l?n[r+"-"+o].push(i):u>=r&&u<=d&&s>=o&&s<=l?n[r+"-"+o].push(i):a>=r&&a<=d&&c>=o&&c<=l?n[r+"-"+o].push(i):u>=r&&u<=d&&c>=o&&c<=l?n[r+"-"+o].push(i):r>=a&&r<=u&&o>=s&&o<=c?n[r+"-"+o].push(i):d>=a&&d<=u&&o>=s&&o<=c?n[r+"-"+o].push(i):r>=a&&r<=u&&l>=s&&l<=c?n[r+"-"+o].push(i):d>=a&&d<=u&&l>=s&&l<=c&&n[r+"-"+o].push(i)})},a=0;a<i.VIRT_HEIGHT;a+=t.COLLISION_GRID_SIZE)o(a)},a=0;a<i.VIRT_WIDTH;a+=t.COLLISION_GRID_SIZE)o(a);return r({},e,{collisionGrid:n})},s=function(e){return e};t.default=function(e,t){if(void 0===e)return a;var n=e;switch(t.type){case o.ActionTypes.ENEMY_RECEIVES_BULLET:n=r({},e,{enemies:e.enemies.map(function(e,n){return r({},e,{health:n===t.enemyIdx?e.health-1:e.health})}).filter(function(e){return e.health>0})});break;case o.ActionTypes.SPAWN_ENEMY:n=r({},e,{enemies:e.enemies.concat(t.spawn)});break;case o.ActionTypes.UPDATE:n=r({},e,{enemies:e.enemies.map(s)});break;default:return e}return u(n)}},function(e,t,n){"use strict";var r=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o,i=n(0),a=n(1);!function(e){e[e.UP=0]="UP",e[e.DOWN=1]="DOWN",e[e.LEFT=2]="LEFT",e[e.RIGHT=3]="RIGHT",e[e.SHOOT=4]="SHOOT"}(o=t.PieuwerControl||(t.PieuwerControl={}));var u=function(e){return{accelerateLeft:!1,accelerateRight:!1,accelerateUp:!1,accelerateDown:!1,angle:0,ySpeed:0,shooting:!1,collisionRadius:50,health:100,yPos:a.VIRT_HEIGHT-150,xPos:e}},s={pieuwerOne:u(200),pieuwerTwo:u(a.VIRT_WIDTH-200)},c=function(e,t,n){return e>t?t:e<n?n:e},l=function(e){return r({},e,{ySpeed:e.accelerateUp?c(e.ySpeed+.25,3,-1.5):e.accelerateDown?c(e.ySpeed-.25,3,-1.5):e.ySpeed<0?c(e.ySpeed+.25,0,-1.5):e.ySpeed>0?c(e.ySpeed-.25,3,0):0,angle:e.accelerateLeft?c(e.angle-1.5,30,-30):e.accelerateRight?c(e.angle+1.5,30,-30):e.angle<0?c(e.angle+1.5,0,-30):e.angle>0?c(e.angle-1.5,30,0):0,yPos:c(Math.round(e.yPos-e.ySpeed),a.VIRT_HEIGHT,0),xPos:c(Math.round(e.xPos+.1*e.angle),a.VIRT_WIDTH,0)})},d=function(e,t,n,o){var i,a;return r({},e,((i={})[t]=r({},e[t],((a={})[n]=o,a)),i))};t.default=function(e,t){if(void 0===e)return s;switch(t.type){case i.ActionTypes.KEYUP:switch(t.key){case o.UP:return d(e,t.player,"accelerateUp",!1);case o.DOWN:return d(e,t.player,"accelerateDown",!1);case o.LEFT:return d(e,t.player,"accelerateLeft",!1);case o.RIGHT:return d(e,t.player,"accelerateRight",!1);case o.SHOOT:return d(e,t.player,"shooting",!1);default:return e}case i.ActionTypes.KEYDOWN:switch(t.key){case o.UP:return d(e,t.player,"accelerateUp",!0);case o.DOWN:return d(e,t.player,"accelerateDown",!0);case o.LEFT:return d(e,t.player,"accelerateLeft",!0);case o.RIGHT:return d(e,t.player,"accelerateRight",!0);case o.SHOOT:return d(e,t.player,"shooting",!0);default:return e}case i.ActionTypes.UPDATE:return{pieuwerOne:l(e.pieuwerOne),pieuwerTwo:l(e.pieuwerTwo)};default:return e}}},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t){e.exports={initPadEvents:({onUnmappedButton:e,onControllersChange:t},n={0:["l-axis",0],1:["l-axis",1],2:["r-axis",0],3:["r-axis",1]},r={0:"x",1:"a",2:"b",3:"y",9:"start",8:"select",5:"rt-shoulder",7:"rb-shoulder",4:"lt-shoulder",6:"lb-shoulder",10:"l-axis",11:"r-axis",12:"up",13:"down",14:"left",15:"right"})=>{const o=["a","b","x","y","start","select","up","down","left","right","rt-shoulder","rb-shoulder","lt-shoulder","lb-shoulder","l-axis","r-axis"].reduce((e,t)=>(e[t]={pressed:`gamepad-${t}-pressed`,released:`gamepad-${t}-released`},e),{});let i={},a={},u={},s={},c={};const l=e=>Math.round(100*e),d=(e,t)=>{if(1===e)return 100;if(-1===e)return-100;const n=l(e)-t;return n<20&&n>-20?0:n<0?-50:50},f=e=>{i[e.gamepad.index]=e.gamepad,a[e.gamepad.index]=Object.assign({},r),u[e.gamepad.index]=(e=>Object.keys(e).reduce((t,n)=>(t[e[n]]=!1,t),{}))(a[e.gamepad.index]),s[e.gamepad.index]=e.gamepad.axes.map(e=>l(e)),c[e.gamepad.index]=[],t&&t(Object.keys(i))};return function t(){for(let t in i){const r=i[t];0===c[t].length&&(c[t]=r.axes.map(e=>l(e)),s[t]=r.axes.map((e,n)=>d(e,c[t][n])));for(let e in r.axes){const o=d(r.axes[e],c[t][e]);if(o!==s[t][e]){const[i,a]=n[e];0===a?window.dispatchEvent(new CustomEvent(`gamepad-${i}-x-change`,{detail:{controllerIndex:t,force:o,measured:r.axes[e],rounded:l(r.axes[e])}})):window.dispatchEvent(new CustomEvent(`gamepad-${i}-y-change`,{detail:{controllerIndex:t,force:Math.abs(o),measured:r.axes[e]}})),s[t][e]=o}}for(let n in r.buttons){const{pressed:i}=r.buttons[n],s=a[t][n];s&&u[t][s]!==i&&(u[t][s]=i,window.dispatchEvent(new CustomEvent(o[s][i?"pressed":"released"],{detail:{controllerIndex:t}}))),e&&i&&!s&&e(n)}}requestAnimationFrame(t)}(),"ongamepadconnected"in window||setInterval(function(){for(var e=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[],t=0;t<e.length;t++)e[t]&&(e[t].index in i||f({gamepad:e[t]}))},50),window.addEventListener("gamepadconnected",f),window.addEventListener("gamepaddisconnected",({gamepad:e})=>{delete i[e.index],delete a[e.index],delete u[e.index],delete s[e.index],delete c[e.index],t&&t(Object.keys(i))}),Object.keys(o).map(e=>[`gamepad-${e}-pressed`,`gamepad-${e}-released`]).reduce((e,t)=>e.concat(t)).concat(["gamepad-l-axis-x-change","gamepad-l-axis-y-change","gamepad-r-axis-x-change","gamepad-r-axis-y-change"])}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=[];return{onResize:function(t){e=t},add:function(n,r,o){void 0===o&&(o=window);var i=function(t){return r(t,e)};t.push({elem:o,eventName:n,fn:i}),o.addEventListener(n,i)},clear:function(){t.forEach(function(e){var t=e.elem,n=e.eventName,r=e.fn;return t.removeEventListener(n,r)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r=t/e;function o(e,t,r){n.forEach(function(n){return n(r,e,t)})}function i(){var t=window.innerWidth,n=window.innerHeight;t*r>n?o(Math.floor(n/r),n,n/r/e):o(t,Math.floor(t*r),t/e)}i(),window.addEventListener("resize",i)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return[function(t,n,r){e.forEach(function(e){e.style.left=Math.floor((window.innerWidth-n)/2)+"px",e.style.top=Math.floor((window.innerHeight-r)/2)+"px",e.width=n,e.height=r})}].concat(t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n,r=!1;return{onResize:function(e){n=e},clear:function(){r=!0},render:function(o){r?(e.clearRect(0,0,t.width,t.height),r=!1):o.filter(function(e){return e.updated()}).forEach(function(t){return t.clear(e,n)}),o.filter(function(e){return e.updated()}).forEach(function(t){return t.draw(e,n)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=n(4),i={ArrowUp:"pieuwerOne",ArrowDown:"pieuwerOne",ArrowLeft:"pieuwerOne",ArrowRight:"pieuwerOne",0:"pieuwerOne",w:"pieuwerTwo",s:"pieuwerTwo",a:"pieuwerTwo",d:"pieuwerTwo",c:"pieuwerTwo"},a={ArrowUp:o.PieuwerControl.UP,ArrowDown:o.PieuwerControl.DOWN,ArrowLeft:o.PieuwerControl.LEFT,ArrowRight:o.PieuwerControl.RIGHT,0:o.PieuwerControl.SHOOT,w:o.PieuwerControl.UP,s:o.PieuwerControl.DOWN,a:o.PieuwerControl.LEFT,d:o.PieuwerControl.RIGHT,c:o.PieuwerControl.SHOOT},u={a:o.PieuwerControl.SHOOT,up:o.PieuwerControl.UP,down:o.PieuwerControl.DOWN,left:o.PieuwerControl.LEFT,right:o.PieuwerControl.RIGHT};t.enemyActionCreator=function(e){return{spawnEnemy:function(t,n,o,i){e({type:r.ActionTypes.SPAWN_ENEMY,spawn:function(e,t,n,r){return{accelerateLeft:!1,accelerateRight:!1,accelerateUp:!1,accelerateDown:!1,angle:0,ySpeed:0,shooting:!1,collisionRadius:r||20,health:n||1,maxHealth:n||1,yPos:t,xPos:e}}(t,n,o,i)})},enemiesReceiveBullet:function(t){var n=t.bulletIdx;t.enemies.forEach(function(t){return e({type:r.ActionTypes.ENEMY_RECEIVES_BULLET,enemyIdx:t,bulletIdx:n})})}}},t.bulletActionCreator=function(e){return{spawnBullet:function(t){if(t.shooting){var n=(t.angle-90)*(Math.PI/180);e({type:r.ActionTypes.SPAWN_BULLET,xPos:t.xPos+50*Math.cos(n),yPos:t.yPos+50*Math.sin(n),trajectory:n})}}}},t.keyActionCreator=function(e){return{onKeyDown:function(t){return e({type:r.ActionTypes.KEYDOWN,key:a[t],player:i[t]})},onKeyUp:function(t){return e({type:r.ActionTypes.KEYUP,key:a[t],player:i[t]})},onGamePadButtonDown:function(t,n){return e({type:r.ActionTypes.KEYDOWN,key:u[t],player:n})},onGamePadButtonUp:function(t,n){return e({type:r.ActionTypes.KEYUP,key:u[t],player:n})}}}},function(e,t,n){"use strict";var r=this&&this.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n(1),a={bullets:[]},u=function(e){return r({},e,{xPos:e.explosion<0?e.xPos+10*Math.cos(e.trajectory):e.xPos,yPos:e.explosion<0?e.yPos+10*Math.sin(e.trajectory):e.yPos,explosion:e.explosion>0?e.explosion-1:-1})},s=function(e){return e.xPos>0&&e.xPos<i.VIRT_WIDTH&&e.yPos>0&&e.yPos<i.VIRT_HEIGHT},c=function(e){return 0!==e.explosion};t.default=function(e,t){if(void 0===e)return a;switch(t.type){case o.ActionTypes.ENEMY_RECEIVES_BULLET:return{bullets:e.bullets.map(function(e,n){return r({},e,{explosion:n===t.bulletIdx?5:e.explosion})})};case o.ActionTypes.SPAWN_BULLET:return{bullets:e.bullets.concat({explosion:-1,xPos:t.xPos,yPos:t.yPos,trajectory:t.trajectory})};case o.ActionTypes.UPDATE:return{bullets:e.bullets.map(u).filter(c).filter(s)};default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),o=n(12),i=n(3);t.default={pieuwerStates:r.default,bulletStates:o.default,enemyStates:i.default}},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t),n.d(t,"createStore",function(){return s}),n.d(t,"combineReducers",function(){return l}),n.d(t,"bindActionCreators",function(){return f}),n.d(t,"applyMiddleware",function(){return y}),n.d(t,"compose",function(){return p}),n.d(t,"__DO_NOT_USE__ActionTypes",function(){return o});var r=n(2),o={INIT:"@@redux/INIT"+Math.random().toString(36).substring(7).split("").join("."),REPLACE:"@@redux/REPLACE"+Math.random().toString(36).substring(7).split("").join(".")},i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function u(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function s(e,t,n){var a;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(s)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var c=e,l=t,d=[],f=d,p=!1;function y(){f===d&&(f=d.slice())}function h(){if(p)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return l}function w(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(p)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return y(),f.push(e),function(){if(t){if(p)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,y();var n=f.indexOf(e);f.splice(n,1)}}}function v(e){if(!u(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(p)throw new Error("Reducers may not dispatch actions.");try{p=!0,l=c(l,e)}finally{p=!1}for(var t=d=f,n=0;n<t.length;n++){(0,t[n])()}return e}return v({type:o.INIT}),(a={dispatch:v,subscribe:w,getState:h,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");c=e,v({type:o.REPLACE})}})[r.a]=function(){var e,t=w;return(e={subscribe:function(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(h())}return n(),{unsubscribe:t(n)}}})[r.a]=function(){return this},e},a}function c(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function l(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var i=t[r];0,"function"==typeof e[i]&&(n[i]=e[i])}var a=Object.keys(n);var u=void 0;try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:o.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+o.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){u=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(u)throw u;for(var r=!1,o={},i=0;i<a.length;i++){var s=a[i],l=n[s],d=e[s],f=l(d,t);if(void 0===f){var p=c(s,t);throw new Error(p)}o[s]=f,r=r||f!==d}return r?o:e}}function d(e,t){return function(){return t(e.apply(this,arguments))}}function f(e,t){if("function"==typeof e)return d(e,t);if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":void 0===e?"undefined":i(e))+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},o=0;o<n.length;o++){var a=n[o],u=e[a];"function"==typeof u&&(r[a]=d(u,t))}return r}function p(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}function y(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){for(var n=arguments.length,r=Array(n),o=0;o<n;o++)r[o]=arguments[o];var i=e.apply(void 0,r),u=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},s={getState:i.getState,dispatch:function(){return u.apply(void 0,arguments)}},c=t.map(function(e){return e(s)});return u=p.apply(void 0,c)(i.dispatch),a({},i,{dispatch:u})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(16),o=n(13),i=n(11),a=n(0),u=n(10),s=n(9),c=n(8),l=n(7),d=n(1),f=n(6),p=n(3),y=r.createStore(r.combineReducers(o.default)),h=i.keyActionCreator(y.dispatch),w=h.onKeyUp,v=h.onKeyDown,g=h.onGamePadButtonUp,b=h.onGamePadButtonDown,m=i.bulletActionCreator(y.dispatch).spawnBullet,E=i.enemyActionCreator(y.dispatch),P=E.spawnEnemy,x=E.enemiesReceiveBullet,I=document.getElementById("pieuwer-layer"),O=document.getElementById("pieuwer2-layer"),T=document.getElementById("bullet-layer");if(!(I instanceof HTMLCanvasElement))throw new TypeError("wrong element type");if(!(O instanceof HTMLCanvasElement))throw new TypeError("wrong element type");if(!(T instanceof HTMLCanvasElement))throw new TypeError("wrong element type");var S=I.getContext("2d"),_=O.getContext("2d"),R=T.getContext("2d"),L=u.default(S,I),C=u.default(_,O),A=u.default(R,T),j=l.default(),M={};f.initPadEvents({onUnmappedButton:function(){},onControllersChange:function(e){e.length>0&&void 0===M[e[0]]&&(M[e[0]]="pieuwerOne"),e.length>1&&void 0===M[e[1]]&&(M[e[1]]="pieuwerTwo")}}),c.default(d.VIRT_WIDTH,d.VIRT_HEIGHT,s.default([I,O,T],j.onResize,L.onResize,C.onResize,A.onResize)),j.add("keydown",function(e){return v(e.key),e.preventDefault()}),j.add("keyup",function(e){return w(e.key),e.preventDefault()}),["a","b","x","y"].forEach(function(e){j.add("gamepad-"+e+"-pressed",function(e){return b("a",M[e.detail.controllerIndex])}),j.add("gamepad-"+e+"-released",function(e){return g("a",M[e.detail.controllerIndex])})}),["up","left","right","down"].forEach(function(e){j.add("gamepad-"+e+"-pressed",function(t){return b(e,M[t.detail.controllerIndex])}),j.add("gamepad-"+e+"-released",function(t){return g(e,M[t.detail.controllerIndex])})});var D=document.getElementById("debug"),N=function(){function e(e){this.state=e,this.stateChanged=!0,this.clearX=e.xPos,this.clearY=e.yPos}return e.prototype.updateState=function(e){this.stateChanged=this.state.yPos!==e.yPos||this.state.xPos!==e.xPos||this.state.angle!==e.angle,this.state=e},e.prototype.draw=function(e,t){e.fillStyle="purple",e.save(),e.translate(this.state.xPos*t,this.state.yPos*t),e.rotate(this.state.angle*Math.PI/180),e.beginPath(),e.lineWidth=4,e.strokeStyle="white",e.arc(0,0,32*t,0,Math.PI,!1),e.stroke(),e.beginPath(),e.fillStyle="white",e.arc(0,0,32*t,Math.PI/180*80,Math.PI/180*100,!1),e.lineTo(0,-50*t),e.fill(),e.restore(),this.stateChanged=!1,this.clearX=this.state.xPos,this.clearY=this.state.yPos},e.prototype.clear=function(e,t){e.clearRect((this.clearX-50)*t,(this.clearY-50)*t,100*t,100*t)},e.prototype.updated=function(){return this.stateChanged},e}(),H=new N(y.getState().pieuwerStates.pieuwerOne),U=new N(y.getState().pieuwerStates.pieuwerTwo);L.render([H]),C.render([U]);for(var G=function(){var e=y.getState(),t=e.pieuwerStates,n=e.bulletStates,r=e.enemyStates;H.updateState(t.pieuwerOne),U.updateState(t.pieuwerTwo),D.innerHTML="0\n"+JSON.stringify(y.getState().enemyStates.collisionGrid,null,2),A.clear(),L.render([H]),C.render([U]),A.render(n.bullets.map(function(e){return{updated:function(){return!0},clear:function(){},draw:function(t,n){t.beginPath(),t.fillStyle="rgba(0,0,255,"+(e.explosion<0?1:e.explosion/10)+")",t.arc(e.xPos*n,e.yPos*n,5*n*(e.explosion<0?1:2*(5-e.explosion)),0,2*Math.PI),t.fill()}}}).concat(r.enemies.map(function(e){return{updated:function(){return!0},clear:function(){},draw:function(t,n){t.beginPath(),t.fillStyle="rgba(255,0,0,"+e.health/e.maxHealth+")",t.arc(e.xPos*n,e.yPos*n,e.collisionRadius*n,0,2*Math.PI),t.fill()}}}))),requestAnimationFrame(G)},k=0;k<16;k++)P(100*k,150),P(100*k+50,250);P(500,500,50,150);window.setInterval(function(){var e=y.getState(),t=e.bulletStates.bullets,n=e.enemyStates,r=n.collisionGrid,o=n.enemies;t.map(function(e,t){return{enemies:r[function(e){return Math.floor(e.xPos/p.COLLISION_GRID_SIZE)*p.COLLISION_GRID_SIZE+"-"+Math.floor(e.yPos/p.COLLISION_GRID_SIZE)*p.COLLISION_GRID_SIZE}(e)].filter(function(t){return function(e,t){return Math.sqrt(Math.pow(e.xPos-t.xPos,2)+Math.pow(e.yPos-t.yPos,2))<t.collisionRadius}(e,o[t])}),bulletIdx:t}}).filter(function(e){e.enemies;var n=e.bulletIdx;return t[n].explosion<0}).forEach(x);y.dispatch({type:a.ActionTypes.UPDATE})},10),window.setInterval(function(){var e=y.getState().pieuwerStates,t=e.pieuwerOne,n=e.pieuwerTwo;m(t),m(n)},50),G()},function(e,t,n){e.exports=n(17)}]);
//# sourceMappingURL=index.js.map
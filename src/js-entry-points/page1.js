function rc() {
  return Math.floor(Math.random() * 10);
}

var el = document.createElement('button');

el.textContent = 'Click me!';

document.querySelector('.page__body').prepend(el);

el.addEventListener('click', () => {
  var c = `#${rc()}${rc()}${rc()}${rc()}${rc()}${rc()}`;
  document.body.style.backgroundColor = c;
});

function rc() {
  return Math.floor(Math.random() * 10);
}

var el = document.createElement('button');

el.textContent = 'Click me!';

document.querySelector('.page__body').prepend(el);

el.addEventListener('click', () => {
  console.log('🔴', `translate(${rc()}, ${rc()})`);
  el.style.transform = `translate(${rc()}px, ${rc()}px)`;
});

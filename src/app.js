import Hello from './Hello.html';
import RandomAnimal from './components/Animal.html';

console.log('Hello world');

const hello = new Hello({
	target: document.getElementById('hello-app'),
	data: {
		name: "World"
	}
});

const animal = new RandomAnimal({
	target: document.getElementById('animal-app')
});
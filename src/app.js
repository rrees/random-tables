import Hello from './Hello.html';
import RandomAnimal from './components/Animal.html';
import RyuutamaTown from './components/Town.html';

const hello = new Hello({
	target: document.getElementById('hello-app'),
	data: {
		name: "World"
	}
});

const animal = new RandomAnimal({
	target: document.getElementById('animal-app')
});

const town = new RyuutamaTown({
	target: document.getElementById('ryuutama-town')
})
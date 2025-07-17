#include "Animal.cpp"
#include "WrongAnimal.cpp"
#include "Cat.cpp"
#include "WrongCat.cpp"
#include "Dog.cpp"


int main()
{
	const WrongAnimal* meta = new WrongAnimal();
	//const WrongAnimal* j = new Dog();
	const WrongAnimal* i = new WrongCat();
	
	//std::cout << j->getType() << " " << std::endl;
	std::cout << i->getType() << " " << std::endl;
	i->makeSound(); //will output the cat sound!
	//j->makeSound();
	meta->makeSound();

	return (0);
}
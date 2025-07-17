#include "Dog.hpp"

Dog::Dog()
{
    this->_type = "DOG";
}

Dog::~Dog()
{

}

void Dog::makeSound() const
{
    std::cout << "WOUAF" << std::endl;
}
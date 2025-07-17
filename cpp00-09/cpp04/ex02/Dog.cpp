#include "Dog.hpp"

Dog::Dog()
{
    std::cout << "Dog constructor" << std::endl;
    this->_type = "DOG";
    this->_brain = new (Brain);
}

Dog::~Dog()
{
    std::cout << "Dog Destructor" << std::endl;
    delete (this->_brain);
}

Dog & Dog::operator=(const Dog &op)
{
    if (this == &op)
        return (*this);
    this->_type = op._type;
    return (*this);
}

void Dog::makeSound() const
{
    std::cout << "WOUAF" << std::endl;
}
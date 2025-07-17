#include "Animal.hpp"

Animal::Animal()
{

}

Animal::Animal(std::string type) : _type(type)
{
    std::cout << "Con" << std::endl;
}

Animal::~Animal()
{
}

Animal & Animal::operator=(const Animal &op)
{
    if (this == &op)
        return (*this);
    this->_type = op._type;
    return (*this);
}

std::string Animal::getType() const
{
    return this->_type;
}

void Animal::makeSound() const
{
    std::cout << "Defaut sound" << std::endl;
}
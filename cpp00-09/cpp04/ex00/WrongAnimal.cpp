#include "WrongAnimal.hpp"

WrongAnimal::WrongAnimal()
{

}

WrongAnimal::WrongAnimal(std::string type) : _type(type)
{
    std::cout << "Con" << std::endl;
}

WrongAnimal::~WrongAnimal()
{
}


std::string WrongAnimal::getType() const
{
    return this->_type;
}

void WrongAnimal::makeSound() const
{
    std::cout << "Defaut sound" << std::endl;
}
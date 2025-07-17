#include "AAnimal.hpp"

AAnimal::AAnimal()
{

}

AAnimal::AAnimal(std::string type) : _type(type)
{
    std::cout << "Con" << std::endl;
}

AAnimal::~AAnimal()
{
}

AAnimal & AAnimal::operator=(const AAnimal &op)
{
    if (this == &op)
        return (*this);
    this->_type = op._type;
    return (*this);
}

std::string AAnimal::getType() const
{
    return this->_type;
}

void AAnimal::makeSound() const
{
    std::cout << "Defaut sound" << std::endl;
}
#include "Cat.hpp"


Cat::Cat()
{
    this->_type = "CAT";
}

Cat::~Cat()
{

}

void Cat::makeSound() const
{
    std::cout << "MIAOU" << std::endl;
}
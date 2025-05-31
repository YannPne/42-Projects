#include "WrongCat.hpp"


WrongCat::WrongCat()
{
    this->_type = "CAT";
}

WrongCat::~WrongCat()
{

}

void WrongCat::makeSound() const
{
    std::cout << "MIAOU" << std::endl;
}
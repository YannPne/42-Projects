#include "Cat.hpp"


Cat::Cat()
{
    std::cout << "Cat constructor" << std::endl;
    this->_type = "CAT";
    this->_brain = new (Brain);
}

Cat::~Cat()
{
    std::cout << "Cat Destructor" << std::endl;
    delete (_brain);
}


Cat & Cat::operator=(const Cat &op)
{
    if (this == &op)
        return (*this);
    this->_type = op._type;
    return (*this);
}
void Cat::makeSound() const
{
    std::cout << "MIAOU" << std::endl;
}
#include "Fixed.hpp"
#include <iostream>

Fixed::Fixed() : value(0)
{
    std::cout << "Default constructor call" << std::endl;
}

Fixed::Fixed(Fixed& a)
{
    std::cout << "Copy constructor call" << std::endl;
    this->value = a.getRawBits();
}

Fixed::~Fixed()
{
    std::cout << "Destructor call" << std::endl;
}

Fixed & Fixed::operator=(const Fixed& op)
{
    std::cout << "Copy assignation operator called" << std::endl;
    if (this == &op)
        return (*this);
    this->value = op.getRawBits();
    return (*this);
}

int Fixed::getRawBits( void ) const
{
    std::cout << "getRawBits member function called" << std::endl;
    return(this->value);
}

void Fixed::setRawBits( int const raw )
{
    this->value = raw;
}

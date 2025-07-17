#include "Fixed.hpp"
#include <iostream>
#include <cmath>

Fixed::Fixed(const int nb) : value(nb << this->fractionalBits)
{
    std::cout << "Int constructor called" << std::endl;
}

Fixed::Fixed(const float float_nb)
{
    std::cout << "Float constructor called" << std::endl;
    this->value = (int)(roundf(float_nb * (1 << this->fractionalBits)));
}

Fixed::Fixed() : value(0)
{
    std::cout << "Default constructor call" << std::endl;
}

Fixed::Fixed(const Fixed& a)
{
    std::cout << "Copy constructor call" << std::endl;
    this->value = a.getRawBits();
}

Fixed::~Fixed()
{
    std::cout << "Destructor call" << std::endl;
}

Fixed & Fixed::operator=( const Fixed& op )
{
    std::cout << "Copy assignation operator called" << std::endl;
    if (this == &op)
        return (*this);
    this->value = op.getRawBits();
    return (*this);
}

int Fixed::getRawBits( void ) const
{
    //std::cout << "getRawBits member function called" << std::endl;
    return(this->value);
}

void Fixed::setRawBits( int const raw )
{
    this->value = raw;
}

float Fixed::toFloat( void ) const
{
    return ((float)this->value / (float)(1 << this->fractionalBits));
}

int Fixed::toInt( void ) const
{
    return ((int)(this->value >> this->fractionalBits));
}

std::ostream &operator<<(std::ostream &out, const Fixed &fixe)
{
    out << fixe.toFloat();
    return (out);
}

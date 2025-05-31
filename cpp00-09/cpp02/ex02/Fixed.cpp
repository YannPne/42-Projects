#include "Fixed.hpp"
#include <iostream>
#include <cmath>

Fixed::Fixed(const int nb) : value(nb << this->fractionalBits)
{
}

Fixed::Fixed(const float float_nb)
{
    this->value = (int)(roundf(float_nb * (1 << this->fractionalBits)));
}

Fixed::Fixed() : value(0)
{
}

Fixed::Fixed(const Fixed& a)
{
    this->value = a.getRawBits();
}

Fixed::~Fixed()
{
}

Fixed & Fixed::operator=( const Fixed& op )
{
    if (this == &op)
        return (*this);
    this->value = op.getRawBits();
    return (*this);
}

Fixed Fixed::operator+(const Fixed& op) const
{
    Fixed rtn;
    rtn.setRawBits(this->value + op.getRawBits());
    return (rtn);
}

Fixed Fixed::operator-(const Fixed& op) const
{
    Fixed rtn;
    rtn.setRawBits(this->value - op.getRawBits());
    return (rtn);
}

Fixed Fixed::operator*( const Fixed& op ) const
{
    Fixed rtn;
    rtn.setRawBits((this->value * op.getRawBits()) >> this->fractionalBits);
    return (rtn);
}

Fixed Fixed::operator/( const Fixed& op ) const
{
    Fixed rtn;
    rtn.setRawBits((this->value / op.getRawBits()) >> this->fractionalBits);
    return (rtn);
}

Fixed & Fixed::operator++( void )
{
    this->value++;
    return (*this);
}

Fixed & Fixed::operator--( void )
{
    this->value--;
    return (*this);
}

Fixed Fixed::operator++( int )
{
    Fixed rtn(*this);
    operator++();
    return (rtn);
}

Fixed Fixed::operator--( int )
{
    Fixed rtn(*this);
    operator--();
    return (rtn);
}


bool Fixed::operator>( const Fixed& op ) const
{
   if (this->value > op.getRawBits())
        return (1);
    return (0);
}

bool Fixed::operator<( const Fixed& op ) const
{
    if (this->value < op.getRawBits())
        return (1);
    return (0);
}

bool Fixed::operator>=( const Fixed& op ) const
{
    if (this->value >= op.getRawBits())
        return (1);
    return (0);
}

bool Fixed::operator<=( const Fixed& op ) const
{
    if (this->value <= op.getRawBits())
        return (1);
    return (0);
}

bool Fixed::operator==( const Fixed& op ) const
{
    if (this->value == op.getRawBits())
        return (1);
    return (0);
}

bool Fixed::operator!=( const Fixed& op ) const
{
    if (this->value != op.getRawBits())
        return (1);
    return (0);
}
Fixed & Fixed::min(Fixed &u, Fixed &v)
{
    if (u.getRawBits() < v.getRawBits())
        return (u);
    return (v);
}

const Fixed & Fixed::min(const Fixed &u, const Fixed &v)
{
    if (u.getRawBits() < v.getRawBits())
        return (u);
    return (v);
}

Fixed & Fixed::max(Fixed &u, Fixed &v)
{
    if (u.getRawBits() > v.getRawBits())
        return (u);
    return (v);
}

const Fixed & Fixed::max(const Fixed &u, const Fixed &v)
{
    if (u.getRawBits() > v.getRawBits())
        return (u);
    return (v);
}


int Fixed::getRawBits( void ) const
{
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
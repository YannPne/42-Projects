#include "Span.hpp"

Span::Span(unsigned int size)
{
    _size = size;
}

Span::~Span()
{

}

Span::Span(Span const &src)
{
    this->_size = src._size;
    this->_tab = src._tab;
}

Span &Span::operator=(Span const &span)
{
    if (this == &span)
        return (*this);
    this->_size = span._size;
    this->_tab = span._tab;
    return (*this);
}

const char * Span::size_limite::what() throw()
{
    return "Size limit has been exceeded";
}

const char * Span::one_number::what() throw()
{
    return "One nomber in tab";
}

void Span::addNumber(int nb)
{
    if (_tab.size() <= this->_size)
        this->_tab.push_back(nb);
    else
        throw Span::size_limite();
}
    

int Span::shortestSpan()
{
    int span;

    if (_tab.size() < 2)
        throw Span::one_number();

    std::sort(_tab.begin(), _tab.end(), std::greater<int>());
    span = _tab[0] - _tab[1];
    for (std::vector<int>::iterator it = _tab.begin(); it != --_tab.end(); it++)
        if (*it - *(it + 1) < span)
            span = *it - *(it + 1);
    return span;
}

int Span::longestSpan()
{
    int span;

    if (_tab.size() < 2)
        throw Span::one_number();

    std::sort(_tab.begin(), _tab.end(), std::greater<int>());
    span = _tab[0] - _tab[_tab.size() - 1];
    
    return span;
}
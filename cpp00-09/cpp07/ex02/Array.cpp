#include "Array.hpp"

template <typename T>

Array<T>::Array() : _tab(new T[0]), _size(0)
{

}

template <typename T>

Array<T>::~Array()
{
    delete _tab;
}

template <typename T>

Array<T>::Array(unsigned int nb) : _tab(new T[nb]), _size(nb)
{
    for (unsigned int i = 0; i < nb; i++)
        _tab[i] = 42;
}

template <typename T>

Array<T>::Array(Array &cpy)
{
    for (int i = 0; i < _size; ++i)
        _tab[i] = cpy._tab[i];
    this->_size = cpy._size;
}

template <typename T>

int Array<T>::size()
{
    return (_size);
}

template <typename T>

Array<T> & Array<T>::operator=(Array &array)
{
    if (this == &array)
        return (*this);

    delete [] this->_tab;
    this->_tab = new T[array.size()];
    this->_size = array.size();
    for (int i = 0; i < array.size(); ++i)
        this->_tab[i] = array._tab[i];
    return (*this);
}

template <typename T>

T &Array<T>::operator[](int nb)
{
    if (nb >= _size)
        throw Array::OutOfBoundException();
    return (_tab[nb]);
}

template <typename T>


const T &Array<T>::operator[](int nb) const
{
    T var;
    if (nb >= _size)
        throw Array::OutOfBoundException();
    var = _tab[nb];
    return (var);
}

template <typename T>

T *Array<T>::getTab()
{
    return (this->_tab);
}

template <typename T>

const char* Array<T>::OutOfBoundException::what() const throw()
{
    return ("Value is out of bound");
}

#ifndef _MUTANTSTACK_HPP_
#define _MUTANTSTACK_HPP_

#include <iostream>
#include <string>
#include <stack>
#include <list>

template <class T>

class MutantStack : public std::stack<T>
{
    private:
        
    public:
        MutantStack();
        MutantStack(MutantStack const &op);
        ~MutantStack();

        MutantStack<T> &operator=(MutantStack<T> const &op);

        typedef typename std::stack<T>::container_type::iterator iterator;

        iterator begin();
        iterator end();
};

#endif
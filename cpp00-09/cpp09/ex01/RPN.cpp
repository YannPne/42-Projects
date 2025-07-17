#include "RPN.hpp"
#include <iostream>

RPN::RPN()
{
}

RPN::~RPN()
{
}

std::stack<int> RPN::get_stack()
{
    return (stack);
}

int RPN::calcul(char c)
{
    switch (c)
    {
    case '-':
        break;
    case '+':
        break;
    case '*':
        break;
    case '/':
        break;
    default :
        return (0);
    }

    if (this->stack.size() < 2)
    {
        std::cerr << "size error" << std::endl;
        return (1);
    }

    int nb2 = stack.top();
    stack.pop();
    int nb = stack.top();
    stack.pop();

    switch (c)
    {
    case '-':
        stack.push(nb - nb2);
        break;
    case '+':
        stack.push(nb + nb2);
        break;
    case '*':
        stack.push(nb * nb2);
        break;
    case '/':
        stack.push(nb / nb2);
        break;
    }
    return 0;
}

void RPN::ADD(const char convert)
{
    int nb;

    if (convert >= '0' && convert <= '9')
    {
        nb = convert - '0';
        this->stack.push(nb);
    }
}

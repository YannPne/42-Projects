#include "RPN.hpp"
#include <iostream>

int main(int argc, char **argv)
{
    RPN rpn;

    if (argc != 2)
    {
    	std::cout << "error arg" << std::endl;
        return (1);
    }
    for (int i = 0; argv[1][i] != '\0'; i++)
    {
        if (rpn.calcul(argv[1][i]))
        	return (1);
        rpn.ADD(argv[1][i]);
    }
    if (rpn.get_stack().size() > 0)
        std::cout << "result : " << rpn.get_stack().top() << std::endl;
return (0);
}

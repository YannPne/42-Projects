#include <iostream>
#include <vector>


class error : std::exception
{
    public :
        virtual const char * what() const throw();
};

const char * error::what() const throw()
{
    return ("nb not found in tab");
}

template <typename T>

int easyfind(T const &tab, int nb)
{
    typename T::const_iterator it;

    for (it = tab.begin(); it != tab.end(); ++it)
        if (*it == nb)
            return (nb);
    throw error();
}

int main(int argc, char **argv)
{
    std::vector<int> tab = {1, 2, 3, 4, 5};
    int nb = 5;

    try
    {
        int result = easyfind(tab, nb);
        std::cout << result << std::endl;
    }
    catch (const error &e)
    {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}
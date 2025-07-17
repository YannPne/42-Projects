#include <iostream>

template <typename T>

void iter(T *tab, int len, void (*fct)(T &value))
{
    for (int i = 0; i < len; i++)
        fct(tab[i]);
}
template <typename T>

void printValue(T &value)
{
    std::cout << value << std::endl;
}

int	main()
{
	char	array[] = {'a', 'b', 'c', 'd'};

	iter(array, 4, printValue<char>);
}
#include <iostream>
#include <cctype>

int main(int argc, char **argv)
{
    int e;

    if (argc == 1)
        std::cout <<  "* LOUD AND UNBEARABLE FEEDBACK NOISE *";
    else
    {
        for (int i = 1; i < argc; i++)
        {
            e = -1;
            while (argv[i][++e])
                std::cout << (char)std::toupper(argv[i][e]);
            std::cout << ' ';
        }
    }
    std::cout << std::endl;
	return (0);
}
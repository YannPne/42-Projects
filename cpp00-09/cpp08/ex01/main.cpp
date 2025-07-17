#include <iostream>
#include <random>
#include "Span.hpp"

int main(int argc, char **argv)
{
    Span span(11000);

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(1, 10000000);

    for (int i = 0; i < 1000; ++i)
        span.addNumber(distrib(gen));

    try
    {
        span.addNumber(6);
    }
    catch (Span::size_limite &e)
    {
        std::cerr << e.what() << std::endl;
    }
    try
    {
        //span.addNumber(1);
        //span.addNumber(3);
        //span.addNumber(9);
        //span.addNumber(11);

        std::cout << "short span : " << span.shortestSpan() << std::endl;
        std::cout << "long span : " << span.longestSpan() << std::endl;
    }
    catch (Span::size_limite &e)
    {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}
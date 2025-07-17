#include <iostream>
#include <vector>
#include <algorithm>

class Span
{
private:
    std::vector<int> _tab;
    unsigned int _size;
public:

    Span(unsigned int size);
    Span(Span const & src);
    ~Span();

    Span &operator=(Span const &src);

    void addNumber(int nb);

    int shortestSpan();
    int longestSpan();

    class size_limite : std::exception
    {
        public :
            virtual const char * what() throw();
    };
    class one_number : std::exception
    {
        public :
            virtual const char * what() throw();
    };
};

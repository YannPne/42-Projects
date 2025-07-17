#include <iostream>


template <typename T>

class Array
{
    private:
        T *_tab;
        int _size;
    public:
        Array();
        Array(unsigned int nb);
        Array(Array &cpy);
        ~Array();

        Array &operator=(Array &array);

        T &operator[](int index);
        const T &operator[](int index) const;

        class OutOfBoundException : public std::exception
		{
			public:
				virtual const char* what() const throw();
		};

        int size();
        T *getTab();
};

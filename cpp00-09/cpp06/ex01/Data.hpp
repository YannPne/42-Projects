#ifndef _DATA_HPP_
#define _DATA_HPP_

#include <iostream>
#include <string>

typedef std::string str;

class Data {
	public:
		Data();
		Data(Data const &src);
		~Data();

		Data &	operator=(Data const &rSym);
		int		getSize() const;
	private:
		int	_size;
};

std::ostream &	operator<<(std::ostream & o, Data const &rSym);

#endif
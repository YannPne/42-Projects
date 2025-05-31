#include "Data.hpp"

Data::Data() : _size(10) {
	std::cout << "[C] Data default constructor called." << std::endl;
}

Data::Data(Data const &src) {
	std::cout << "[C] Data copy constructor called." << std::endl;
	*this = src;
}

Data::~Data() {
	std::cout << "[D] Data default destructor called." << std::endl;
}

Data &	Data::operator=(Data const &rSym) {
	if (this != &rSym) {
		this->_size = rSym._size;
	}
	return *this;
}

std::ostream &	operator<<(std::ostream & o, Data const &rSym) {
	o << rSym.getSize();
	return o;
}

int	Data::getSize() const {
	return this->_size;
}
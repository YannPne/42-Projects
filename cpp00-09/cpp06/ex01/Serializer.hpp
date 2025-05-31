#ifndef _SERIALIZER_HPP_
#define _SERIALIZER_HPP_

#include <iostream>
#include <string>
#include <stdint.h>
#include "Data.hpp"

typedef std::string str;

class Data;

class Serializer {
	public:
		static uintptr_t	serialize(Data * ptr);
		static Data *		deserialize(uintptr_t raw);

	private:
		Serializer();
		Serializer(Serializer const &src);
		~Serializer();

		Serializer &	operator=(Serializer const &rSym);
};

#endif
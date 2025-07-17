#include "Serializer.hpp"
#include "Data.hpp"

int main() {
	Data *		data = new Data;
	uintptr_t	raw;

	std::cout << data << std::endl;

	raw = Serializer::serialize(data);

	std::cout << raw << std::endl;

	data = Serializer::deserialize(raw);

	std::cout << data << std::endl;

	delete data;
	return 0;
}
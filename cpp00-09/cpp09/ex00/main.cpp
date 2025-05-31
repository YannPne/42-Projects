#include "BitCoinExchange.hpp"

int	main(int argc, char** argv) {
	if (argc != 2) {
		std::cerr<<"btc programm need one filename in argument"<<std::endl;
		return 1;
	}
	std::ifstream	infile_stream(argv[1]);
	if (!infile_stream.is_open()) {
		std::cerr<<"Error: could not open file."<<std::endl;
		return 1;
	}
	int i = 0;
	try {
	BitCoinExchange	btc;
	std::string	read_line;//stock what is read in infile
	while (std::getline(infile_stream, read_line))//envoie le contenu jusqu'à \n dans read_line
	{
		i++;
		btc.addLine(read_line);
		if (btc.checkFormat())
			btc.calculChange();
	}
	if (i == 0) {
		std::cerr<<"ERROR : the file is empty"<<std::endl;
		return 1;
	}
	} catch (std::exception & e) {
		std::cerr<<"ERROR: "<<e.what()<<std::endl;
	}
	return 0;
}
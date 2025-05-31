
#include "BitCoinExchange.hpp"

BitCoinExchange::BitCoinExchange() {
	std::ifstream	infile("input.csv");
	if (!infile.is_open())
		throw BtcException("data.csv opening failed");
	while (std::getline(infile, _current_line)) {
		if (!is_title(_current_line) && checkDate(collectTm("1900-01-02"))) {
			for (size_t i = 10; i < _current_line.size(); ++i) {
				if (std::isdigit(_current_line[i]) && checkNumber(_current_line.substr(i, _current_line.size() - i))) {
					_tab_ref[_current_date] = _current_value;
					break;
				}
			}
		}
	}
	// std::map<std::tm, float>::iterator	it;
	// for (it = _tab_ref.begin(); it != _tab_ref.end(); ++it)
	// 	std::cout<<printTime(it->first)<<" = "<<it->second<<std::endl;
}

BitCoinExchange::BitCoinExchange(BitCoinExchange const & src) {
	*this = src;
}

BitCoinExchange::~BitCoinExchange() {}

BitCoinExchange &	BitCoinExchange::operator=(BitCoinExchange const & src) {
	if (this != &src) {
		_current_line = src._current_line;
		_current_value = src._current_value;
		_current_date = src._current_date;
		_tab_ref = src._tab_ref;
	}
	return *this;
}

void	BitCoinExchange::addLine(std::string & line) {
			_current_line = line;
		}

bool	BitCoinExchange::checkDate(std::tm const & min_date) {
	for (int i = 0; i < 10; ++i) {
		if (((i < 4 || i == 5 || i == 6 || i == 8 || i == 9) && !std::isdigit(_current_line[i]))
		|| ((i == 4 || i == 7) && _current_line[i] != '-')) {
			std::cerr<<"ERROR: wrong format, the date must be \"YYYY-MM-DD\""<<std::endl;
			return false;
		}
	}
	int year = std::atoi(_current_line.substr(0, 4).c_str());
	/*range à définir*/
	if (year > 2024) {
		std::cerr<<"Error: bad input => "<<_current_line.substr(0, 10)<<std::endl;
		return false;
	}
	int month = std::atoi(_current_line.substr(5, 2).c_str());
	if (month < 1 || month > 12) {
		std::cerr<<"Error: bad input => "<<_current_line.substr(0, 10)<<std::endl;
		return false;
	}
	int day = std::atoi(_current_line.substr(8, 2).c_str());
	if (day < 0 || day > 31 || (month == 2 && day > 28)
	|| ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31)) {
		std::cerr<<"Error: bad input => "<<_current_line.substr(0, 10)<<std::endl;
		return false;
	}
	/*date value*/
	_current_date = collectTm(_current_line);
	if (!compareDate(min_date, _current_date)) {
		std::cerr<<"Error: wrong date, the date must be between "<<printTime(_tab_ref.begin()->first)<<" and today"<<std::endl;
		return false;
	}

	return true;
}

bool	BitCoinExchange::checkNumber(std::string const & line) {
	if (line.size() > 8) {
		std::cerr<<"Error: too large a number."<<std::endl;
		return false;
	}
	size_t size = line.size();
	for (size_t i = 0; i < size; ++i)//int ou float entre 0 et 1000, un float = 7 chiffre maxi
	{
		if (!std::isdigit(line[i])) {
			if (line[i] == '-' && i == 0) {
				std::cerr<<"Error: not a positive number."<<std::endl;
				return false;
			}
			else if ((line[i] == '.' &&
			(i == 0 || i == line.size() - 1 || !std::isdigit(line[i + 1]))) ||
			line[i] != '.') {
				std::cerr<<"Error: bad input => "<<line<<std::endl;
				return false;
			}
		}
	}
	float	value = std::atof(line.c_str());
	_current_value = value;
	return true;
}

bool	BitCoinExchange::checkFormat() {
	if (!is_title(_current_line) && checkDate(_tab_ref.begin()->first)) {
		if (_current_line.compare(10, 3, " | ") == 0) {
			if (checkNumber(_current_line.substr(13,_current_line.size() - 13)))
				return true;
		}
		else
			std::cerr<<"ERROR:  wrong format, the input must be \"YYYY-MM-DD | float_between_0_and_1000\""<<std::endl;
	}
	return false;
}

void	BitCoinExchange::calculChange() {
	std::map<std::tm, float, tmCompare>::iterator	it;
	it = _tab_ref.find(_current_date);
	if (it == _tab_ref.end())//on a pas trouvé la date exacte dans tab
	{
		it = _tab_ref.lower_bound(_current_date);
		it--;
	}
	if (_current_value > 1000) {
		std::cerr<<"Error: too large a number."<<std::endl;
		return;
	}
	std::cout<<_current_line.substr(0, 10)<<" => "<<_current_value<<" = "<<_current_value * it->second<<std::endl;
}

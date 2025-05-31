#include "BitCoinExchange.hpp"

bool	is_title(std::string const & line) {
	for (size_t i = 0; i < line.size(); ++i) {
		if (std::isdigit(line[i]))
			return false;
	}
	return true;
}
std::tm	collectTm(std::string const & line) {
	int year = std::atoi(line.substr(0, 4).c_str());
	int month = std::atoi(line.substr(5, 2).c_str());
	int day = std::atoi(line.substr(8, 2).c_str());

	std::tm	date;
	std::memset(&date, 0, sizeof(date));//initialise un tm pour y stocker la date à comparer
	date.tm_year = year - 1900;//année depuis 1900
	date.tm_mon = month - 1;//janvier = 0; decembre = 11
	date.tm_mday = day;
	return date;
}

float	collectValue(std::string const & line, int i) {
	int size = line.size() - i;
	float	value = std::atof(line.substr(i, size).c_str());
	return value;
}

bool	compareDate(std::tm min_date, tm const & date) {
	time_t	today = time(0);//recupere la date d'aujourd'hui
	time_t	min_time = mktime(const_cast<tm*>(&min_date));
	time_t	time_to_compare = mktime(const_cast<tm*>(&date));
	if (time_to_compare > min_time && time_to_compare < today)
		return true;
	return false;
}

std::string printTime(std::tm timeStruct) {
	char buffer[80];

	std::strftime(buffer, sizeof(buffer), "%Y-%m-%d", &timeStruct);
	return std::string(buffer);
}
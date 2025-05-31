#include <iostream>
#include <map>
#include <fstream>
#include <vector>
#include <ctime>
#include <algorithm>
#include <cstring>

#ifndef BITCOINEXCHANGE_HPP
#define BITCOINEXCHANGE_HPP

/*struc à fournir à std::map pour comparer les dates au format tm et les mettres dans l'ordre croissant*/
struct tmCompare {
    bool operator()(const std::tm& lhs, const std::tm& rhs) const {
        if (lhs.tm_year != rhs.tm_year) return lhs.tm_year < rhs.tm_year;
        if (lhs.tm_mon != rhs.tm_mon) return lhs.tm_mon < rhs.tm_mon;
        return lhs.tm_mday < rhs.tm_mday;
    }
};

std::tm	collectTm(std::string const & line);
float	collectValue(std::string const & line, int i);
bool	compareDate(std::tm min_date, tm const & date);
bool	is_title(std::string const & line);
std::string printTime(std::tm timeStruct);

class	BitCoinExchange {
	private:
		std::string	_current_line;
		std::tm	_current_date;
		float	_current_value;
		std::map<std::tm, float, tmCompare>	_tab_ref;
	public:
		BitCoinExchange();
		BitCoinExchange(BitCoinExchange const & src);
		BitCoinExchange &	operator=(BitCoinExchange const & src);
		~BitCoinExchange();
		void	addLine(std::string & line);
		bool	checkDate(std::tm const & min_date);
		bool	checkNumber(std::string const & line);
		bool	checkFormat();
		void	calculChange();
		class	BtcException : public std::exception {
			private:
			std::string	_message;
			public:
				BtcException(std::string const & message) : _message(message) {}
				virtual ~BtcException()  throw() {}
				virtual const char*	what() const throw() {
					return _message.c_str();
				}
		};
};

#endif
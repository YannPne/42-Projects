#ifndef _PMERGEME_HPP_
#define _PMERGEME_HPP_

#include <iostream>
#include <iomanip>
#include <sstream>
#include <string>
#include <vector>
#include <list>
#include <algorithm>
#include <ctime>
#include <cstdlib>
#include <utility>
#include <deque>

typedef std::string str;

class PmergeMe {
	public:
		PmergeMe(std::vector<int> & input, int size);
		PmergeMe(PmergeMe const &src);
		~PmergeMe();

		PmergeMe &	operator=(PmergeMe const &rSym);
	private:
		std::vector<int>	_vector;
		std::deque<int>		_deque;
		const int			_size;

		void	_vecSort();
		void	_listSort();
};

#endif
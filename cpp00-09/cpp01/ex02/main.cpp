# include <iostream>

int main(void)
{
    std::string str = "HI THIS IS BRAIN";

    std::string *strPTR = &str;
    std::string& strREF = str;

    std::cout << &str << std::endl << strPTR << std::endl << &strREF << std::endl;
    std::cout << std::endl << str << std::endl << *strPTR << std::endl << strREF << std::endl;

    return (0);
}
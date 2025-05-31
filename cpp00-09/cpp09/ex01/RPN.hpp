#include <stack>

class RPN
{
private:
    std::stack<int> stack;

public:
    RPN();
    ~RPN();

    int calcul(char c);
    void ADD(const char convert);


    std::stack<int> get_stack();

};

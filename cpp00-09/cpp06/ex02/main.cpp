#include "Base.hpp"
#include "A.hpp"
#include "B.hpp"
#include "C.hpp"

void check(Base *ptr)
{
    if (dynamic_cast<A *>(ptr))
        std::cout << "The class type is : A" << std::endl;
    if (dynamic_cast<B *>(ptr))
        std::cout << "The class type is : B" << std::endl;
    if (dynamic_cast<C *>(ptr))
        std::cout << "The class type is : C" << std::endl;
}

void check(Base &ptr)
{
    try 
    {
        A &a = dynamic_cast<A&>(ptr);
        std::cout << "The pointer is a A type." << std::endl;
    }
    catch (const std::exception e) {}
     try 
    {
        B &b = dynamic_cast<B&>(ptr);
        std::cout << "The pointer is a B type." << std::endl;
    }
    catch (const std::exception e) {}
     try 
    {
        C &c = dynamic_cast<C&>(ptr);
        std::cout << "The pointer is a C type." << std::endl;
    }
    catch (const std::exception e) {}
}

int main()
{
    Base *ptrA = new A;
    Base *ptrB = new B;
    Base *ptrC = new C;

    check(ptrA);
    check(ptrC);
    check(ptrB);

    delete ptrA;
    delete ptrB;
    delete ptrC;
}

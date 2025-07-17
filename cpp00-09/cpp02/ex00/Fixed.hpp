class Fixed
{
private:
    
    int value;
    static const int valueCS;

public:

    Fixed();
    Fixed(Fixed& a);
    virtual ~Fixed();

    Fixed &operator=(const Fixed& op);


    int getRawBits( void ) const;
    void setRawBits( int const raw );
};

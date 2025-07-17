class Fixed
{
private:
    
    int value;
    static const int fractionalBits = 8;

public:

    Fixed();
    Fixed(const int nb);
    Fixed(const float float_nb);
    Fixed(const Fixed& a);

    virtual ~Fixed();
    Fixed &operator=(const Fixed& op);


    int getRawBits( void ) const;
    void setRawBits( int const raw );
    float toFloat( void ) const;
    int toInt( void ) const;
};

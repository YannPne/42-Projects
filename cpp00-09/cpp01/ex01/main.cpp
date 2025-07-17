# include "zombie.cpp"

Zombie *zombieHorde( int n, std::string name )
{
    Zombie *zombie = new Zombie[n];

    for (int i = 0; i < n; i++)
        zombie[i].setName(name);

    return (zombie);
}

int main(void)
{
    Zombie *Horde;
    int nb = 5;

    Horde = zombieHorde(nb, "Zombie");
    
    Horde->announce();

    for (int i = 0; i < nb; i++)
        Horde[i].announce();

    delete [] Horde;

    return (0);
}
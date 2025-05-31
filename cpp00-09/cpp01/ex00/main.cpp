# include "zombie.cpp"

void randomChump( std::string name )
{
    Zombie zombie = Zombie(name);
    zombie.announce();
}
Zombie *newZombie( std::string name )
{
    Zombie *zombie = new Zombie(name);

    return (zombie);
}

int main(void)
{
    Zombie *zombie;

    zombie = newZombie("Zombie1");
    randomChump("Zombie2");

    delete zombie;
    
    return (0);
}
#include <string>
#include <iostream>
#include <fstream>

int replace(char **argv)
{
    std::string filename = argv[1];
    std::string str1 = argv[2];
    std::string str2 = argv[3];
    std::string line;
    std::ifstream ifs(filename.c_str());
    
    if (!ifs.is_open()) 
    {
        std::cerr << "Impossible d'ouvrir le fichier : " << filename << std::endl;
        return 1;
    }
    
    std::ofstream ofs((filename + ".replace").c_str()); 

    while (std::getline(ifs, line)) 
    {
        std::size_t found;

        while ((found = line.find(str1)) != std::string::npos) 
            line.replace(found, str1.length(), str2);
        ofs << line << std::endl;
    }

    ifs.close();
    ofs.close();

    return 0;
}

int main(int argc, char **argv)
{
    if (argc == 4)
        return replace(argv);
    
    std::cout << "Il faut au moins 3 arguments : filename / str1 / str2" << std::endl;
    return 1;
}


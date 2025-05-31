NAME = RPN
CC = c++
CFLAGS = -Wall -Wextra -Werror -std=c++98 -g
OBJ_DIR = obj/
SRC = $(wildcard *.cpp)
OBJS = $(SRC:%.cpp=$(OBJ_DIR)%.o)

all: $(NAME)

$(OBJ_DIR)%.o: %.cpp
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME)

clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -rf $(NAME)

re: fclean all